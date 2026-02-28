import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IAuthStorage } from '../../storage/auth-storage.interface';
import type { IAuthApiService, LoginResponse } from '../auth-api.interface';
import { JwtAuthService } from '../jwt-auth.service';

// Helper to create a valid JWT-like token with an exp claim
function createMockJwt(payload: Record<string, any> = {}): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(
    JSON.stringify({
      sub: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      ...payload,
    }),
  );
  const sig = btoa('fake-signature');
  return `${header}.${body}.${sig}`;
}

function createExpiredJwt(): string {
  return createMockJwt({ exp: Math.floor(Date.now() / 1000) - 300 }); // 5 min ago
}

function createMockStorage(): IAuthStorage {
  let accessToken: string | null = null;
  let refreshToken: string | null = null;

  return {
    setAccessToken: vi.fn(async (token: string) => {
      accessToken = token;
    }),
    getAccessToken: vi.fn(async () => accessToken),
    setRefreshToken: vi.fn(async (token: string) => {
      refreshToken = token;
    }),
    getRefreshToken: vi.fn(async () => refreshToken),
    clearTokens: vi.fn(async () => {
      accessToken = null;
      refreshToken = null;
    }),
    hasTokens: vi.fn(async () => accessToken !== null),
  };
}

function createMockApi(
  overrides: Partial<IAuthApiService> = {},
): IAuthApiService {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
  };

  const validToken = createMockJwt();

  return {
    login: vi.fn(async () => ({
      accessToken: validToken,
      refreshToken: 'refresh-token-abc',
      user: mockUser,
    })),
    register: vi.fn(async () => ({
      accessToken: validToken,
      refreshToken: 'refresh-token-new',
      user: mockUser,
    })),
    logout: vi.fn(async () => ({ success: true })),
    refreshToken: vi.fn(async () => ({
      accessToken: createMockJwt(),
    })),
    ...overrides,
  };
}

describe('JwtAuthService', () => {
  let service: JwtAuthService;
  let storage: IAuthStorage;
  let api: IAuthApiService;

  beforeEach(() => {
    storage = createMockStorage();
    api = createMockApi();
    service = new JwtAuthService(storage, api);
  });

  describe('login', () => {
    it('calls API, stores tokens, and returns response', async () => {
      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(api.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(storage.setAccessToken).toHaveBeenCalledWith(result.accessToken);
      expect(storage.setRefreshToken).toHaveBeenCalledWith(result.refreshToken);
      expect(result.user.email).toBe('test@example.com');
    });

    it('throws on API error without storing tokens', async () => {
      (api.login as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Invalid credentials'),
      );

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow('Invalid credentials');

      expect(storage.setAccessToken).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('calls API, stores tokens, and returns response', async () => {
      const result = await service.register({
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      });

      expect(api.register).toHaveBeenCalled();
      expect(storage.setAccessToken).toHaveBeenCalledWith(result.accessToken);
      expect(storage.setRefreshToken).toHaveBeenCalledWith(result.refreshToken);
      expect(result.user).toBeDefined();
    });
  });

  describe('logout', () => {
    it('calls API and clears tokens', async () => {
      // First login to have tokens
      await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      await service.logout();

      expect(storage.clearTokens).toHaveBeenCalled();
    });

    it('clears tokens even if API call fails', async () => {
      // Store a refresh token first
      await storage.setRefreshToken('some-token');
      (api.logout as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Network error'),
      );

      await service.logout();

      expect(storage.clearTokens).toHaveBeenCalled();
    });
  });

  describe('refreshAccessToken', () => {
    it('refreshes token via API and stores new access token', async () => {
      await storage.setRefreshToken('old-refresh-token');

      const newToken = await service.refreshAccessToken();

      expect(api.refreshToken).toHaveBeenCalledWith('old-refresh-token');
      expect(storage.setAccessToken).toHaveBeenCalled();
      expect(typeof newToken).toBe('string');
    });

    it('throws when no refresh token available', async () => {
      await expect(service.refreshAccessToken()).rejects.toThrow(
        'No refresh token available',
      );
    });

    it('clears tokens and throws "Session expired" on refresh failure', async () => {
      await storage.setRefreshToken('expired-refresh');
      (api.refreshToken as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Token expired'),
      );

      await expect(service.refreshAccessToken()).rejects.toThrow(
        'Session expired',
      );
      expect(storage.clearTokens).toHaveBeenCalled();
    });

    it('calls onSessionExpired callback when refresh fails', async () => {
      const onSessionExpired = vi.fn();
      const serviceWithCallback = new JwtAuthService(storage, api, undefined, {
        onSessionExpired,
      });

      await storage.setRefreshToken('expired-refresh');
      (api.refreshToken as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Token expired'),
      );

      await expect(serviceWithCallback.refreshAccessToken()).rejects.toThrow(
        'Session expired',
      );
      expect(onSessionExpired).toHaveBeenCalledTimes(1);
    });

    it('does not call onSessionExpired when not configured', async () => {
      await storage.setRefreshToken('expired-refresh');
      (api.refreshToken as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Token expired'),
      );

      // Default service (no options) should not throw on missing callback
      await expect(service.refreshAccessToken()).rejects.toThrow(
        'Session expired',
      );
    });
  });

  describe('getAuthHeaders', () => {
    it('returns Bearer token header', async () => {
      const validToken = createMockJwt();
      await storage.setAccessToken(validToken);

      const headers = await service.getAuthHeaders();
      expect(headers.Authorization).toBe(`Bearer ${validToken}`);
    });

    it('returns empty object when no token', async () => {
      const headers = await service.getAuthHeaders();
      expect(headers).toEqual({});
    });

    it('proactively refreshes expired token', async () => {
      const expiredToken = createExpiredJwt();
      await storage.setAccessToken(expiredToken);
      await storage.setRefreshToken('my-refresh-token');

      const headers = await service.getAuthHeaders();

      expect(api.refreshToken).toHaveBeenCalled();
      expect(headers.Authorization).toMatch(/^Bearer /);
    });

    it('respects cooldown after refresh failure', async () => {
      const expiredToken = createExpiredJwt();
      await storage.setAccessToken(expiredToken);
      await storage.setRefreshToken('my-refresh-token');

      // Make refresh fail
      (api.refreshToken as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Refresh failed'),
      );

      // First call triggers refresh attempt
      const headers1 = await service.getAuthHeaders();
      expect(headers1).toEqual({});
      expect(api.refreshToken).toHaveBeenCalledTimes(1);

      // Re-set the expired token (clearTokens was called on failure)
      await storage.setAccessToken(expiredToken);
      await storage.setRefreshToken('my-refresh-token');

      // Second call within cooldown skips refresh entirely
      const headers2 = await service.getAuthHeaders();
      expect(headers2).toEqual({});
      expect(api.refreshToken).toHaveBeenCalledTimes(1); // NOT called again
    });

    it('deduplicates concurrent refresh calls', async () => {
      const expiredToken = createExpiredJwt();
      await storage.setAccessToken(expiredToken);
      await storage.setRefreshToken('my-refresh-token');

      // Make refresh slow
      (api.refreshToken as ReturnType<typeof vi.fn>).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ accessToken: createMockJwt() }), 50),
          ),
      );

      // Fire two concurrent getAuthHeaders calls
      const [headers1, headers2] = await Promise.all([
        service.getAuthHeaders(),
        service.getAuthHeaders(),
      ]);

      // Both should get a token but only one refresh call was made
      expect(api.refreshToken).toHaveBeenCalledTimes(1);
      expect(headers1.Authorization).toMatch(/^Bearer /);
      expect(headers2.Authorization).toMatch(/^Bearer /);
    });
  });

  describe('isAuthenticated', () => {
    it('returns true when tokens exist', async () => {
      await storage.setAccessToken('some-token');
      const result = await service.isAuthenticated();
      expect(result).toBe(true);
    });

    it('returns false when no tokens', async () => {
      const result = await service.isAuthenticated();
      expect(result).toBe(false);
    });
  });

  describe('hasTokens', () => {
    it('delegates to storage', async () => {
      await service.hasTokens();
      expect(storage.hasTokens).toHaveBeenCalled();
    });
  });

  describe('decodeToken', () => {
    it('decodes valid JWT and returns AuthUser', () => {
      const token = createMockJwt({
        sub: 'user-456',
        email: 'decoded@example.com',
        name: 'Decoded User',
        role: 'admin',
        playerID: 42,
        organizationId: 'org-1',
      });

      const user = service.decodeToken(token);
      expect(user).toEqual({
        id: 'user-456',
        email: 'decoded@example.com',
        name: 'Decoded User',
        role: 'admin',
        playerID: 42,
        organizationId: 'org-1',
      });
    });

    it('returns null for invalid token', () => {
      const result = service.decodeToken('not-a-jwt');
      expect(result).toBeNull();
    });

    it('defaults role to "user" when not in payload', () => {
      const token = createMockJwt({ role: undefined });
      const user = service.decodeToken(token);
      expect(user?.role).toBe('user');
    });
  });

  describe('getCurrentUser', () => {
    it('returns user from stored token', async () => {
      const token = createMockJwt({ sub: 'user-789' });
      await storage.setAccessToken(token);

      const user = await service.getCurrentUser();
      expect(user).toBeDefined();
      expect(user?.id).toBe('user-789');
    });

    it('returns null when no token stored', async () => {
      const user = await service.getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe('sendPhoneOtp', () => {
    it('delegates to API service', async () => {
      const mockSendOtp = vi.fn(async () => ({
        success: true,
        message: 'OTP sent',
        expiresIn: 300,
      }));
      api.sendPhoneOtp = mockSendOtp;

      const result = await service.sendPhoneOtp('+15551234567');
      expect(mockSendOtp).toHaveBeenCalledWith('+15551234567');
      expect(result.success).toBe(true);
    });

    it('throws when not configured', async () => {
      api.sendPhoneOtp = undefined;
      await expect(service.sendPhoneOtp('+15551234567')).rejects.toThrow(
        'Phone OTP not configured',
      );
    });
  });

  describe('verifyPhoneOtp', () => {
    it('verifies OTP, stores tokens, and returns user', async () => {
      const token = createMockJwt({ sub: 'phone-user-1' });
      api.verifyPhoneOtp = vi.fn(async () => ({
        success: true,
        message: 'Verified',
        accessToken: token,
        refreshToken: 'phone-refresh',
        isNewUser: true,
      }));

      const result = await service.verifyPhoneOtp('+15551234567', '123456');

      expect(storage.setAccessToken).toHaveBeenCalledWith(token);
      expect(storage.setRefreshToken).toHaveBeenCalledWith('phone-refresh');
      expect(result.isNewUser).toBe(true);
      expect(result.user.id).toBe('phone-user-1');
    });

    it('throws when not configured', async () => {
      api.verifyPhoneOtp = undefined;
      await expect(
        service.verifyPhoneOtp('+15551234567', '123456'),
      ).rejects.toThrow('Phone OTP not configured');
    });
  });

  describe('loginWithPasskey', () => {
    it('throws when passkey methods not configured', async () => {
      api.generatePasskeyAuthenticationOptions = undefined;
      api.verifyPasskeyAuthentication = undefined;

      await expect(service.loginWithPasskey()).rejects.toThrow(
        'Passkey authentication not configured',
      );
    });
  });
});
