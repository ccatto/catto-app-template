import { UnauthorizedException } from '@nestjs/common';
import {
  createMockConfig,
  createMockExecutionContext,
  createMockPrisma,
  createMockUser,
  getRequestFromContext,
} from '../../__tests__/test-helpers';
import { GqlAuthGuard } from '../gql-auth.guard';

// Mock GqlExecutionContext.create to return GraphQL-style context
jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: (ctx: any) => ({
      getContext: () => ({ req: ctx.getArgs()[2].req }),
    }),
  },
}));

// Mock AuthGuard to avoid Passport internals
jest.mock('@nestjs/passport', () => ({
  AuthGuard: () => {
    class MockAuthGuard {
      canActivate() {
        return true;
      }
    }
    return MockAuthGuard;
  },
}));

describe('GqlAuthGuard', () => {
  let guard: GqlAuthGuard;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    guard = new GqlAuthGuard(mockPrisma, createMockConfig());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when JWT user is present', () => {
    it('allows request when JWT auth succeeds', async () => {
      const user = createMockUser();
      const context = createMockExecutionContext(user);

      // Mock super.canActivate to succeed (JWT valid)
      jest
        .spyOn(Object.getPrototypeOf(GqlAuthGuard.prototype), 'canActivate')
        .mockResolvedValue(true);

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
    });
  });

  describe('when JWT fails, fallback to x-user-id header', () => {
    beforeEach(() => {
      // JWT auth fails
      jest
        .spyOn(Object.getPrototypeOf(GqlAuthGuard.prototype), 'canActivate')
        .mockRejectedValue(new UnauthorizedException());
    });

    it('validates user via x-user-id header and DB lookup', async () => {
      const dbUser = { id: 'oauth-user-1', role: 'user' };
      mockPrisma.client.user.findUnique.mockResolvedValue(dbUser);

      const context = createMockExecutionContext(null, {
        'x-user-id': 'oauth-user-1',
      });
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockPrisma.client.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'oauth-user-1' },
        select: { id: true, role: true },
      });
    });

    it('attaches verified user to request object', async () => {
      const dbUser = { id: 'oauth-user-1', role: 'admin' };
      mockPrisma.client.user.findUnique.mockResolvedValue(dbUser);

      const context = createMockExecutionContext(null, {
        'x-user-id': 'oauth-user-1',
      });
      await guard.canActivate(context);

      const req = getRequestFromContext(context);
      expect(req.user).toEqual({
        id: 'oauth-user-1',
        userId: 'oauth-user-1',
        sub: 'oauth-user-1',
        role: 'admin',
      });
    });

    it('throws UnauthorizedException when x-user-id user not found in DB', async () => {
      mockPrisma.client.user.findUnique.mockResolvedValue(null);

      const context = createMockExecutionContext(null, {
        'x-user-id': 'nonexistent',
      });
      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'User not found',
      );
    });

    it('throws UnauthorizedException when no JWT and no x-user-id header', async () => {
      const context = createMockExecutionContext(null, {});
      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'No valid authentication provided',
      );
    });

    it('rejects empty x-user-id header', async () => {
      const context = createMockExecutionContext(null, { 'x-user-id': '' });
      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('defaults role to "user" when DB user has no role', async () => {
      const dbUser = { id: 'oauth-user-1', role: null };
      mockPrisma.client.user.findUnique.mockResolvedValue(dbUser);

      const context = createMockExecutionContext(null, {
        'x-user-id': 'oauth-user-1',
      });
      await guard.canActivate(context);

      const req = getRequestFromContext(context);
      expect(req.user.role).toBe('user');
    });
  });

  describe('disableHeaderAuth', () => {
    it('rejects x-user-id when disableHeaderAuth is true', async () => {
      const config = createMockConfig({ disableHeaderAuth: true });
      const strictGuard = new GqlAuthGuard(mockPrisma, config);

      jest
        .spyOn(Object.getPrototypeOf(GqlAuthGuard.prototype), 'canActivate')
        .mockRejectedValue(new UnauthorizedException());

      const context = createMockExecutionContext(null, {
        'x-user-id': 'user-123',
      });
      await expect(strictGuard.canActivate(context)).rejects.toThrow(
        'JWT authentication required',
      );
      expect(mockPrisma.client.user.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('getRequest', () => {
    it('extracts request from GraphQL context', () => {
      const user = createMockUser();
      const context = createMockExecutionContext(user);
      const req = guard.getRequest(context);
      expect(req).toBeDefined();
      expect(req.user).toEqual(user);
    });
  });
});
