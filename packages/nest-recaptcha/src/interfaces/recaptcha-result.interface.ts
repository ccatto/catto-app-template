/**
 * Structured result from Google reCAPTCHA v3 verification.
 */
export interface RecaptchaResult {
  /** Whether the reCAPTCHA token was valid */
  success: boolean;

  /** Score between 0.0 (bot) and 1.0 (human). Only present for v3. */
  score?: number;

  /** The action name from the reCAPTCHA widget */
  action?: string;

  /** Error codes from Google's API */
  errorCodes?: string[];
}
