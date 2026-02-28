import { Test, TestingModule } from '@nestjs/testing';
import { CattoRecaptchaModule } from '../catto-recaptcha.module';
import { CattoRecaptchaService } from '../catto-recaptcha.service';
import { CATTO_RECAPTCHA_CONFIG } from '../constants';

describe('CattoRecaptchaModule', () => {
  describe('forRoot()', () => {
    it('compiles with valid config', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          CattoRecaptchaModule.forRoot({
            secretKey: 'test-secret',
            scoreThreshold: 0.5,
          }),
        ],
      }).compile();

      expect(module).toBeDefined();
    });

    it('provides CattoRecaptchaService', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [CattoRecaptchaModule.forRoot({ secretKey: 'test-secret' })],
      }).compile();

      const service = module.get<CattoRecaptchaService>(CattoRecaptchaService);
      expect(service).toBeDefined();
    });

    it('provides config token', async () => {
      const config = { secretKey: 'test-secret', scoreThreshold: 0.7 };
      const module: TestingModule = await Test.createTestingModule({
        imports: [CattoRecaptchaModule.forRoot(config)],
      }).compile();

      const injectedConfig = module.get(CATTO_RECAPTCHA_CONFIG);
      expect(injectedConfig).toEqual(config);
    });

    it('compiles with empty config (dev mode)', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [CattoRecaptchaModule.forRoot({})],
      }).compile();

      expect(module).toBeDefined();
    });
  });

  describe('forRootAsync()', () => {
    it('compiles with async factory', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          CattoRecaptchaModule.forRootAsync({
            useFactory: () => ({
              secretKey: 'async-secret',
              scoreThreshold: 0.5,
            }),
          }),
        ],
      }).compile();

      const service = module.get<CattoRecaptchaService>(CattoRecaptchaService);
      expect(service).toBeDefined();
    });

    it('supports inject for dependency injection', async () => {
      const CONFIG_TOKEN = 'TEST_CONFIG';

      // Create a helper module that exports the token
      const HelperModule = {
        module: class HelperModule {},
        providers: [{ provide: CONFIG_TOKEN, useValue: 'injected-secret' }],
        exports: [CONFIG_TOKEN],
      };

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          CattoRecaptchaModule.forRootAsync({
            imports: [HelperModule],
            useFactory: (secret: string) => ({
              secretKey: secret,
            }),
            inject: [CONFIG_TOKEN],
          }),
        ],
      }).compile();

      const config = module.get(CATTO_RECAPTCHA_CONFIG);
      expect(config.secretKey).toBe('injected-secret');
    });
  });
});
