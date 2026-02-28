export interface CattoPaymentsConfig {
  /** Stripe secret key. Undefined = payments disabled. */
  secretKey?: string;
  /** Stripe webhook signing secret for signature verification */
  webhookSecret?: string;
  /** Stripe API version (default: '2026-01-28.clover') */
  apiVersion?: string;
  /** Force disable payments */
  disabled?: boolean;
}
