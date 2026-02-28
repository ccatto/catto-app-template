/**
 * @catto/nest-payments - CattoPaymentsModule
 *
 * Dynamic NestJS module providing Stripe payment integration.
 *
 * ## Usage
 *
 * ```typescript
 * import { CattoPaymentsModule } from '@catto/nest-payments';
 *
 * @Module({
 *   imports: [
 *     CattoPaymentsModule.forRoot({
 *       secretKey: process.env.STRIPE_SECRET_KEY,
 *       webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
import { Module, DynamicModule } from '@nestjs/common';
import { CATTO_PAYMENTS_CONFIG } from './constants';
import { CattoPaymentsConfig } from './interfaces/config.interfaces';
import { CattoPaymentsService } from './catto-payments.service';

export interface CattoPaymentsModuleAsyncOptions {
  imports?: any[];
  useFactory: (
    ...args: any[]
  ) => CattoPaymentsConfig | Promise<CattoPaymentsConfig>;
  inject?: any[];
}

@Module({})
export class CattoPaymentsModule {
  static forRoot(options: CattoPaymentsConfig): DynamicModule {
    return {
      module: CattoPaymentsModule,
      global: true,
      providers: [
        { provide: CATTO_PAYMENTS_CONFIG, useValue: options },
        CattoPaymentsService,
      ],
      exports: [CattoPaymentsService, CATTO_PAYMENTS_CONFIG],
    };
  }

  static forRootAsync(options: CattoPaymentsModuleAsyncOptions): DynamicModule {
    return {
      module: CattoPaymentsModule,
      global: true,
      imports: [...(options.imports || [])],
      providers: [
        {
          provide: CATTO_PAYMENTS_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        CattoPaymentsService,
      ],
      exports: [CattoPaymentsService, CATTO_PAYMENTS_CONFIG],
    };
  }
}
