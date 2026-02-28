import { Test, TestingModule } from '@nestjs/testing';
import { CattoPushModule } from '../catto-push.module';
import { CattoPushService } from '../catto-push.service';
import { CATTO_PUSH_CONFIG } from '../constants';

// Mock firebase-admin to prevent actual initialization
jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  credential: { cert: jest.fn() },
  messaging: jest.fn(() => ({ send: jest.fn() })),
}));

describe('CattoPushModule', () => {
  describe('forRoot()', () => {
    it('compiles with valid config', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          CattoPushModule.forRoot({
            firebaseServiceAccountJson: '{"test": true}',
          }),
        ],
      }).compile();

      expect(module).toBeDefined();
    });

    it('provides CattoPushService', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          CattoPushModule.forRoot({
            firebaseServiceAccountJson: '{"test": true}',
          }),
        ],
      }).compile();

      const service = module.get<CattoPushService>(CattoPushService);
      expect(service).toBeDefined();
    });

    it('provides config token', async () => {
      const config = { firebaseServiceAccountJson: '{"test": true}' };
      const module: TestingModule = await Test.createTestingModule({
        imports: [CattoPushModule.forRoot(config)],
      }).compile();

      const injectedConfig = module.get(CATTO_PUSH_CONFIG);
      expect(injectedConfig).toEqual(config);
    });

    it('compiles with empty config (disabled mode)', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [CattoPushModule.forRoot({})],
      }).compile();

      expect(module).toBeDefined();
    });
  });

  describe('forRootAsync()', () => {
    it('compiles with async factory', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          CattoPushModule.forRootAsync({
            useFactory: () => ({
              firebaseServiceAccountJson: '{"test": true}',
            }),
          }),
        ],
      }).compile();

      const service = module.get<CattoPushService>(CattoPushService);
      expect(service).toBeDefined();
    });

    it('supports inject for dependency injection', async () => {
      const CONFIG_TOKEN = 'TEST_CONFIG';

      const HelperModule = {
        module: class HelperModule {},
        providers: [
          { provide: CONFIG_TOKEN, useValue: '{"project_id":"test"}' },
        ],
        exports: [CONFIG_TOKEN],
      };

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          CattoPushModule.forRootAsync({
            imports: [HelperModule],
            useFactory: (json: string) => ({
              firebaseServiceAccountJson: json,
            }),
            inject: [CONFIG_TOKEN],
          }),
        ],
      }).compile();

      const config = module.get(CATTO_PUSH_CONFIG);
      expect(config.firebaseServiceAccountJson).toBe('{"project_id":"test"}');
    });
  });
});
