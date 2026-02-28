import Stripe from 'stripe';

export interface CreatePaymentIntentParams {
  amountCents: number;
  currency?: string;
  metadata?: Record<string, string>;
}

export interface CreateCheckoutSessionParams {
  priceId: string;
  quantity?: number;
  mode: 'payment' | 'subscription';
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
}

// Re-export Stripe types consumers might need
export type { Stripe };
