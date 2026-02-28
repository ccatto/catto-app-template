import { Test, TestingModule } from '@nestjs/testing';
import { CattoRecaptchaService } from '../catto-recaptcha.service';
import { CATTO_RECAPTCHA_CONFIG } from '../constants';
import { CattoRecaptchaConfig } from '../interfaces/config.interfaces';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

function createMockResponse(data: any, ok = true) {
  return {
    ok,
    json: jest.fn().mockResolvedValue(data),
  };
}

async function createService(
  config: CattoRecaptchaConfig,
): Promise<CattoRecaptchaService> {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      CattoRecaptchaService,
      { provide: CATTO_RECAPTCHA_CONFIG, useValue: config },
    ],
  }).compile();

  return module.get<CattoRecaptchaService>(CattoRecaptchaService);
}

describe('CattoRecaptchaService', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  // ============================================================
  // isHuman()
  // ============================================================
  describe('isHuman()', () => {
    it('returns true when score >= threshold', async () => {
      const service = await createService({
        secretKey: 'test-secret',
        scoreThreshold: 0.5,
      });

      mockFetch.mockResolvedValue(
        createMockResponse({ success: true, score: 0.9 }),
      );

      const result = await service.isHuman('valid-token');
      expect(result).toBe(true);
    });

    it('returns false when score < threshold', async () => {
      const service = await createService({
        secretKey: 'test-secret',
        scoreThreshold: 0.5,
      });

      mockFetch.mockResolvedValue(
        createMockResponse({ success: true, score: 0.2 }),
      );

      const result = await service.isHuman('bot-token');
      expect(result).toBe(false);
    });

    it('returns true when secretKey is undefined (dev mode)', async () => {
      const service = await createService({});

      const result = await service.isHuman('any-token');
      expect(result).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('returns true when disabled is true', async () => {
      const service = await createService({
        secretKey: 'test-secret',
        disabled: true,
      });

      const result = await service.isHuman('any-token');
      expect(result).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('returns false when Google API returns success: false', async () => {
      const service = await createService({
        secretKey: 'test-secret',
        scoreThreshold: 0.5,
      });

      mockFetch.mockResolvedValue(
        createMockResponse({
          success: false,
          'error-codes': ['invalid-input-response'],
        }),
      );

      const result = await service.isHuman('invalid-token');
      expect(result).toBe(false);
    });

    it('returns false on network error', async () => {
      const service = await createService({
        secretKey: 'test-secret',
        scoreThreshold: 0.5,
      });

      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await service.isHuman('token');
      expect(result).toBe(false);
    });

    it('respects custom score threshold', async () => {
      const service = await createService({
        secretKey: 'test-secret',
        scoreThreshold: 0.7,
      });

      // Score 0.6 passes default 0.5 but fails custom 0.7
      mockFetch.mockResolvedValue(
        createMockResponse({ success: true, score: 0.6 }),
      );

      const result = await service.isHuman('token');
      expect(result).toBe(false);
    });

    it('uses default threshold of 0.5 when not specified', async () => {
      const service = await createService({ secretKey: 'test-secret' });

      mockFetch.mockResolvedValue(
        createMockResponse({ success: true, score: 0.5 }),
      );

      const result = await service.isHuman('token');
      expect(result).toBe(true);
    });
  });

  // ============================================================
  // verify()
  // ============================================================
  describe('verify()', () => {
    it('returns full result object from Google API', async () => {
      const service = await createService({
        secretKey: 'test-secret',
      });

      mockFetch.mockResolvedValue(
        createMockResponse({
          success: true,
          score: 0.9,
          action: 'submit',
          'error-codes': [],
        }),
      );

      const result = await service.verify('token');
      expect(result).toEqual({
        success: true,
        score: 0.9,
        action: 'submit',
        errorCodes: [],
      });
    });

    it('returns success with score 1.0 when disabled', async () => {
      const service = await createService({
        secretKey: 'test-secret',
        disabled: true,
      });

      const result = await service.verify('token');
      expect(result).toEqual({ success: true, score: 1.0 });
    });

    it('handles fetch error gracefully', async () => {
      const service = await createService({
        secretKey: 'test-secret',
      });

      mockFetch.mockRejectedValue(new Error('Connection refused'));

      const result = await service.verify('token');
      expect(result.success).toBe(false);
      expect(result.errorCodes).toContain('network-error');
    });

    it('sends correct request to Google API', async () => {
      const service = await createService({
        secretKey: 'my-secret-key',
      });

      mockFetch.mockResolvedValue(
        createMockResponse({ success: true, score: 0.9 }),
      );

      await service.verify('user-token');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://www.google.com/recaptcha/api/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'secret=my-secret-key&response=user-token',
        },
      );
    });
  });
});
