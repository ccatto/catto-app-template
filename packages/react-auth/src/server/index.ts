/**
 * @catto/react-auth/server - Server Exports
 *
 * Server-side auth configuration and session enrichment.
 * These exports do NOT have 'use client' directive.
 *
 * @example
 * import { createCattoAuth } from '@catto/react-auth/server';
 */

export { createCattoAuth, type CreateCattoAuthResult } from './create-auth';
export type {
  CattoAuthServerConfig,
  CattoAuthSocialProvider,
} from '../types/config';
