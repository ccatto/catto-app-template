import { log } from '@app/lib/logger';
import { AuthGraphQLService } from './auth-graphql.service';
import type { IAuthStorage } from './storage';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  playerID?: number;
  organizationId?: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

/**
 * Platform-agnostic JWT authentication service
 * Works on both web and mobile without platform detection
 *
 * Uses AuthGraphQLService for API calls (GraphQL backend)
 * Uses IAuthStorage for token persistence (Capacitor Preferences)
 */
export class JwtAuthService {
  constructor(private storage: IAuthStorage) {}

  /**
   * Login with email and password via GraphQL
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const data = await AuthGraphQLService.login(credentials);

      // Store tokens (platform-agnostic!)
      await this.storage.setAccessToken(data.accessToken);
      await this.storage.setRefreshToken(data.refreshToken);

      log.info('User logged in successfully', { userId: data.user.id });

      return data;
    } catch (error) {
      log.error('Login failed', { error });
      throw error;
    }
  }

  /**
   * Register new user via GraphQL
   */
  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const result = await AuthGraphQLService.register(data);

      // Store tokens
      await this.storage.setAccessToken(result.accessToken);
      await this.storage.setRefreshToken(result.refreshToken);

      log.info('User registered successfully', { userId: result.user.id });

      return result;
    } catch (error) {
      log.error('Registration failed', { error });
      throw error;
    }
  }

  /**
   * Logout (clear tokens) via GraphQL
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = await this.storage.getRefreshToken();

      if (refreshToken) {
        // Call backend to invalidate refresh token
        await AuthGraphQLService.logout(refreshToken).catch(() => {
          // Ignore errors - still clear local tokens
        });
      }
    } finally {
      await this.storage.clearTokens();
      log.info('User logged out');
    }
  }

  /**
   * Refresh access token via GraphQL
   */
  async refreshAccessToken(): Promise<string> {
    const refreshToken = await this.storage.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const result = await AuthGraphQLService.refreshToken(refreshToken);

      await this.storage.setAccessToken(result.accessToken);

      return result.accessToken;
    } catch (error) {
      // Refresh token is invalid - force logout
      await this.storage.clearTokens();
      log.error('Token refresh failed', { error });
      throw new Error('Session expired');
    }
  }

  /**
   * Get current access token
   */
  async getAccessToken(): Promise<string | null> {
    return this.storage.getAccessToken();
  }

  /**
   * Check if a JWT token is expired or about to expire.
   * Returns true if expired or expiring within the buffer period.
   */
  private isTokenExpiredOrExpiring(
    token: string,
    bufferSeconds = 120,
  ): boolean {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      const exp = payload.exp;
      if (!exp) return true; // No expiry claim = treat as expired
      const nowSeconds = Math.floor(Date.now() / 1000);
      return nowSeconds >= exp - bufferSeconds;
    } catch {
      return true; // Can't decode = treat as expired
    }
  }

  // Prevent concurrent refresh attempts
  private refreshPromise: Promise<string> | null = null;

  /**
   * Get auth headers for API requests.
   * Proactively refreshes the access token if it's expired or about to expire.
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    let token = await this.getAccessToken();

    if (!token) return {};

    // If token is expired or expiring within 2 minutes, try to refresh
    if (this.isTokenExpiredOrExpiring(token)) {
      try {
        // Deduplicate concurrent refresh calls
        if (!this.refreshPromise) {
          this.refreshPromise = this.refreshAccessToken().finally(() => {
            this.refreshPromise = null;
          });
        }
        token = await this.refreshPromise;
      } catch {
        // Refresh failed - return empty headers (will trigger UNAUTHENTICATED)
        return {};
      }
    }

    return { Authorization: `Bearer ${token}` };
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    return this.storage.hasTokens();
  }

  /**
   * Check if tokens exist in storage
   */
  async hasTokens(): Promise<boolean> {
    return this.storage.hasTokens();
  }

  /**
   * Decode JWT token (client-side only - for user info)
   * WARNING: Never trust this for security - always validate server-side
   */
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

      // Map JWT 'sub' claim to 'id' for AuthUser compatibility
      // JWT standard uses 'sub' (subject) for user identifier
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

  /**
   * Get current user from token (client-side decode)
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    const token = await this.getAccessToken();
    if (!token) return null;

    return this.decodeToken(token);
  }

  /**
   * Login with passkey (WebAuthn/FIDO2)
   * Orchestrates: get challenge → browser biometric prompt → verify → store tokens
   * Uses dynamic import for @simplewebauthn/browser to avoid SSR issues
   */
  async loginWithPasskey(): Promise<LoginResponse> {
    const { startAuthentication, browserSupportsWebAuthn } =
      await import('@simplewebauthn/browser');

    if (!browserSupportsWebAuthn()) {
      throw new Error('WebAuthn is not supported on this device');
    }

    try {
      // 1. Get authentication options from backend
      const { options, sessionId } =
        await AuthGraphQLService.generatePasskeyAuthenticationOptions();

      // 2. Trigger browser biometric prompt (Face ID / Touch ID / Windows Hello)
      const authResponse = await startAuthentication({
        optionsJSON: JSON.parse(options),
      });

      // 3. Verify with backend and get JWT tokens
      const result = await AuthGraphQLService.verifyPasskeyAuthentication(
        sessionId,
        JSON.stringify(authResponse),
      );

      // 4. Store tokens
      await this.storage.setAccessToken(result.accessToken);
      await this.storage.setRefreshToken(result.refreshToken);

      log.info('Passkey auth successful', { userId: result.user.id });

      return result;
    } catch (error) {
      // Handle user cancellation gracefully
      if (error instanceof Error && error.name === 'NotAllowedError') {
        throw new Error('Passkey authentication was cancelled');
      }
      log.error('Passkey auth failed', { error });
      throw error;
    }
  }

  /**
   * Send OTP to phone number for phone-based login
   */
  async sendPhoneOtp(
    phoneNumber: string,
  ): Promise<{ success: boolean; message: string; expiresIn: number }> {
    try {
      const result = await AuthGraphQLService.sendPhoneOtp(phoneNumber);
      if (result.success) {
        log.info('OTP sent', { phoneNumber: phoneNumber.slice(-4) });
      } else {
        log.warn('OTP send failed', {
          phoneNumber: phoneNumber.slice(-4),
          message: result.message,
        });
      }
      return result;
    } catch (error) {
      log.error('Failed to send OTP', { error });
      throw error;
    }
  }

  /**
   * Verify OTP and login/register user
   */
  async verifyPhoneOtp(
    phoneNumber: string,
    code: string,
  ): Promise<LoginResponse & { isNewUser: boolean }> {
    try {
      const result = await AuthGraphQLService.verifyPhoneOtp(phoneNumber, code);

      if (!result.success || !result.accessToken || !result.refreshToken) {
        throw new Error(result.message || 'Verification failed');
      }

      // Store tokens
      await this.storage.setAccessToken(result.accessToken);
      await this.storage.setRefreshToken(result.refreshToken);

      // Decode user from token
      const user = this.decodeToken(result.accessToken);
      if (!user) {
        throw new Error('Failed to decode user token');
      }

      log.info('Phone auth successful', {
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
      log.error('Phone OTP verification failed', { error });
      throw error;
    }
  }
}
