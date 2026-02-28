import {
  createMockConfig,
  createMockExecutionContext,
  createMockPrisma,
  createMockUser,
} from '../../__tests__/test-helpers';
import { DevAuthGuard } from '../dev-auth.guard';
import { JwtAuthGuard } from '../jwt-auth.guard';

// Mock GqlExecutionContext
jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: (ctx: any) => ({
      getContext: () => ({ req: ctx.getArgs()[2].req }),
    }),
  },
}));

// Mock AuthGuard
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

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('extracts request from GraphQL context', () => {
    const user = createMockUser();
    const context = createMockExecutionContext(user, {}, 'graphql');
    const req = guard.getRequest(context);

    expect(req).toBeDefined();
    expect(req.user).toEqual(user);
  });

  it('extracts request from HTTP context', () => {
    const user = createMockUser();
    const context = createMockExecutionContext(user, {}, 'http');
    const req = guard.getRequest(context);

    expect(req).toBeDefined();
    expect(req.user).toEqual(user);
  });
});

describe('DevAuthGuard', () => {
  let guard: DevAuthGuard;

  beforeEach(() => {
    const mockPrisma = createMockPrisma();
    guard = new DevAuthGuard(mockPrisma, createMockConfig());
  });

  it('always returns true (bypasses auth)', async () => {
    const result = await guard.canActivate();
    expect(result).toBe(true);
  });

  it('returns a promise', () => {
    const result = guard.canActivate();
    expect(result).toBeInstanceOf(Promise);
  });
});
