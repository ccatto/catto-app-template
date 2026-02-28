import { UnauthorizedException } from '@nestjs/common';
import {
  createMockConfig,
  createMockDbUser,
  createMockPrisma,
} from '../../__tests__/test-helpers';
import { JwtStrategy } from '../jwt.strategy';

// Mock passport-jwt and @nestjs/passport to avoid real Passport initialization
jest.mock('passport-jwt', () => ({
  ExtractJwt: {
    fromAuthHeaderAsBearerToken: jest.fn().mockReturnValue(jest.fn()),
  },
  Strategy: class MockStrategy {
    constructor() {
      // No-op
    }
  },
}));

jest.mock('@nestjs/passport', () => ({
  PassportStrategy: (Strategy: any, name: string) => {
    return class extends Strategy {
      constructor(...args: any[]) {
        super();
      }
    };
  },
}));

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    const config = createMockConfig();
    strategy = new JwtStrategy(config, mockPrisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('returns TokenUser when user exists in DB', async () => {
      const dbUser = createMockDbUser();
      mockPrisma.client.user.findUnique.mockResolvedValue(dbUser);

      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: 'user',
        playerID: 42,
        organizationId: 'org-1',
      };

      const result = await strategy.validate(payload);
      expect(result).toEqual({
        userId: 'user-123',
        email: 'test@example.com',
        role: 'user',
        playerID: 42,
        organizationId: 'org-1',
      });
    });

    it('throws UnauthorizedException when user not found', async () => {
      mockPrisma.client.user.findUnique.mockResolvedValue(null);

      const payload = {
        sub: 'nonexistent',
        email: 'ghost@example.com',
        role: 'user',
      };

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('queries DB with correct payload sub', async () => {
      const dbUser = createMockDbUser();
      mockPrisma.client.user.findUnique.mockResolvedValue(dbUser);

      await strategy.validate({
        sub: 'user-456',
        email: 'test@example.com',
        role: 'admin',
      });

      expect(mockPrisma.client.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-456' },
        select: { id: true, email: true, name: true, role: true },
      });
    });

    it('handles payload without optional fields', async () => {
      const dbUser = createMockDbUser();
      mockPrisma.client.user.findUnique.mockResolvedValue(dbUser);

      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: 'user',
        // No playerID, no organizationId
      };

      const result = await strategy.validate(payload);
      expect(result.userId).toBe('user-123');
      expect(result.playerID).toBeUndefined();
      expect(result.organizationId).toBeUndefined();
    });

    it('returns role from DB, not from JWT payload', async () => {
      // DB says admin, but JWT payload says user (stale token)
      const dbUser = createMockDbUser({ role: 'platform_admin' });
      mockPrisma.client.user.findUnique.mockResolvedValue(dbUser);

      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: 'user', // stale role in token
      };

      const result = await strategy.validate(payload);
      expect(result.role).toBe('platform_admin'); // DB role wins
    });
  });
});
