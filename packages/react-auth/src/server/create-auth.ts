/**
 * @catto/react-auth/server - createCattoAuth Factory
 *
 * Creates a configured Better Auth instance with sensible defaults,
 * automatic email normalization, and pluggable hooks for
 * session enrichment and user lifecycle events.
 *
 * @example
 * ```typescript
 * import { createCattoAuth } from '@catto/react-auth/server';
 * import { prisma } from '@myapp/database';
 *
 * export const { auth, getEnrichedSession } = createCattoAuth({
 *   database: prisma,
 *   databaseProvider: 'postgresql',
 *   secret: process.env.BETTER_AUTH_SECRET!,
 *   baseURL: process.env.BETTER_AUTH_URL!,
 *   hooks: {
 *     enrichSession: async (userId, db) => {
 *       // Return custom fields to merge into session.user
 *       return { role: 'admin', customField: 'value' };
 *     },
 *   },
 * });
 * ```
 */
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import type {
  CattoAuthServerConfig,
  CattoAuthSocialProvider,
} from '../types/config';

// Default: 69 days (matches common long-lived session configs)
const DEFAULT_TOKEN_EXPIRY_SECONDS = 69 * 24 * 60 * 60;

export interface CreateCattoAuthResult {
  /** The Better Auth instance (use for API routes) */
  auth: ReturnType<typeof betterAuth>;
  /**
   * Get enriched session with custom fields from hooks.enrichSession.
   * Call this instead of auth.api.getSession for full session data.
   */
  getEnrichedSession: (headers: Headers) => Promise<any | null>;
}

export function createCattoAuth(
  config: CattoAuthServerConfig,
): CreateCattoAuthResult {
  const expiresIn =
    config.session?.expiresInSeconds ?? DEFAULT_TOKEN_EXPIRY_SECONDS;

  // Build social providers config
  const socialProviders: Record<
    string,
    CattoAuthSocialProvider & { scope?: string[] }
  > = {};
  if (config.socialProviders?.google) {
    socialProviders.google = config.socialProviders.google;
  }
  if (config.socialProviders?.github) {
    socialProviders.github = config.socialProviders.github;
  }
  if (config.socialProviders?.facebook) {
    socialProviders.facebook = {
      ...config.socialProviders.facebook,
      scope: config.socialProviders.facebook.scope ?? [
        'email',
        'public_profile',
      ],
    };
  }

  const auth = betterAuth({
    // Database
    // Cast needed: prismaAdapter expects PrismaClient but we use a minimal interface for package portability
    database: prismaAdapter(
      config.database as Parameters<typeof prismaAdapter>[0],
      {
        provider: config.databaseProvider,
      },
    ),

    // Secret & URL
    secret: config.secret,
    baseURL: config.baseURL,

    // Email/password
    emailAndPassword: {
      enabled: config.emailAndPassword?.enabled ?? true,
      requireEmailVerification:
        config.emailAndPassword?.requireEmailVerification ?? false,
    },

    // Social providers
    socialProviders,

    // Session
    session: {
      expiresIn,
      cookieCache: {
        enabled: true,
        maxAge: expiresIn,
      },
    },

    // Account linking
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: Object.keys(socialProviders),
      },
    },

    // User fields
    user: {
      additionalFields: {
        role: {
          type: 'string' as const,
          required: false,
          defaultValue: 'user',
        },
      },
    },

    // Advanced
    advanced: {
      useSecureCookies:
        config.advanced?.useSecureCookies ??
        process.env.NODE_ENV === 'production',
      crossSubDomainCookies: {
        enabled: false,
      },
    },

    // Plugins
    plugins: [nextCookies()],

    // Hooks
    hooks: {
      // Before hooks: email normalization
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path === '/sign-up/email') {
          const body = ctx.body as { email?: string } | undefined;
          if (body?.email && typeof body.email === 'string') {
            (ctx.body as { email: string }).email = body.email.toLowerCase();
          }
        }
      }),

      // After hooks: user lifecycle events
      after: createAuthMiddleware(async (ctx) => {
        if (
          ctx.path.startsWith('/sign-in') ||
          ctx.path.startsWith('/sign-up')
        ) {
          const newSession = ctx.context.newSession;
          if (newSession?.user) {
            const user = newSession.user;

            // Normalize email in database if needed
            const normalizedEmail = user.email?.toLowerCase();
            if (normalizedEmail && user.email !== normalizedEmail) {
              try {
                await config.database.user.update({
                  where: { id: user.id },
                  data: { email: normalizedEmail },
                });
              } catch (hookError) {
                config.logger?.warn?.(
                  '[CattoAuth] Email normalization failed',
                  {
                    userId: user.id,
                    error:
                      hookError instanceof Error
                        ? hookError.message
                        : String(hookError),
                  },
                );
              }
            }

            // Call onUserCreated hook
            if (config.hooks?.onUserCreated) {
              try {
                await config.hooks.onUserCreated(
                  {
                    id: user.id,
                    email: normalizedEmail || user.email,
                    name: user.name,
                  },
                  config.database,
                );
              } catch (hookError) {
                config.logger?.warn?.('[CattoAuth] onUserCreated hook failed', {
                  userId: user.id,
                  error:
                    hookError instanceof Error
                      ? hookError.message
                      : String(hookError),
                });
              }
            }
          }
        }
      }),
    },
  });

  // Enriched session factory
  async function getEnrichedSession(headers: Headers): Promise<any | null> {
    try {
      const baseSession = await auth.api.getSession({ headers });
      if (!baseSession?.user) return null;

      const userId = baseSession.user.id;

      // Call enrichSession hook if provided
      const enrichment = config.hooks?.enrichSession
        ? await config.hooks.enrichSession(userId, config.database)
        : {};

      return {
        user: {
          id: baseSession.user.id,
          email: baseSession.user.email,
          name: baseSession.user.name,
          image: baseSession.user.image,
          ...enrichment,
        },
        session: baseSession.session,
      };
    } catch {
      return null;
    }
  }

  return { auth, getEnrichedSession };
}
