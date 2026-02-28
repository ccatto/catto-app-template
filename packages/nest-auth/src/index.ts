/**
 * @catto/nest-auth
 *
 * Catto Auth - NestJS authentication module.
 * Provides JWT authentication, WebAuthn/passkey support,
 * guards, decorators, and GraphQL resolvers.
 *
 * ## Quick Start
 *
 * ```typescript
 * import { CattoAuthModule, GqlAuthGuard, CurrentUser } from '@catto/nest-auth';
 *
 * @Module({
 *   imports: [
 *     CattoAuthModule.forRoot({
 *       jwt: { secret: process.env.JWT_SECRET },
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */

// Configuration
export * from './interfaces/config.interfaces';
export * from './constants';

// Module
export * from './catto-auth.module';

// Strategy
export * from './strategies/jwt.strategy';

// Guards
export * from './guards/jwt-auth.guard';
export * from './guards/gql-auth.guard';
export * from './guards/gql-roles.guard';
export * from './guards/roles.guard';
export * from './guards/platform-admin.guard';
export * from './guards/dev-auth.guard';

// Decorators
export * from './decorators/current-user.decorator';
export * from './decorators/roles.decorator';
export * from './decorators/public.decorator';

// Interfaces
export * from './interfaces/auth.interfaces';

// DTOs
export * from './dto/auth.dto';
export * from './dto/webauthn.dto';

// Services will be exported as they are extracted
// export * from './services/catto-auth.service';
// export * from './services/webauthn.service';
