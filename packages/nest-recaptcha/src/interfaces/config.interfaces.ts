/**
 * Configuration for @catto/nest-recaptcha
 */
export interface CattoRecaptchaConfig {
  /** Google reCAPTCHA v3 secret key. If undefined, verification is disabled (dev mode). */
  secretKey?: string;

  /** Minimum score to consider human (0.0 - 1.0). Default: 0.5 (Google recommendation). */
  scoreThreshold?: number;

  /** Force disable verification even if secretKey is set. */
  disabled?: boolean;
}
