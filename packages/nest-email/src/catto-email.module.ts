/**
 * @catto/nest-email - CattoEmailModule
 *
 * Dynamic NestJS module providing email sending via SendGrid.
 *
 * ## Usage
 *
 * ```typescript
 * import { CattoEmailModule } from '@catto/nest-email';
 *
 * @Module({
 *   imports: [
 *     CattoEmailModule.forRoot({
 *       apiKey: process.env.SENDGRID_API_KEY,
 *       fromEmail: 'noreply@example.com',
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * Or with async configuration:
 *
 * ```typescript
 * CattoEmailModule.forRootAsync({
 *   imports: [ConfigModule],
 *   inject: [ConfigService],
 *   useFactory: (config: ConfigService) => ({
 *     apiKey: config.get('SENDGRID_API_KEY'),
 *     fromEmail: config.get('SENDGRID_FROM_EMAIL') || 'noreply@example.com',
 *   }),
 * })
 * ```
 */
import { Module, DynamicModule } from '@nestjs/common';
import { CATTO_EMAIL_CONFIG } from './constants';
import { CattoEmailConfig } from './interfaces/config.interfaces';
import { CattoEmailService } from './catto-email.service';

export interface CattoEmailModuleAsyncOptions {
  imports?: any[];
  useFactory: (...args: any[]) => CattoEmailConfig | Promise<CattoEmailConfig>;
  inject?: any[];
}

@Module({})
export class CattoEmailModule {
  static forRoot(options: CattoEmailConfig): DynamicModule {
    if (!options.fromEmail) {
      throw new Error(
        '@catto/nest-email: fromEmail is required in CattoEmailModule.forRoot()',
      );
    }

    return {
      module: CattoEmailModule,
      global: true,
      providers: [
        { provide: CATTO_EMAIL_CONFIG, useValue: options },
        CattoEmailService,
      ],
      exports: [CattoEmailService, CATTO_EMAIL_CONFIG],
    };
  }

  static forRootAsync(options: CattoEmailModuleAsyncOptions): DynamicModule {
    return {
      module: CattoEmailModule,
      global: true,
      imports: [...(options.imports || [])],
      providers: [
        {
          provide: CATTO_EMAIL_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        CattoEmailService,
      ],
      exports: [CattoEmailService, CATTO_EMAIL_CONFIG],
    };
  }
}
