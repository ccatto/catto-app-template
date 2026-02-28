// @catto/logger — Node.js logger factory

import pino from 'pino';
import { extractError } from './errors';
import type { CattoLogger, NodeLoggerConfig } from './types';

/**
 * Create a Pino-based logger configured for Node.js/server environments.
 *
 * Features:
 * - Env-aware log level (debug in dev, info in prod)
 * - Pretty-printing in dev, JSON in prod
 * - Smart error extraction
 *
 * Requires `pino` peer dependency. `pino-pretty` optional (dev only).
 */
export function createNodeLogger(config?: NodeLoggerConfig): CattoLogger {
  const env = config?.env ?? process.env.NODE_ENV ?? 'development';
  const isProd = env === 'production';
  const level = config?.level ?? (isProd ? 'info' : 'debug');

  const pinoInstance = pino({
    level,
    ...(config?.name ? { name: config.name } : {}),
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
