import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { CATTO_SMS_CONFIG } from './constants';
import { CattoSmsConfig } from './interfaces/config.interfaces';
import { SendSmsDto, SmsResponseDto, SmsProvider } from './dto/send-sms.dto';

@Injectable()
export class CattoSmsService {
  private readonly logger = new Logger(CattoSmsService.name);

  constructor(
    @Inject(CATTO_SMS_CONFIG) private readonly config: CattoSmsConfig,
  ) {
    if (this.config.disabled) {
      this.logger.warn('SMS service is disabled via configuration');
    } else if (this.config.apiKey) {
      this.logger.log('Telnyx SMS service initialized');
    } else {
      this.logger.warn('Telnyx credentials not found - SMS disabled');
    }
  }

  /**
   * Send SMS via Telnyx
   */
  async sendSms(dto: SendSmsDto): Promise<SmsResponseDto> {
    this.logger.log(`Sending SMS to ${dto.to} via Telnyx`);

    if (this.config.disabled) {
      this.logger.warn(`SMS not sent (disabled): ${dto.to}`);
      return {
        success: false,
        provider: SmsProvider.TELNYX,
        error: 'SMS service is disabled',
      };
    }

    const { apiKey, phoneNumber, messagingProfileId } = this.config;

    this.logger.log(
      `Telnyx config check - API Key: ${
        apiKey ? 'SET' : 'MISSING'
      }, Phone: ${phoneNumber || 'MISSING'}, Profile: ${
        messagingProfileId ? 'SET' : 'MISSING'
      }`,
    );

    if (!apiKey) {
      this.logger.error('Telnyx API key is not configured');
      throw new BadRequestException('Telnyx is not configured on this server');
    }

    if (!phoneNumber || !messagingProfileId) {
      this.logger.error(
        `Missing Telnyx config - Phone: ${
          phoneNumber || 'MISSING'
        }, Profile: ${messagingProfileId || 'MISSING'}`,
      );
      throw new BadRequestException(
        'Server misconfiguration: Missing Telnyx credentials',
      );
    }

    try {
      const response = await fetch('https://api.telnyx.com/v2/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: phoneNumber,
          to: dto.to,
          text: dto.message,
          messaging_profile_id: messagingProfileId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.logger.error('Telnyx API error:', {
          status: response.status,
          statusText: response.statusText,
          errors: data.errors,
          to: dto.to,
        });
        throw new BadRequestException(
          data.errors?.[0]?.detail || 'Failed to send SMS via Telnyx',
        );
      }

      this.logger.log(
        `Telnyx SMS sent successfully. ID: ${data.data?.id || 'unknown'}`,
      );

      return {
        success: true,
        messageId: data.data?.id,
        provider: SmsProvider.TELNYX,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Telnyx error: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new BadRequestException(
        (error as Error).message || 'Failed to send SMS via Telnyx',
      );
    }
  }

  /**
   * Validate phone number format (E.164)
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phoneNumber);
  }
}
