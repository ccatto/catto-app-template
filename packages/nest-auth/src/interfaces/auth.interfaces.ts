/**
 * @catto/nest-auth - Auth Interfaces
 *
 * Core authentication types used across guards, strategies, and services.
 */
import { Request } from 'express';

/**
 * JWT Payload structure - what's encoded in the token
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  name?: string | null; // User's display name
  role: string;
  playerID?: number;
  organizationId?: string | null;
  /** Allow additional fields added via enrichTokenPayload hook */
  [key: string]: unknown;
}

/**
 * User object returned from JWT validation
 * Used by @CurrentUser decorator
 */
export interface TokenUser {
  userId: string;
  email: string;
  role: string;
  playerID?: number;
  organizationId?: string | null;
  /** Allow additional fields */
  [key: string]: unknown;
}

/**
 * User object from Prisma for token generation
 * Includes optional organizationMembers relation
 */
export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  playerID?: number | null;
  organizationMembers?: { organizationId: string }[];
}

/**
 * Validated user returned from validateUser
 */
export interface ValidatedUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  playerID?: number | null;
}

/**
 * Request with user attached (after JWT validation)
 */
export interface AuthenticatedRequest extends Request {
  user?: TokenUser;
}
