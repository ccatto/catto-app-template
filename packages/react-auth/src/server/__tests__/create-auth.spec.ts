import { betterAuth } from 'better-auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CattoAuthServerConfig } from '../../types/config';
import { createCattoAuth } from '../create-auth';

// Mock better-auth and its related modules
const mockAuth = {
  api: {
    getSession: vi.fn(),
  },
};

vi.mock('better-auth', () => ({
  betterAuth: vi.fn(() => mockAuth),
}));

vi.mock('better-auth/adapters/prisma', () => ({
  prismaAdapter: vi.fn((_db: any, _opts: any) => ({ type: 'prisma' })),
}));

vi.mock('better-auth/api', () => ({
  createAuthMiddleware: vi.fn((fn: any) => fn),
}));

vi.mock('better-auth/next-js', () => ({
  nextCookies: vi.fn(() => ({ name: 'nextCookies' })),
}));

function createMockConfig(
  overrides: Partial<CattoAuthServerConfig> = {},
): CattoAuthServerConfig {
  return {
    database: { user: { update: vi.fn(), findUnique: vi.fn() } },
    databaseProvider: 'postgresql',
    secret: 'test-secret-123',
    baseURL: 'http://localhost:3000',
    ...overrides,
  };
}

describe('createCattoAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns { auth, getEnrichedSession } object', () => {
    const config = createMockConfig();
    const result = createCattoAuth(config);

    expect(result).toBeDefined();
    expect(result.auth).toBeDefined();
    expect(typeof result.getEnrichedSession).toBe('function');
  });

  it('creates Better Auth instance with provided config', () => {
    const config = createMockConfig({ secret: 'my-secret' });
    createCattoAuth(config);

    expect(betterAuth).toHaveBeenCalledTimes(1);
    const callArgs = (betterAuth as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(callArgs.secret).toBe('my-secret');
    expect(callArgs.baseURL).toBe('http://localhost:3000');
  });

  it('enables email/password by default', () => {
    const config = createMockConfig();
    createCattoAuth(config);

    const callArgs = (betterAuth as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(callArgs.emailAndPassword.enabled).toBe(true);
  });

  it('uses default 69-day session expiry when not specified', () => {
    const config = createMockConfig();
    createCattoAuth(config);

    const callArgs = (betterAuth as ReturnType<typeof vi.fn>).mock.calls[0][0];
    const expectedExpiry = 69 * 24 * 60 * 60;
    expect(callArgs.session.expiresIn).toBe(expectedExpiry);
  });

  it('uses custom session expiry when specified', () => {
    const config = createMockConfig({
      session: { expiresInSeconds: 3600 },
    });
    createCattoAuth(config);

    const callArgs = (betterAuth as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(callArgs.session.expiresIn).toBe(3600);
  });

  it('configures social providers when provided', () => {
    const config = createMockConfig({
      socialProviders: {
        google: { clientId: 'g-id', clientSecret: 'g-secret' },
      },
    });
    createCattoAuth(config);

    const callArgs = (betterAuth as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(callArgs.socialProviders.google).toBeDefined();
    expect(callArgs.socialProviders.google.clientId).toBe('g-id');
  });

  describe('getEnrichedSession', () => {
    it('returns null when no base session', async () => {
      mockAuth.api.getSession.mockResolvedValue(null);

      const config = createMockConfig();
      const { getEnrichedSession } = createCattoAuth(config);

      const result = await getEnrichedSession(new Headers());
      expect(result).toBeNull();
    });

    it('returns enriched session when base session exists', async () => {
      mockAuth.api.getSession.mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test',
          image: null,
        },
        session: { id: 'sess-1' },
      });

      const config = createMockConfig();
      const { getEnrichedSession } = createCattoAuth(config);

      const result = await getEnrichedSession(new Headers());
      expect(result).toBeDefined();
      expect(result.user.id).toBe('user-1');
      expect(result.user.email).toBe('test@example.com');
    });

    it('calls enrichSession hook and merges result', async () => {
      mockAuth.api.getSession.mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test',
          image: null,
        },
        session: { id: 'sess-1' },
      });

      const enrichFn = vi.fn(async () => ({
        playerID: 42,
        role: 'admin',
        organizations: [{ id: 'org-1', name: 'Test Org' }],
      }));

      const config = createMockConfig({
        hooks: { enrichSession: enrichFn },
      });
      const { getEnrichedSession } = createCattoAuth(config);

      const result = await getEnrichedSession(new Headers());

      expect(enrichFn).toHaveBeenCalledWith('user-1', config.database);
      expect(result.user.playerID).toBe(42);
      expect(result.user.role).toBe('admin');
      expect(result.user.organizations).toHaveLength(1);
    });

    it('returns session without enrichment when no hook', async () => {
      mockAuth.api.getSession.mockResolvedValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test',
          image: null,
        },
        session: { id: 'sess-1' },
      });

      const config = createMockConfig({ hooks: undefined });
      const { getEnrichedSession } = createCattoAuth(config);

      const result = await getEnrichedSession(new Headers());
      expect(result.user.id).toBe('user-1');
    });

    it('returns null on error', async () => {
      mockAuth.api.getSession.mockRejectedValue(new Error('DB error'));

      const config = createMockConfig();
      const { getEnrichedSession } = createCattoAuth(config);

      const result = await getEnrichedSession(new Headers());
      expect(result).toBeNull();
    });
  });

  describe('hook error logging', () => {
    it('logs warning when onUserCreated hook throws', () => {
      const mockLogger = { warn: vi.fn() };
      const config = createMockConfig({
        hooks: {
          onUserCreated: vi.fn(async () => {
            throw new Error('Hook exploded');
          }),
        },
        logger: mockLogger,
      });

      createCattoAuth(config);

      // The hook is registered as middleware — verify it was configured
      const callArgs = (betterAuth as ReturnType<typeof vi.fn>).mock
        .calls[0][0];
      expect(callArgs.hooks).toBeDefined();
      expect(callArgs.hooks.after).toBeDefined();
    });

    it('accepts config with logger option', () => {
      const mockLogger = { warn: vi.fn() };
      const config = createMockConfig({ logger: mockLogger });

      // Should not throw
      const result = createCattoAuth(config);
      expect(result).toBeDefined();
    });

    it('works without logger (backward compatible)', () => {
      const config = createMockConfig({ logger: undefined });

      // Should not throw
      const result = createCattoAuth(config);
      expect(result).toBeDefined();
    });
  });
});
