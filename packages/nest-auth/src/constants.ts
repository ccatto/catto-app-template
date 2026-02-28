/**
 * @catto/nest-auth - Injection Tokens
 *
 * Constants used for NestJS dependency injection.
 */

/** Injection token for the auth configuration */
export const CATTO_AUTH_CONFIG = 'CATTO_AUTH_CONFIG';

/** Injection token for the Prisma service */
export const CATTO_AUTH_PRISMA = 'CATTO_AUTH_PRISMA';

/** Metadata key for roles decorator */
export const ROLES_KEY = 'roles';

/** Metadata key for public routes */
export const IS_PUBLIC_KEY = 'isPublic';
