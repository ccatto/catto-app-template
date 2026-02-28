/**
 * Configuration for @catto/nest-email
 */
export interface CattoEmailConfig {
  /** SendGrid API key. If undefined, email sending is disabled (log-only mode). */
  apiKey?: string;

  /** Default "from" email address (e.g., 'noreply@example.com') */
  fromEmail: string;

  /** Force disable sending even if apiKey is set */
  disabled?: boolean;
}
