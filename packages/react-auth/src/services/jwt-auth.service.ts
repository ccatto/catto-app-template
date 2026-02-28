/**
 * @catto/react-auth - JWT Auth Service
 *
 * Platform-agnostic JWT authentication service.
 * Handles token storage, login, register, refresh, and passkey auth.
 *
 * Uses IAuthStorage for token persistence and IAuthApiService for API calls.
 *
 * @example
 * ```typescript
 * import { JwtAuthService, CapacitorAuthStorage } from '@catto/react-auth';
 *
 * const storage = new CapacitorAuthStorage({ keyPrefix: 'myapp' });
 * const authService = new JwtAuthService(storage, myApiService, undefined, {
 *   onSessionExpired: () => router.push('/login'),
 * });
 * await authService.login({ email, password });
 * ```
 */
import type { IAuthStorage } from '../storage/auth-storage.interface';
import type {
  AuthUser,
  IAuthApiService,
  IAuthLogger,
  LoginCredentials,
  LoginResponse,
  RegisterData,
} from './auth-api.interface';

// Re-export types for convenience
export type {
  AuthUser,
  LoginCredentials,
  RegisterData,
  LoginResponse,
  AuthTokens,
} from './auth-api.interface';

const noopLogger: IAuthLogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
};

export interface JwtAuthServiceOptions {
  /** Called when session expires (refresh token fails). Use to redirect to login. */
  onSessionExpired?: () => void;
}

export class JwtAuthService {
  private log: IAuthLogger;
  private options: JwtAuthServiceOptions;

  // Fix 7: Cache token expiry to avoid re-parsing JWT on every getAuthHeaders()
  private cachedTokenExp: { token: string; exp: number } | null = null;

  // Fix 5: Refresh deduplication + cooldown after failure
  private refreshPromise: Promise<string> | null = null;
  private lastRefreshFailure: number = 0;
  private static REFRESH_COOLDOWN_MS = 5000; // 5 second cooldown after failure

  constructor(
    private storage: IAuthStorage,
    private api: IAuthApiService,
    logger?: IAuthLogger,
    options?: JwtAuthServiceOptions,
  ) {
    this.log = logger || noopLogger;
    this.options = options || {};
  }

  /** Login with email and password */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const data = await this.api.login(credentials);
      await this.storage.setAccessToken(data.accessToken);
      await this.storage.setRefreshToken(data.refreshToken);
      this.log.info('User logged in successfully', { userId: data.user.id });
      return data;
    } catch (error) {
      this.log.error('Login failed', { error });
      throw error;
    }
  }

  /** Register new user */
  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const result = await this.api.register(data);
      await this.storage.setAccessToken(result.accessToken);
      await this.storage.setRefreshToken(result.refreshToken);
      this.log.info('User registered successfully', { userId: result.user.id });
      return result;
    } catch (error) {
      this.log.error('Registration failed', { error });
      throw error;
    }
  }

  /** Logout (clear tokens) */
  async logout(): Promise<void> {
    try {
      const refreshToken = await this.storage.getRefreshToken();
      if (refreshToken) {
        await this.api.logout(refreshToken).catch(() => {});
      }
    } finally {
      await this.storage.clearTokens();
      this.cachedTokenExp = null;
      this.log.info('User logged out');
    }
  }

  /** Refresh access token */
  async refreshAccessToken(): Promise<string> {
    const refreshToken = await this.storage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const result = await this.api.refreshToken(refreshToken);
      await this.storage.setAccessToken(result.accessToken);
      return result.accessToken;
    } catch (error) {
      await this.storage.clearTokens();
      this.cachedTokenExp = null;
      this.log.error('Token refresh failed', { error });
      this.options.onSessionExpired?.();
      throw new Error('Session expired');
    }
  }

  /** Get current access token */
  async getAccessToken(): Promise<string | null> {
    return this.storage.getAccessToken();
  }

  /** Check if a JWT token is expired or about to expire */
  private isTokenExpiredOrExpiring(
    token: string,
    bufferSeconds = 120,
  ): boolean {
    try {
      let exp: number;

      // Fix 7: Use cached expiry if token hasn't changed
      if (this.cachedTokenExp?.token === token) {
        exp = this.cachedTokenExp.exp;
      } else {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        exp = payload.exp;
        if (!exp) return true;
        this.cachedTokenExp = { token, exp };
      }

      const nowSeconds = Math.floor(Date.now() / 1000);
      return nowSeconds >= exp - bufferSeconds;
    } catch {
      return true;
    }
  }

  /**
   * Get auth headers for API requests.
   * Proactively refreshes the access token if it's expired or about to expire.
   * Includes cooldown to prevent repeated refresh attempts after failure.
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    let token = await this.getAccessToken();
    if (!token) return {};

    if (this.isTokenExpiredOrExpiring(token)) {
      // Fix 5: Skip refresh if we recently failed (cooldown)
      const timeSinceFailure = Date.now() - this.lastRefreshFailure;
      if (
        this.lastRefreshFailure > 0 &&
        timeSinceFailure < JwtAuthService.REFRESH_COOLDOWN_MS
      ) {
        return {};
      }

      try {
        if (!this.refreshPromise) {
          this.refreshPromise = this.refreshAccessToken().finally(() => {
            this.refreshPromise = null;
          });
        }
        token = await this.refreshPromise;
        this.lastRefreshFailure = 0;
      } catch {
        this.lastRefreshFailure = Date.now();
        return {};
      }
    }

    return { Authorization: `Bearer ${token}` };
  }

  /** Check if user is authenticated */
  async isAuthenticated(): Promise<boolean> {
    return this.storage.hasTokens();
  }

  /** Check if tokens exist in storage */
  async hasTokens(): Promise<boolean> {
    return this.storage.hasTokens();
  }

  /** Decode JWT token (client-side only — for user info, NOT for security) */
  decodeToken(token: string): AuthUser | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      const payload = JSON.parse(jsonPayload);
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name || null,
        role: payload.role || 'user',
        playerID: payload.playerID,
        organizationId: payload.organizationId,
      };
    } catch {
      return null;
    }
  }

  /** Get current user from token (client-side decode) */
  async getCurrentUser(): Promise<AuthUser | null> {
    const token = await this.getAccessToken();
    if (!token) return null;
    return this.decodeToken(token);
  }

  /** Login with passkey (WebAuthn/FIDO2) */
  async loginWithPasskey(): Promise<LoginResponse> {
    if (
      !this.api.generatePasskeyAuthenticationOptions ||
      !this.api.verifyPasskeyAuthentication
    ) {
      throw new Error('Passkey authentication not configured');
    }

    const { startAuthentication, browserSupportsWebAuthn } =
      await import('@simplewebauthn/browser');

    if (!browserSupportsWebAuthn()) {
      throw new Error('WebAuthn is not supported on this device');
    }

    try {
      const { options, sessionId } =
        await this.api.generatePasskeyAuthenticationOptions();

      const authResponse = await startAuthentication({
        optionsJSON: JSON.parse(options),
      });

      const result = await this.api.verifyPasskeyAuthentication(
        sessionId,
        JSON.stringify(authResponse),
      );

      await this.storage.setAccessToken(result.accessToken);
      await this.storage.setRefreshToken(result.refreshToken);

      this.log.info('Passkey auth successful', { userId: result.user.id });
      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'NotAllowedError') {
        throw new Error('Passkey authentication was cancelled');
      }
      this.log.error('Passkey auth failed', { error });
      throw error;
    }
  }

  /** Send OTP to phone number for phone-based login */
  async sendPhoneOtp(
    phoneNumber: string,
  ): Promise<{ success: boolean; message: string; expiresIn: number }> {
    if (!this.api.sendPhoneOtp) {
      throw new Error('Phone OTP not configured');
    }

    try {
      const result = await this.api.sendPhoneOtp(phoneNumber);
      if (result.success) {
        this.log.info('OTP sent', { phoneNumber: phoneNumber.slice(-4) });
      } else {
        this.log.warn('OTP send failed', {
          phoneNumber: phoneNumber.slice(-4),
          message: result.message,
        });
      }
      return result;
    } catch (error) {
      this.log.error('Failed to send OTP', { error });
      throw error;
    }
  }

  /** Verify OTP and login/register user */
  async verifyPhoneOtp(
    phoneNumber: string,
    code: string,
  ): Promise<LoginResponse & { isNewUser: boolean }> {
    if (!this.api.verifyPhoneOtp) {
      throw new Error('Phone OTP not configured');
    }

    try {
      const result = await this.api.verifyPhoneOtp(phoneNumber, code);

      if (!result.success || !result.accessToken || !result.refreshToken) {
        throw new Error(result.message || 'Verification failed');
      }

      await this.storage.setAccessToken(result.accessToken);
      await this.storage.setRefreshToken(result.refreshToken);

      const user = this.decodeToken(result.accessToken);
      if (!user) {
        throw new Error('Failed to decode user token');
      }

      this.log.info('Phone auth successful', {
        userId: user.id,
        isNewUser: result.isNewUser,
      });

      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user,
        isNewUser: result.isNewUser ?? false,
      };
    } catch (error) {
      this.log.error('Phone OTP verification failed', { error });
      throw error;
    }
  }
}
