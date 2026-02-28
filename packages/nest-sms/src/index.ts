/**
 * @catto/nest-sms
 *
 * Catto SMS - NestJS SMS service with Telnyx integration.
 * Provides a config-driven SMS sending service with dynamic module support.
 *
 * ## Quick Start
 *
 * ```typescript
 * import { CattoSmsModule, CattoSmsService } from '@catto/nest-sms';
 *
 * @Module({
 *   imports: [
 *     CattoSmsModule.forRoot({
 *       provider: 'telnyx',
 *       apiKey: process.env.TELNYX_API_KEY,
 *       phoneNumber: process.env.TELNYX_PHONE_NUMBER,
 *       messagingProfileId: process.env.TELNYX_MESSAGING_PROFILE_ID,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * Then inject `CattoSmsService` in any provider:
 *
 * ```typescript
 * @Injectable()
 * export class MyService {
 *   constructor(private smsService: CattoSmsService) {}
 *
 *   async notify(phone: string) {
 *     await this.smsService.sendSms({
 *       to: phone,
 *       message: 'Hello from Catto!',
 *     });
 *   }
 * }
 * ```
 */

// Configuration
export * from './interfaces/config.interfaces';
export * from './constants';

// Module
export * from './catto-sms.module';

// Service
export { CattoSmsService } from './catto-sms.service';

// DTOs
export { SendSmsDto, SmsResponseDto, SmsProvider } from './dto/send-sms.dto';
