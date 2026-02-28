import { Injectable, Inject, Logger } from '@nestjs/common';
import { CATTO_EMAIL_CONFIG } from './constants';
import { CattoEmailConfig } from './interfaces/config.interfaces';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

@Injectable()
export class CattoEmailService {
  private readonly logger = new Logger(CattoEmailService.name);

  constructor(
    @Inject(CATTO_EMAIL_CONFIG) private readonly config: CattoEmailConfig,
  ) {
    if (this.config.disabled) {
      this.logger.warn('Email service is disabled via configuration');
    } else if (this.config.apiKey) {
      this.logger.log('SendGrid email service initialized');
    } else {
      this.logger.warn(
        'SendGrid API key not found - email sending disabled (log-only mode)',
      );
    }
  }

  /**
   * Send an email via SendGrid API v3
   */
  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    if (this.config.disabled || !this.config.apiKey) {
      this.logger.warn(
        `Email not sent (SendGrid not configured): ${options.subject}`,
      );
      return false;
    }

    const from = options.from || this.config.fromEmail;

    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: options.to }] }],
          from: { email: from },
          subject: options.subject,
          content: [{ type: 'text/html', value: options.html }],
        }),
      });

      if (response.status === 202 || response.status === 200) {
        this.logger.log(`Email sent successfully to ${options.to}`);
        return true;
      }

      const errorBody = await response.text();
      this.logger.error(`SendGrid error (${response.status}): ${errorBody}`);
      return false;
    } catch (error) {
      this.logger.error(
        `Failed to send email: ${(error as Error).message}`,
        (error as Error).stack,
      );
      return false;
    }
  }
}
