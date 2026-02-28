/**
 * @catto/nest-sms - CattoSmsModule
 *
 * Dynamic NestJS module providing SMS sending via Telnyx.
 *
 * ## Usage
 *
 * ```typescript
 * import { CattoSmsModule } from '@catto/nest-sms';
 *
 * @Module({
 *   imports: [
 *     CattoSmsModule.forRoot({
 *       provider: 'telnyx',
 *       apiKey: process.env.TELNYX_API_KEY,
 *       phoneNumber: process.env.TELNYX_PHONE_NUMBER,
 *       messagingProfileId: process.env.TELNYX_MESSAGING_PROFILE_ID,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
import { Module, DynamicModule } from '@nestjs/common';
import { CATTO_SMS_CONFIG } from './constants';
import { CattoSmsConfig } from './interfaces/config.interfaces';
import { CattoSmsService } from './catto-sms.service';

export interface CattoSmsModuleAsyncOptions {
  imports?: any[];
  useFactory: (...args: any[]) => CattoSmsConfig | Promise<CattoSmsConfig>;
  inject?: any[];
}

@Module({})
export class CattoSmsModule {
  static forRoot(options: CattoSmsConfig): DynamicModule {
    if (!options.provider) {
      throw new Error(
        '@catto/nest-sms: provider is required in CattoSmsModule.forRoot()',
      );
    }

    return {
      module: CattoSmsModule,
      global: true,
      providers: [
        { provide: CATTO_SMS_CONFIG, useValue: options },
        CattoSmsService,
      ],
      exports: [CattoSmsService, CATTO_SMS_CONFIG],
    };
  }

  static forRootAsync(options: CattoSmsModuleAsyncOptions): DynamicModule {
    return {
      module: CattoSmsModule,
      global: true,
      imports: [...(options.imports || [])],
      providers: [
        {
          provide: CATTO_SMS_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        CattoSmsService,
      ],
      exports: [CattoSmsService, CATTO_SMS_CONFIG],
    };
  }
}
