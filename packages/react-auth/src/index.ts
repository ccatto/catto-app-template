/**
 * @catto/react-auth
 *
 * Catto Auth - React/Next.js authentication package.
 * Provides Better Auth integration, JWT auth, session management,
 * and mobile (Capacitor) support.
 *
 * ## Entry Points
 *
 * - `@catto/react-auth` - Client-side hooks, providers, types
 * - `@catto/react-auth/server` - Server-side auth config, session enrichment
 *
 * ## Quick Start
 *
 * ```tsx
 * // Client-side
 * import { useSession, signIn, signOut } from '@catto/react-auth';
 *
 * // Server-side
 * import { createCattoAuth } from '@catto/react-auth/server';
 * ```
 */

// Re-export types (available from both entry points)
export * from './types';

// Re-export client-side exports
export * from './client';
export * from './hooks';
export * from './services';
export * from './storage';
