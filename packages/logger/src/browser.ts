// @catto/logger — Browser logger factory

import pino from 'pino';
import { extractError } from './errors';
import type { BrowserLoggerConfig, CattoLogger } from './types';

/**
 * Create a Pino-based logger configured for browser environments.
 *
 * Features:
 * - Env-aware log level (debug in dev, info in prod)
 * - Pretty-printing in dev, JSON in prod
 * - Smart error extraction from { error }, { err }, { e } wrappers
 * - Dev console.error bridging for Next.js error overlay
 *
 * Requires `pino` as a peer dependency. `pino-pretty` is optional
 * (only used in dev mode).
 */
export function createBrowserLogger(config?: BrowserLoggerConfig): CattoLogger {
  const env = config?.env ?? process.env.NODE_ENV ?? 'development';
  const isProd = env === 'production';
  const level = config?.level ?? (isProd ? 'info' : 'debug');
  const devConsoleErrors = config?.devConsoleErrors ?? true;

  const pinoInstance = pino({
    level,
    ...(config?.name ? { name: config.name } : {}),
    browser: {
      asObject: true,
    },
    ...(!isProd && {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
    }),
  });

  return {
    debug(msg: string, data?: Record<string, unknown>) {
      pinoInstance.debug(data || {}, msg);
    },
    info(msg: string, data?: Record<string, unknown>) {
      pinoInstance.info(data || {}, msg);
    },
    warn(msg: string, data?: Record<string, unknown>) {
      pinoInstance.warn(data || {}, msg);
    },
    error(msg: string, data?: Error | Record<string, unknown>) {
      const { error, data: logData } = extractError(data);

      // Dev console.error bridge for Next.js error overlay
      if (!isProd && devConsoleErrors && error) {
        // eslint-disable-next-line no-console
        console.error(`[LOG ERROR] ${msg}`, error);
      }

      if (error) {
        pinoInstance.error(
          {
            err: error.message,
            stack: error.stack,
            name: error.name,
            ...logData,
          },
          msg,
        );
      } else if (Object.keys(logData).length > 0) {
        pinoInstance.error(logData, msg);
      } else {
        pinoInstance.error(msg);
      }
    },
  };
}
