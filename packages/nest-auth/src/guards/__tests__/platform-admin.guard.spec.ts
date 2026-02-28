import { ForbiddenException } from '@nestjs/common';
import {
  createMockConfig,
  createMockExecutionContext,
  createMockPrisma,
  createMockUser,
} from '../../__tests__/test-helpers';
import { PlatformAdminGuard } from '../platform-admin.guard';

// Mock GqlExecutionContext
jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: (ctx: any) => ({
      getContext: () => ({ req: ctx.getArgs()[2].req }),
    }),
  },
}));

describe('PlatformAdminGuard', () => {
  let guard: PlatformAdminGuard;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    const config = createMockConfig();
    guard = new PlatformAdminGuard(mockPrisma, config);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('allows platform admin user (JWT auth)', async () => {
    const user = createMockUser({ role: 'platform_admin' });
    const context = createMockExecutionContext(user);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    // No DB lookup needed when role is on user object
    expect(mockPrisma.client.user.findUnique).not.toHaveBeenCalled();
  });

  it('rejects non-admin user', async () => {
    const user = createMockUser({ role: 'user' });
    mockPrisma.client.user.findUnique.mockResolvedValue({ role: 'user' });

    const context = createMockExecutionContext(user);
    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );
    await expect(guard.canActivate(context)).rejects.toThrow(
      'Platform admin access required',
    );
  });

  it('falls back to DB lookup for x-user-id auth', async () => {
    const user = createMockUser({ role: 'user' }); // JWT role says "user"
    mockPrisma.client.user.findUnique.mockResolvedValue({
      role: 'platform_admin',
    }); // DB says admin

    const context = createMockExecutionContext(user);
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockPrisma.client.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      select: { role: true },
    });
  });

  it('does not mutate user object after DB lookup confirms admin', async () => {
    const user = createMockUser({ role: 'user' });
    mockPrisma.client.user.findUnique.mockResolvedValue({
      role: 'platform_admin',
    });

    const context = createMockExecutionContext(user);
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    // Guard should NOT mutate the user object
    expect(user.role).toBe('user');
  });

  it('rejects when DB lookup returns non-admin role', async () => {
    const user = createMockUser({ role: 'user' });
    mockPrisma.client.user.findUnique.mockResolvedValue({ role: 'user' });

    const context = createMockExecutionContext(user);
    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('throws ForbiddenException when no user on context', async () => {
    const context = createMockExecutionContext(null);
    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );
    await expect(guard.canActivate(context)).rejects.toThrow(
      'Authentication required',
    );
  });

  describe('configurable role name', () => {
    it('uses custom role name from config', async () => {
      const config = createMockConfig({
        roles: { platformAdmin: 'super_admin' },
      });
      const customGuard = new PlatformAdminGuard(mockPrisma, config);

      const user = createMockUser({ role: 'super_admin' });
      const context = createMockExecutionContext(user);

      const result = await customGuard.canActivate(context);
      expect(result).toBe(true);
    });

    it('defaults to "platform_admin" when no role config', async () => {
      const config = createMockConfig({ roles: undefined });
      const defaultGuard = new PlatformAdminGuard(mockPrisma, config);

      const user = createMockUser({ role: 'platform_admin' });
      const context = createMockExecutionContext(user);

      const result = await defaultGuard.canActivate(context);
      expect(result).toBe(true);
    });
  });
});
