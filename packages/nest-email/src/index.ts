/**
 * @catto/nest-email
 *
 * Catto Email - NestJS email service with SendGrid integration.
 * Provides a config-driven email sending service with dynamic module support.
 *
 * ## Quick Start
 *
 * ```typescript
 * import { CattoEmailModule, CattoEmailService } from '@catto/nest-email';
 *
 * @Module({
 *   imports: [
 *     CattoEmailModule.forRoot({
 *       apiKey: process.env.SENDGRID_API_KEY,
 *       fromEmail: 'noreply@example.com',
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * Then inject `CattoEmailService` in any provider:
 *
 * ```typescript
 * @Injectable()
 * export class MyService {
 *   constructor(private emailService: CattoEmailService) {}
 *
 *   async notify(to: string) {
 *     await this.emailService.sendEmail({
 *       to,
 *       subject: 'Hello',
 *       html: '<p>World</p>',
 *     });
 *   }
 * }
 * ```
 */

// Configuration
export * from './interfaces/config.interfaces';
export * from './constants';

// Module
export * from './catto-email.module';

// Service
export { CattoEmailService, SendEmailOptions } from './catto-email.service';
