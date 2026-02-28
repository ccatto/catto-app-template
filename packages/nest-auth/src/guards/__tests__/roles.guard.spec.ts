import {
  createMockExecutionContext,
  createMockReflector,
  createMockUser,
} from '../../__tests__/test-helpers';
import { GqlRolesGuard } from '../gql-roles.guard';
import { RolesGuard } from '../roles.guard';

// Mock GqlExecutionContext
jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: (ctx: any) => ({
      getContext: () => ({ req: ctx.getArgs()[2].req }),
    }),
  },
}));

describe('GqlRolesGuard', () => {
  let guard: GqlRolesGuard;
  let mockReflector: ReturnType<typeof createMockReflector>;

  beforeEach(() => {
    mockReflector = createMockReflector();
    guard = new GqlRolesGuard(mockReflector as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('allows request when no @Roles() decorator is set', () => {
    mockReflector.getAllAndOverride.mockReturnValue(null);
    const user = createMockUser();
    const context = createMockExecutionContext(user);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows request when user has matching role', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['admin']);
    const user = createMockUser({ role: 'admin' });
    const context = createMockExecutionContext(user);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows request when user has one of multiple allowed roles', () => {
    mockReflector.getAllAndOverride.mockReturnValue([
      'admin',
      'platform_admin',
    ]);
    const user = createMockUser({ role: 'platform_admin' });
    const context = createMockExecutionContext(user);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('rejects when user role does not match required roles', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['admin']);
    const user = createMockUser({ role: 'user' });
    const context = createMockExecutionContext(user);

    expect(guard.canActivate(context)).toBe(false);
  });

  it('rejects when user is null', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['admin']);
    const context = createMockExecutionContext(null);

    expect(guard.canActivate(context)).toBe(false);
  });

  it('rejects when user has no role property', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['admin']);
    const user = { id: 'user-123' }; // No role
    const context = createMockExecutionContext(user);

    expect(guard.canActivate(context)).toBe(false);
  });
});

describe('RolesGuard (HTTP)', () => {
  let guard: RolesGuard;
  let mockReflector: ReturnType<typeof createMockReflector>;

  beforeEach(() => {
    mockReflector = createMockReflector();
    guard = new RolesGuard(mockReflector as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('allows request when no @Roles() decorator is set', () => {
    mockReflector.getAllAndOverride.mockReturnValue(null);
    const user = createMockUser();
    const context = createMockExecutionContext(user, {}, 'http');

    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows request when user has matching role (HTTP context)', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['admin']);
    const user = createMockUser({ role: 'admin' });
    const context = createMockExecutionContext(user, {}, 'http');

    expect(guard.canActivate(context)).toBe(true);
  });

  it('rejects when user role does not match (HTTP context)', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['admin']);
    const user = createMockUser({ role: 'user' });
    const context = createMockExecutionContext(user, {}, 'http');

    expect(guard.canActivate(context)).toBe(false);
  });
});
