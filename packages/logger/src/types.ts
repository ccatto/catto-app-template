// @catto/logger — TypeScript types

/**
 * Shared logger interface for all @catto/* packages.
 *
 * This is the canonical definition. Individual packages (react-mobile,
 * react-contact, etc.) should re-export this type rather than defining
 * their own.
 */
export interface CattoLogger {
  debug(msg: string, data?: Record<string, unknown>): void;
  info(msg: string, data?: Record<string, unknown>): void;
  warn(msg: string, data?: Record<string, unknown>): void;
  error(msg: string, data?: Error | Record<string, unknown>): void;
}

/** Configuration for createBrowserLogger(). */
export interface BrowserLoggerConfig {
  /** Override the log level. Defaults to 'debug' in dev, 'info' in prod. */
  level?: string;
  /** Override environment detection. Defaults to process.env.NODE_ENV. */
  env?: 'production' | 'development' | 'test';
  /** Whether to bridge errors to console.error in dev for overlay support. Default: true */
  devConsoleErrors?: boolean;
  /** Custom name for the logger (appears in pino output). */
  name?: string;
}

/** Configuration for createNodeLogger(). */
export interface NodeLoggerConfig {
  /** Override the log level. Defaults to 'debug' in dev, 'info' in prod. */
  level?: string;
  /** Override environment detection. Defaults to process.env.NODE_ENV. */
  env?: 'production' | 'development' | 'test';
  /** Custom name for the logger (appears in pino output). */
  name?: string;
}

/** Configuration for createPinoHttpConfig(). */
export interface PinoHttpConfig {
  /** Override the log level. Defaults to 'debug' in dev, 'info' in prod. */
  level?: string;
  /** Override environment detection. Defaults to process.env.NODE_ENV. */
  env?: 'production' | 'development' | 'test';
  /** Custom context label for HTTP logs. Default: 'HTTP'. */
  contextLabel?: string;
  /** Whether to include request body in logs. Default: true. */
  includeBody?: boolean;
}
