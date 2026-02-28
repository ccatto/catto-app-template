// @catto/logger — NestJS pinoHttp config factory

import type { PinoHttpConfig } from './types';

/**
 * Create a pinoHttp configuration object for NestJS LoggerModule.forRoot().
 *
 * Usage in app.module.ts:
 *   import { createPinoHttpConfig } from '@catto/logger';
 *   LoggerModule.forRoot({ pinoHttp: createPinoHttpConfig() })
 *
 * Requires `pino-http` peer dependency. `pino-pretty` optional (dev only).
 */
export function createPinoHttpConfig(config?: PinoHttpConfig) {
  const env = config?.env ?? process.env.NODE_ENV ?? 'development';
  const isProd = env === 'production';
  const level = config?.level ?? (isProd ? 'info' : 'debug');
  const contextLabel = config?.contextLabel ?? 'HTTP';
  const includeBody = config?.includeBody ?? true;

  return {
    level,
    transport: !isProd
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
    customProps: () => ({
      context: contextLabel,
    }),
    serializers: includeBody
      ? {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          req(req: any) {
            req.body = req.raw?.body;
            return req;
          },
        }
      : undefined,
  };
}
