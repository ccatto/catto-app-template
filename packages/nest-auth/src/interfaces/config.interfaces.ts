/**
 * @catto/nest-auth - Configuration Interfaces
 *
 * Interfaces for configuring the CattoAuthModule.
 */

/**
 * Minimal interface for the injected Prisma service.
 * Guards and strategies only need `client.user.findUnique()`.
 */
export interface CattoPrismaLike {
  client: {
    user: {
      findUnique(args: {
        where: { id: string };
        select?: Record<string, boolean>;
      }): Promise<{
        id?: string;
        email?: string;
        name?: string | null;
        role?: string | null;
        [key: string]: unknown;
      } | null>;
    };
  };
}

export interface CattoNestAuthJwtConfig {
  /** JWT signing secret */
  secret: string;
  /** Access token expiry (default: '15m') */
  accessExpiresIn?: string;
  /** Refresh token secret (default: same as secret) */
  refreshSecret?: string;
  /** Refresh token expiry (default: '7d') */
  refreshExpiresIn?: string;
}

export interface CattoNestAuthWebAuthnConfig {
  /** Relying party name displayed to user */
  rpName: string;
  /** Relying party ID (domain) */
  rpId: string;
  /** Allowed origins for WebAuthn requests */
  origins: string[];
}

export interface CattoNestAuthRolesConfig {
  /** Platform admin role name (default: 'platform_admin') */
  platformAdmin?: string;
  /** Default role for new users (default: 'user') */
  default?: string;
}

export interface CattoNestAuthConfig {
  /** JWT configuration */
  jwt: CattoNestAuthJwtConfig;

  /** WebAuthn/Passkey configuration (optional) */
  webauthn?: CattoNestAuthWebAuthnConfig;

  /** Role name configuration */
  roles?: CattoNestAuthRolesConfig;

  /**
   * Disable x-user-id header fallback auth (default: false).
   * Set to true if your app uses JWT-only auth (no OAuth header fallback).
   */
  disableHeaderAuth?: boolean;

  /** Pluggable hooks for domain-specific logic */
  hooks?: {
    /**
     * Called after a new user is registered.
     * Use to create domain-specific records (e.g., Player, Profile).
     */
    onUserRegistered?: (
      user: { id: string; email: string; name?: string | null },
      prisma: CattoPrismaLike,
    ) => Promise<void>;

    /**
     * Called when generating JWT payload.
     * Return additional fields to include in the token.
     */
    enrichTokenPayload?: (
      user: { id: string; email: string; role: string },
      prisma: CattoPrismaLike,
    ) => Promise<Record<string, unknown>>;
  };
}
