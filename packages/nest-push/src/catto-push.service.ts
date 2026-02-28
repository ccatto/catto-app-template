import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CATTO_PUSH_CONFIG } from './constants';
import { CattoPushConfig } from './interfaces/config.interfaces';
import { PushSendResult } from './interfaces/push-result.interface';

@Injectable()
export class CattoPushService implements OnModuleInit {
  private readonly logger = new Logger(CattoPushService.name);

  constructor(
    @Inject(CATTO_PUSH_CONFIG) private readonly config: CattoPushConfig,
  ) {}

  onModuleInit() {
    if (this.config.disabled || !this.config.firebaseServiceAccountJson) {
      this.logger.warn(
        'Push notifications disabled (no config or explicitly disabled)',
      );
      return;
    }

    if (admin.apps.length === 0) {
      try {
        const serviceAccount = JSON.parse(
          this.config.firebaseServiceAccountJson,
        );
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        this.logger.log('Firebase Admin initialized');
      } catch (err) {
        this.logger.error('Failed to initialize Firebase Admin', err);
      }
    }
  }

  /**
   * Send a push notification to one device token.
   * Throws on stale/invalid tokens so the caller can prune them.
   */
  async sendToToken(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    if (this.config.disabled || !this.config.firebaseServiceAccountJson) return;
    if (admin.apps.length === 0) return;

    try {
      await admin.messaging().send({
        token,
        notification: { title, body },
        data: data ?? {},
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      });
      this.logger.debug('Push sent', {
        tokenPrefix: token.substring(0, 20),
      });
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (
        error.code === 'messaging/invalid-registration-token' ||
        error.code === 'messaging/registration-token-not-registered'
      ) {
        this.logger.warn('Stale FCM token — should be pruned', {
          tokenPrefix: token.substring(0, 20),
          code: error.code,
        });
        throw err;
      }
      this.logger.error('Failed to send push notification', {
        error: error.message,
        code: error.code,
      });
    }
  }

  /**
   * Send to multiple device tokens for a single user.
   * Returns stale tokens so the caller can clean them up.
   */
  async sendToTokens(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<PushSendResult> {
    const staleTokens: string[] = [];
    await Promise.all(
      tokens.map(async (token) => {
        try {
          await this.sendToToken(token, title, body, data);
        } catch {
          staleTokens.push(token);
        }
      }),
    );
    return { staleTokens };
  }
}
