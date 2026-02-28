import { Test, TestingModule } from '@nestjs/testing';
import { CattoPaymentsModule } from '../catto-payments.module';
import { CattoPaymentsService } from '../catto-payments.service';
import { CATTO_PAYMENTS_CONFIG } from '../constants';

// Mock Stripe to prevent actual API calls
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: { create: jest.fn(), update: jest.fn() },
    checkout: { sessions: { create: jest.fn(), retrieve: jest.fn() } },
    prices: { list: jest.fn() },
    webhooks: { constructEvent: jest.fn() },
  }));
});

describe('CattoPaymentsModule', () => {
  describe('forRoot()', () => {
    it('compiles with valid config', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          CattoPaymentsModule.forRoot({
            secretKey: 'sk_test_123',
            webhookSecret: 'whsec_test',
          }),
        ],
      }).compile();

      expect(module).toBeDefined();
    });

    it('provides CattoPaymentsService', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [CattoPaymentsModule.forRoot({ secretKey: 'sk_test_123' })],
      }).compile();

      const service = module.get<CattoPaymentsService>(CattoPaymentsService);
      expect(service).toBeDefined();
    });

    it('provides config token', async () => {
      const config = {
        secretKey: 'sk_test_123',
        webhookSecret: 'whsec_test',
      };
      const module: TestingModule = await Test.createTestingModule({
        imports: [CattoPaymentsModule.forRoot(config)],
      }).compile();

      const injectedConfig = module.get(CATTO_PAYMENTS_CONFIG);
      expect(injectedConfig).toEqual(config);
    });

    it('compiles with empty config (disabled mode)', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [CattoPaymentsModule.forRoot({})],
      }).compile();

      expect(module).toBeDefined();
    });
  });

  describe('forRootAsync()', () => {
    it('compiles with async factory', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          CattoPaymentsModule.forRootAsync({
            useFactory: () => ({
              secretKey: 'sk_test_async',
              webhookSecret: 'whsec_async',
            }),
          }),
        ],
      }).compile();

      const service = module.get<CattoPaymentsService>(CattoPaymentsService);
      expect(service).toBeDefined();
    });

    it('supports inject for dependency injection', async () => {
      const CONFIG_TOKEN = 'TEST_CONFIG';

      const HelperModule = {
        module: class HelperModule {},
        providers: [{ provide: CONFIG_TOKEN, useValue: 'sk_test_injected' }],
        exports: [CONFIG_TOKEN],
      };

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          CattoPaymentsModule.forRootAsync({
            imports: [HelperModule],
            useFactory: (key: string) => ({
              secretKey: key,
            }),
            inject: [CONFIG_TOKEN],
          }),
        ],
      }).compile();

      const config = module.get(CATTO_PAYMENTS_CONFIG);
      expect(config.secretKey).toBe('sk_test_injected');
    });
  });
});
