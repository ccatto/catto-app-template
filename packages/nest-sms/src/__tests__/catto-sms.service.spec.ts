import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CattoSmsService } from '../catto-sms.service';
import { CATTO_SMS_CONFIG } from '../constants';
import { SmsProvider } from '../dto/send-sms.dto';
import { createMockConfig } from './test-helpers';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('CattoSmsService', () => {
  let service: CattoSmsService;

  beforeEach(() => {
    mockFetch.mockReset();
  });

  async function createService(configOverrides = {}) {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: CATTO_SMS_CONFIG,
          useValue: createMockConfig(configOverrides),
        },
        CattoSmsService,
      ],
    }).compile();

    return moduleRef.get(CattoSmsService);
  }

  describe('sendSms', () => {
    it('should send SMS successfully via Telnyx', async () => {
      service = await createService();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          data: { id: 'msg-123' },
        }),
      });

      const result = await service.sendSms({
        to: '+15559876543',
        message: 'Hello test',
      });

      expect(result).toEqual({
        success: true,
        messageId: 'msg-123',
        provider: SmsProvider.TELNYX,
      });
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.telnyx.com/v2/messages',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer KEY_test123',
          }),
        }),
      );
    });

    it('should include correct Telnyx payload', async () => {
      service = await createService();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: { id: 'msg-456' } }),
      });

      await service.sendSms({
        to: '+15559876543',
        message: 'Test message body',
      });

      const callBody = JSON.parse(
        (mockFetch.mock.calls[0] as any[])[1].body as string,
      );
      expect(callBody).toEqual({
        from: '+15551234567',
        to: '+15559876543',
        text: 'Test message body',
        messaging_profile_id: 'profile-123',
      });
    });

    it('should throw BadRequestException when apiKey is missing', async () => {
      service = await createService({ apiKey: undefined });

      await expect(
        service.sendSms({ to: '+15559876543', message: 'Test' }),
      ).rejects.toThrow(BadRequestException);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when phoneNumber is missing', async () => {
      service = await createService({ phoneNumber: undefined });

      await expect(
        service.sendSms({ to: '+15559876543', message: 'Test' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when messagingProfileId is missing', async () => {
      service = await createService({ messagingProfileId: undefined });

      await expect(
        service.sendSms({ to: '+15559876543', message: 'Test' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return error response when disabled', async () => {
      service = await createService({ disabled: true });

      const result = await service.sendSms({
        to: '+15559876543',
        message: 'Test',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('disabled');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException on Telnyx API error', async () => {
      service = await createService();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        json: jest.fn().mockResolvedValue({
          errors: [{ detail: 'Invalid phone number' }],
        }),
      });

      await expect(
        service.sendSms({ to: '+15559876543', message: 'Test' }),
      ).rejects.toThrow('Invalid phone number');
    });

    it('should throw BadRequestException on network error', async () => {
      service = await createService();
      mockFetch.mockRejectedValueOnce(new Error('Network failure'));

      await expect(
        service.sendSms({ to: '+15559876543', message: 'Test' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate correct E.164 numbers', async () => {
      service = await createService();

      expect(service.validatePhoneNumber('+15551234567')).toBe(true);
      expect(service.validatePhoneNumber('+447911123456')).toBe(true);
      expect(service.validatePhoneNumber('+61412345678')).toBe(true);
    });

    it('should reject invalid phone numbers', async () => {
      service = await createService();

      expect(service.validatePhoneNumber('5551234567')).toBe(false);
      expect(service.validatePhoneNumber('+0551234567')).toBe(false);
      expect(service.validatePhoneNumber('')).toBe(false);
      expect(service.validatePhoneNumber('abc')).toBe(false);
    });
  });
});
