import { Test } from '@nestjs/testing';
import { CattoEmailModule } from '../catto-email.module';
import { CattoEmailService } from '../catto-email.service';
import { CATTO_EMAIL_CONFIG } from '../constants';

describe('CattoEmailModule', () => {
  describe('forRoot', () => {
    it('should create a global dynamic module with correct providers', () => {
      const result = CattoEmailModule.forRoot({
        apiKey: 'SG.test',
        fromEmail: 'test@example.com',
      });

      expect(result.global).toBe(true);
      expect(result.module).toBe(CattoEmailModule);
      expect(result.providers).toBeDefined();
      expect(result.exports).toBeDefined();
    });

    it('should throw if fromEmail is missing', () => {
      expect(() =>
        CattoEmailModule.forRoot({
          apiKey: 'SG.test',
          fromEmail: '',
        }),
      ).toThrow('fromEmail is required');
    });

    it('should allow undefined apiKey (disabled mode)', () => {
      const result = CattoEmailModule.forRoot({
        fromEmail: 'test@example.com',
      });

      expect(result.providers).toBeDefined();
    });

    it('should compile module and provide CattoEmailService', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          CattoEmailModule.forRoot({
            apiKey: 'SG.test',
            fromEmail: 'test@example.com',
          }),
        ],
      }).compile();

      const service = moduleRef.get(CattoEmailService);
      expect(service).toBeDefined();

      const config = moduleRef.get(CATTO_EMAIL_CONFIG);
      expect(config.fromEmail).toBe('test@example.com');
    });
  });

  describe('forRootAsync', () => {
    it('should create a global dynamic module with factory', () => {
      const result = CattoEmailModule.forRootAsync({
        useFactory: () => ({
          apiKey: 'SG.test',
          fromEmail: 'test@example.com',
        }),
      });

      expect(result.global).toBe(true);
      expect(result.module).toBe(CattoEmailModule);
    });

    it('should compile module with async factory', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          CattoEmailModule.forRootAsync({
            useFactory: () => ({
              apiKey: 'SG.async-test',
              fromEmail: 'async@example.com',
            }),
          }),
        ],
      }).compile();

      const service = moduleRef.get(CattoEmailService);
      expect(service).toBeDefined();

      const config = moduleRef.get(CATTO_EMAIL_CONFIG);
      expect(config.fromEmail).toBe('async@example.com');
    });

    it('should support inject tokens', () => {
      const result = CattoEmailModule.forRootAsync({
        inject: ['CONFIG_SERVICE'],
        useFactory: (config: any) => ({
          apiKey: config?.get?.('API_KEY'),
          fromEmail: 'test@example.com',
        }),
      });

      expect(result.providers).toBeDefined();
    });
  });
});
