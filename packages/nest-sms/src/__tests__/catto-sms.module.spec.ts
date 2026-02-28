import { Test } from '@nestjs/testing';
import { CattoSmsModule } from '../catto-sms.module';
import { CattoSmsService } from '../catto-sms.service';
import { CATTO_SMS_CONFIG } from '../constants';

describe('CattoSmsModule', () => {
  describe('forRoot', () => {
    it('should create a global dynamic module with correct providers', () => {
      const result = CattoSmsModule.forRoot({
        provider: 'telnyx',
        apiKey: 'KEY_test',
        phoneNumber: '+15551234567',
        messagingProfileId: 'profile-123',
      });

      expect(result.global).toBe(true);
      expect(result.module).toBe(CattoSmsModule);
      expect(result.providers).toBeDefined();
      expect(result.exports).toBeDefined();
    });

    it('should throw if provider is missing', () => {
      expect(() =>
        CattoSmsModule.forRoot({
          provider: '' as any,
          apiKey: 'KEY_test',
        }),
      ).toThrow('provider is required');
    });

    it('should allow undefined apiKey (disabled mode)', () => {
      const result = CattoSmsModule.forRoot({
        provider: 'telnyx',
      });

      expect(result.providers).toBeDefined();
    });

    it('should compile module and provide CattoSmsService', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          CattoSmsModule.forRoot({
            provider: 'telnyx',
            apiKey: 'KEY_test',
            phoneNumber: '+15551234567',
            messagingProfileId: 'profile-123',
          }),
        ],
      }).compile();

      const service = moduleRef.get(CattoSmsService);
      expect(service).toBeDefined();

      const config = moduleRef.get(CATTO_SMS_CONFIG);
      expect(config.provider).toBe('telnyx');
    });
  });

  describe('forRootAsync', () => {
    it('should create a global dynamic module with factory', () => {
      const result = CattoSmsModule.forRootAsync({
        useFactory: () => ({
          provider: 'telnyx' as const,
          apiKey: 'KEY_test',
          phoneNumber: '+15551234567',
          messagingProfileId: 'profile-123',
        }),
      });

      expect(result.global).toBe(true);
      expect(result.module).toBe(CattoSmsModule);
    });

    it('should compile module with async factory', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          CattoSmsModule.forRootAsync({
            useFactory: () => ({
              provider: 'telnyx' as const,
              apiKey: 'KEY_async',
              phoneNumber: '+15559876543',
              messagingProfileId: 'profile-456',
            }),
          }),
        ],
      }).compile();

      const service = moduleRef.get(CattoSmsService);
      expect(service).toBeDefined();

      const config = moduleRef.get(CATTO_SMS_CONFIG);
      expect(config.phoneNumber).toBe('+15559876543');
    });
  });
});
