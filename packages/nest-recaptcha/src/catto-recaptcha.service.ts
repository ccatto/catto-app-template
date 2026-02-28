import { Injectable, Inject, Logger } from '@nestjs/common';
import { CATTO_RECAPTCHA_CONFIG } from './constants';
import { CattoRecaptchaConfig } from './interfaces/config.interfaces';
import { RecaptchaResult } from './interfaces/recaptcha-result.interface';

const DEFAULT_SCORE_THRESHOLD = 0.5;
const GOOGLE_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

@Injectable()
export class CattoRecaptchaService {
  private readonly logger = new Logger(CattoRecaptchaService.name);
  private readonly scoreThreshold: number;

  constructor(
    @Inject(CATTO_RECAPTCHA_CONFIG)
    private readonly config: CattoRecaptchaConfig,
  ) {
    this.scoreThreshold = config.scoreThreshold ?? DEFAULT_SCORE_THRESHOLD;

    if (this.config.disabled) {
      this.logger.warn('reCAPTCHA verification is disabled via configuration');
    } else if (this.config.secretKey) {
      this.logger.log('reCAPTCHA verification initialized');
    } else {
      this.logger.warn(
        'reCAPTCHA secret key not configured - verification disabled (dev mode)',
      );
    }
  }

  /**
   * Verify a reCAPTCHA v3 token with Google's API.
   * Returns the full verification result.
   */
  async verify(token: string): Promise<RecaptchaResult> {
    if (this.config.disabled || !this.config.secretKey) {
      return { success: true, score: 1.0 };
    }

    try {
      const response = await fetch(GOOGLE_VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${this.config.secretKey}&response=${token}`,
      });

      const data = await response.json();

      return {
        success: data.success ?? false,
        score: data.score,
        action: data.action,
        errorCodes: data['error-codes'],
      };
    } catch (error) {
      this.logger.error(
        `reCAPTCHA verification error: ${(error as Error).message}`,
        (error as Error).stack,
      );
      return {
        success: false,
        errorCodes: ['network-error'],
      };
    }
  }

  /**
   * Convenience method: returns true if the token passes verification
   * and the score meets the configured threshold.
   *
   * When secretKey is not configured or disabled, returns true (dev mode passthrough).
   */
  async isHuman(token: string): Promise<boolean> {
    const result = await this.verify(token);

    if (!result.success) {
      this.logger.warn(
        `reCAPTCHA failed: success=${result.success}, errorCodes=${result.errorCodes?.join(',')}`,
      );
      return false;
    }

    if (result.score !== undefined && result.score < this.scoreThreshold) {
      this.logger.warn(
        `reCAPTCHA score too low: ${result.score} < ${this.scoreThreshold}`,
      );
      return false;
    }

    return true;
  }
}
