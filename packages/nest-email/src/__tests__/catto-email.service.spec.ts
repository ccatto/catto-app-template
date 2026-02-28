import { Test } from '@nestjs/testing';
import { CattoEmailService } from '../catto-email.service';
import { CATTO_EMAIL_CONFIG } from '../constants';
import { createMockConfig } from './test-helpers';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('CattoEmailService', () => {
  let service: CattoEmailService;

  beforeEach(async () => {
    mockFetch.mockReset();
  });

  async function createService(configOverrides = {}) {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: CATTO_EMAIL_CONFIG,
          useValue: createMockConfig(configOverrides),
        },
        CattoEmailService,
      ],
    }).compile();

    return moduleRef.get(CattoEmailService);
  }

  describe('sendEmail', () => {
    it('should send email successfully via SendGrid', async () => {
      service = await createService();
      mockFetch.mockResolvedValueOnce({
        status: 202,
        ok: true,
        text: jest.fn().mockResolvedValue(''),
      });

      const result = await service.sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Hello</p>',
      });

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.sendgrid.com/v3/mail/send',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer SG.test-api-key',
          }),
        }),
      );
    });

    it('should use default fromEmail when not overridden', async () => {
      service = await createService();
      mockFetch.mockResolvedValueOnce({
        status: 202,
        ok: true,
        text: jest.fn().mockResolvedValue(''),
      });

      await service.sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Hello</p>',
      });

      const callBody = JSON.parse(
        (mockFetch.mock.calls[0] as any[])[1].body as string,
      );
      expect(callBody.from.email).toBe('test@example.com');
    });

    it('should use custom from address when provided', async () => {
      service = await createService();
      mockFetch.mockResolvedValueOnce({
        status: 202,
        ok: true,
        text: jest.fn().mockResolvedValue(''),
      });

      await service.sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Hello</p>',
        from: 'custom@example.com',
      });

      const callBody = JSON.parse(
        (mockFetch.mock.calls[0] as any[])[1].body as string,
      );
      expect(callBody.from.email).toBe('custom@example.com');
    });

    it('should return false when apiKey is not configured', async () => {
      service = await createService({ apiKey: undefined });

      const result = await service.sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Hello</p>',
      });

      expect(result).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return false when disabled is true', async () => {
      service = await createService({ disabled: true });

      const result = await service.sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Hello</p>',
      });

      expect(result).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return false on SendGrid error response', async () => {
      service = await createService();
      mockFetch.mockResolvedValueOnce({
        status: 400,
        ok: false,
        text: jest
          .fn()
          .mockResolvedValue('{"errors":[{"message":"Bad request"}]}'),
      });

      const result = await service.sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Hello</p>',
      });

      expect(result).toBe(false);
    });

    it('should return false on fetch error', async () => {
      service = await createService();
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await service.sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Hello</p>',
      });

      expect(result).toBe(false);
    });

    it('should handle 200 status as success', async () => {
      service = await createService();
      mockFetch.mockResolvedValueOnce({
        status: 200,
        ok: true,
        text: jest.fn().mockResolvedValue(''),
      });

      const result = await service.sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Hello</p>',
      });

      expect(result).toBe(true);
    });

    it('should include correct SendGrid payload structure', async () => {
      service = await createService();
      mockFetch.mockResolvedValueOnce({
        status: 202,
        ok: true,
        text: jest.fn().mockResolvedValue(''),
      });

      await service.sendEmail({
        to: 'recipient@example.com',
        subject: 'My Subject',
        html: '<h1>Content</h1>',
      });

      const callBody = JSON.parse(
        (mockFetch.mock.calls[0] as any[])[1].body as string,
      );
      expect(callBody).toEqual({
        personalizations: [{ to: [{ email: 'recipient@example.com' }] }],
        from: { email: 'test@example.com' },
        subject: 'My Subject',
        content: [{ type: 'text/html', value: '<h1>Content</h1>' }],
      });
    });
  });
});
