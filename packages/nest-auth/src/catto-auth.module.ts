/**
 * @catto/nest-auth - CattoAuthModule
 *
 * Dynamic NestJS module providing JWT authentication infrastructure.
 *
 * ## Usage
 *
 * ```typescript
 * import { CattoAuthModule } from '@catto/nest-auth';
 * import { PrismaService } from '../prisma/prisma.service';
 * import { PrismaModule } from '../prisma/prisma.module';
 *
 * @Module({
 *   imports: [
 *     CattoAuthModule.forRoot({
 *       jwt: { secret: process.env.JWT_SECRET! },
 *       prismaToken: PrismaService,
 *       imports: [PrismaModule],
 *     }),
 *   ],
 * })
 * export class AuthModule {}
 * ```
 */
import { Module, DynamicModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { CATTO_AUTH_CONFIG, CATTO_AUTH_PRISMA } from './constants';
import { CattoNestAuthConfig } from './interfaces/config.interfaces';
import { JwtStrategy } from './strategies/jwt.strategy';

export interface CattoAuthModuleOptions extends CattoNestAuthConfig {
  /**
   * Provider token for the Prisma service (e.g., PrismaService class).
   * The service must expose a `.client` property with Prisma Client methods.
   */
  prismaToken: any;

  /**
   * Modules to import for dependency resolution (e.g., [PrismaModule]).
   * These are imported into CattoAuthModule's context so that
   * prismaToken can be resolved.
   */
  imports?: any[];
}

@Module({})
export class CattoAuthModule {
  static forRoot(options: CattoAuthModuleOptions): DynamicModule {
    if (!options.jwt?.secret) {
      throw new Error(
        '@catto/nest-auth: jwt.secret is required in CattoAuthModule.forRoot()',
      );
    }
    if (!options.prismaToken) {
      throw new Error(
        '@catto/nest-auth: prismaToken is required in CattoAuthModule.forRoot()',
      );
    }

    const { prismaToken, imports: extraImports = [], ...config } = options;

    return {
      module: CattoAuthModule,
      global: true,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: config.jwt.secret,
          signOptions: {
            expiresIn: (config.jwt.accessExpiresIn || '15m') as StringValue,
          },
        }),
        ...extraImports,
      ],
      providers: [
        { provide: CATTO_AUTH_CONFIG, useValue: config },
        { provide: CATTO_AUTH_PRISMA, useExisting: prismaToken },
        JwtStrategy,
      ],
      exports: [
        PassportModule,
        JwtModule,
        CATTO_AUTH_CONFIG,
        CATTO_AUTH_PRISMA,
        JwtStrategy,
      ],
    };
  }
}
