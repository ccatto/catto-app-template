/**
 * @catto/nest-recaptcha - CattoRecaptchaModule
 *
 * Dynamic NestJS module providing Google reCAPTCHA v3 verification.
 *
 * ## Usage
 *
 * ```typescript
 * import { CattoRecaptchaModule } from '@catto/nest-recaptcha';
 *
 * @Module({
 *   imports: [
 *     CattoRecaptchaModule.forRoot({
 *       secretKey: process.env.RECAPTCHA_SECRET_KEY,
 *       scoreThreshold: 0.5,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
import { Module, DynamicModule } from '@nestjs/common';
import { CATTO_RECAPTCHA_CONFIG } from './constants';
import { CattoRecaptchaConfig } from './interfaces/config.interfaces';
import { CattoRecaptchaService } from './catto-recaptcha.service';

export interface CattoRecaptchaModuleAsyncOptions {
  imports?: any[];
  useFactory: (
    ...args: any[]
  ) => CattoRecaptchaConfig | Promise<CattoRecaptchaConfig>;
  inject?: any[];
}

@Module({})
export class CattoRecaptchaModule {
  static forRoot(options: CattoRecaptchaConfig): DynamicModule {
    return {
      module: CattoRecaptchaModule,
      global: true,
      providers: [
        { provide: CATTO_RECAPTCHA_CONFIG, useValue: options },
        CattoRecaptchaService,
      ],
      exports: [CattoRecaptchaService, CATTO_RECAPTCHA_CONFIG],
    };
  }

  static forRootAsync(
    options: CattoRecaptchaModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: CattoRecaptchaModule,
      global: true,
      imports: [...(options.imports || [])],
      providers: [
        {
          provide: CATTO_RECAPTCHA_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        CattoRecaptchaService,
      ],
      exports: [CattoRecaptchaService, CATTO_RECAPTCHA_CONFIG],
    };
  }
}
