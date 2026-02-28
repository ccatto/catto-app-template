// @catto/logger - Shared logger interface and Pino factories

// Types
export type {
  CattoLogger,
  BrowserLoggerConfig,
  NodeLoggerConfig,
  PinoHttpConfig,
} from './types';

// Noop logger
export { noopLogger } from './noop';

// Error extraction utility
export { extractError } from './errors';
export type { ExtractedError } from './errors';

// Factories
export { createBrowserLogger } from './browser';
export { createNodeLogger } from './node';
export { createPinoHttpConfig } from './pino-http';
