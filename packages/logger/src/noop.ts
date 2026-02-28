// @catto/logger — Noop logger

import type { CattoLogger } from './types';

/**
 * A no-op logger that silently discards all log calls.
 * Use as the default logger in library packages before the consumer
 * configures a real logger.
 */
export const noopLogger: CattoLogger = {
  debug() {},
  info() {},
  warn() {},
  error() {},
};
