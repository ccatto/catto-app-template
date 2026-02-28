/**
 * Configurable logger for @catto/react-mobile
 *
 * Uses the shared CattoLogger interface from @catto/logger.
 *
 * Usage in your app's providers:
 *   import { configureMobileLogger } from '@catto/react-mobile';
 *   import { log } from '@/app/lib/logger';
 *   configureMobileLogger(log);
 */

import type { CattoLogger } from '@catto/logger';
import { noopLogger } from '@catto/logger';

// Re-export CattoLogger as CattoMobileLogger for backward compatibility
export type CattoMobileLogger = CattoLogger;

let currentLogger: CattoLogger = noopLogger;

/**
 * Configure the logger used by all @catto/react-mobile hooks.
 * Call once at app startup (e.g., in your providers).
 */
export function configureMobileLogger(logger: CattoLogger): void {
  currentLogger = logger;
}

/**
 * Get the current logger instance (internal use by hooks).
 */
export function getLogger(): CattoLogger {
  return currentLogger;
}
