/**
 * Configuration for @catto/nest-sms
 */
export interface CattoSmsConfig {
  /** SMS provider (currently only 'telnyx' is supported) */
  provider: 'telnyx';

  /** Telnyx API key. If undefined, SMS sending is disabled. */
  apiKey?: string;

  /** Telnyx phone number (E.164 format, e.g., '+15551234567') */
  phoneNumber?: string;

  /** Telnyx messaging profile ID */
  messagingProfileId?: string;

  /** Force disable sending even if credentials are set */
  disabled?: boolean;
}
