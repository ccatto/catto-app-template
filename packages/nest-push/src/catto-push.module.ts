/**
 * @catto/nest-push - CattoPushModule
 *
 * Dynamic NestJS module providing Firebase Cloud Messaging (FCM) push notifications.
 *
 * ## Usage
 *
 * ```typescript
 * import { CattoPushModule } from '@catto/nest-push';
 *
 * @Module({
 *   imports: [
 *     CattoPushModule.forRoot({
 *       firebaseServiceAccountJson: process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
import { Module, DynamicModule } from '@nestjs/common';
import { CATTO_PUSH_CONFIG } from './constants';
import { CattoPushConfig } from './interfaces/config.interfaces';
import { CattoPushService } from './catto-push.service';

export interface CattoPushModuleAsyncOptions {
  imports?: any[];
  useFactory: (...args: any[]) => CattoPushConfig | Promise<CattoPushConfig>;
  inject?: any[];
}

@Module({})
export class CattoPushModule {
  static forRoot(options: CattoPushConfig): DynamicModule {
    return {
      module: CattoPushModule,
      global: true,
      providers: [
        { provide: CATTO_PUSH_CONFIG, useValue: options },
        CattoPushService,
      ],
      exports: [CattoPushService, CATTO_PUSH_CONFIG],
    };
  }

  static forRootAsync(options: CattoPushModuleAsyncOptions): DynamicModule {
    return {
      module: CattoPushModule,
      global: true,
      imports: [...(options.imports || [])],
      providers: [
        {
          provide: CATTO_PUSH_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        CattoPushService,
      ],
      exports: [CattoPushService, CATTO_PUSH_CONFIG],
    };
  }
}
