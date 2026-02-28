/**
 * @catto/react-auth - Session Types
 *
 * Types for enriched sessions, users, and compatibility with NextAuth patterns.
 */

// =============================================================================
// Enriched Session (Better Auth + custom fields)
// =============================================================================

export interface EnrichedUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  /** Custom fields added by enrichSession hook */
  playerID?: number;
  role: string;
  organizationId: string | null;
  organizations: Array<{
    id: string;
    name: string;
    slug: string;
    role: string;
    permissions: string[];
  }>;
  /** Allow additional custom fields from enrichSession */
  [key: string]: unknown;
}

export interface EnrichedSession {
  user: EnrichedUser;
  session: {
    id: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  };
}

// =============================================================================
// Compat Session (NextAuth-compatible shape)
// =============================================================================

export interface CompatSessionUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  playerID?: number;
  role: string;
  organizationId: string | null;
  organizations: Array<{
    id: string;
    name: string;
    slug: string;
    role: string;
    permissions: string[];
  }>;
}

export interface CompatSession {
  user: CompatSessionUser;
  expires: string;
}

// =============================================================================
// Auth Store Types (Zustand)
// =============================================================================

export interface AuthStoreUser {
  userId: string;
  email: string;
  name?: string;
  image?: string;
  role?: string;
  playerID?: number;
  organizationId?: string;
  organizations?: Array<{
    id: string;
    name: string;
    slug: string;
    role: string;
    permissions: string[];
  }>;
}
