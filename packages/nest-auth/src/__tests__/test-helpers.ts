/**
 * @catto/nest-auth - Test Helpers
 *
 * Shared mock factories for guard, strategy, and module tests.
 */
import { ExecutionContext } from '@nestjs/common';
import { CattoNestAuthConfig } from '../interfaces/config.interfaces';

/**
 * Creates a mock ExecutionContext supporting both 'http' and 'graphql' types.
 */
export function createMockExecutionContext(
  user: any,
  headers: Record<string, string> = {},
  type: 'graphql' | 'http' = 'graphql',
): ExecutionContext {
  const req = { user, headers };

  const context = {
    getType: jest.fn().mockReturnValue(type),
    getHandler: jest.fn().mockReturnValue(jest.fn()),
    getClass: jest.fn().mockReturnValue(jest.fn()),
    getArgs: jest.fn().mockReturnValue([{}, {}, { req }, {}]),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(req),
      getResponse: jest.fn().mockReturnValue({}),
    }),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getArgByIndex: jest.fn((index: number) => [req, {}, { req }, {}][index]),
  } as unknown as ExecutionContext;

  return context;
}

/**
 * Gets the request object from a mock context.
 * Used to verify user attachment in guard tests.
 */
export function getRequestFromContext(context: ExecutionContext): any {
  return context.getArgs()[2].req;
}

/**
 * Creates a mock Prisma service with `client.user.findUnique`.
 */
export function createMockPrisma(findUniqueResult: any = null) {
  return {
    client: {
      user: {
        findUnique: jest.fn().mockResolvedValue(findUniqueResult),
      },
    },
  };
}

/**
 * Creates a mock Reflector for testing role-based guards.
 */
export function createMockReflector(roles: string[] | null = null) {
  return {
    getAllAndOverride: jest.fn().mockReturnValue(roles),
  };
}

/**
 * Creates a valid CattoNestAuthConfig for testing.
 */
export function createMockConfig(
  overrides: Partial<CattoNestAuthConfig> = {},
): CattoNestAuthConfig {
  return {
    jwt: {
      secret: 'test-secret-key',
      accessExpiresIn: '15m',
      ...overrides.jwt,
    },
    roles: {
      platformAdmin: 'platform_admin',
      default: 'user',
      ...overrides.roles,
    },
    ...overrides,
  };
}

/**
 * Creates a mock user object for JWT auth tests.
 */
export function createMockUser(overrides: Record<string, any> = {}) {
  return {
    id: 'user-123',
    userId: 'user-123',
    sub: 'user-123',
    email: 'test@example.com',
    role: 'user',
    ...overrides,
  };
}

/**
 * Creates a mock DB user (as returned from Prisma).
 */
export function createMockDbUser(overrides: Record<string, any> = {}) {
  return {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    ...overrides,
  };
}
