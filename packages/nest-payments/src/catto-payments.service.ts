import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { CATTO_PAYMENTS_CONFIG } from './constants';
import { CattoPaymentsConfig } from './interfaces/config.interfaces';
import {
  CreatePaymentIntentParams,
  CreateCheckoutSessionParams,
  CheckoutSessionResult,
} from './interfaces/payment.interfaces';

@Injectable()
export class CattoPaymentsService {
  private readonly logger = new Logger(CattoPaymentsService.name);
  private readonly stripe: Stripe | null;
  private readonly webhookSecret: string;

  constructor(
    @Inject(CATTO_PAYMENTS_CONFIG)
    private readonly config: CattoPaymentsConfig,
  ) {
    if (config.disabled || !config.secretKey) {
      this.logger.warn(
        'Stripe payments disabled (no secret key or explicitly disabled)',
      );
      this.stripe = null;
      this.webhookSecret = '';
      return;
    }

    this.stripe = new Stripe(config.secretKey, {
      apiVersion: (config.apiVersion ||
        '2026-01-28.clover') as Stripe.LatestApiVersion,
    });
    this.webhookSecret = config.webhookSecret || '';

    if (!this.webhookSecret) {
      this.logger.warn(
        'STRIPE_WEBHOOK_SECRET not set — webhook signature verification disabled',
      );
    }

    this.logger.log('Stripe payments service initialized');
  }

  /** Whether Stripe is configured and ready to process payments */
  get isConfigured(): boolean {
    return this.stripe !== null;
  }

  // =========================================================================
  // PaymentIntent API
  // =========================================================================

  /**
   * Create a Stripe PaymentIntent.
   * Returns the raw Stripe PaymentIntent object — caller stores it in their DB.
   */
  async createPaymentIntent(
    params: CreatePaymentIntentParams,
  ): Promise<Stripe.PaymentIntent> {
    this.ensureConfigured();

    try {
      const paymentIntent = await this.stripe!.paymentIntents.create({
        amount: params.amountCents,
        currency: params.currency || 'usd',
        metadata: params.metadata || {},
      });

      this.logger.log(`PaymentIntent created: ${paymentIntent.id}`);
      return paymentIntent;
    } catch (error) {
      this.handleStripeError('createPaymentIntent', error);
      throw error;
    }
  }

  /**
   * Update metadata on an existing PaymentIntent.
   */
  async updatePaymentIntentMetadata(
    intentId: string,
    metadata: Record<string, string>,
  ): Promise<Stripe.PaymentIntent> {
    this.ensureConfigured();

    try {
      return await this.stripe!.paymentIntents.update(intentId, { metadata });
    } catch (error) {
      this.handleStripeError('updatePaymentIntentMetadata', error);
      throw error;
    }
  }

  // =========================================================================
  // Checkout Session API
  // =========================================================================

  /**
   * Create a Stripe Checkout Session.
   * Returns session ID and redirect URL.
   */
  async createCheckoutSession(
    params: CreateCheckoutSessionParams,
  ): Promise<CheckoutSessionResult> {
    this.ensureConfigured();

    try {
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        line_items: [
          {
            price: params.priceId,
            quantity: params.quantity || 1,
          },
        ],
        mode: params.mode,
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        automatic_tax: { enabled: true },
      };

      if (params.customerEmail) {
        sessionParams.customer_email = params.customerEmail;
      }

      if (params.metadata && Object.keys(params.metadata).length > 0) {
        sessionParams.metadata = params.metadata;
      }

      const session =
        await this.stripe!.checkout.sessions.create(sessionParams);

      if (!session.url) {
        throw new BadRequestException('Failed to generate checkout URL');
      }

      this.logger.log(`Checkout session created: ${session.id}`);

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      this.handleStripeError('createCheckoutSession', error);
      throw error;
    }
  }

  /**
   * Retrieve a Checkout Session with expanded line items and payment intent.
   */
  async getCheckoutSession(
    sessionId: string,
  ): Promise<Stripe.Checkout.Session> {
    this.ensureConfigured();

    try {
      return await this.stripe!.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'payment_intent'],
      });
    } catch (error) {
      this.handleStripeError('getCheckoutSession', error);
      throw error;
    }
  }

  // =========================================================================
  // Prices API
  // =========================================================================

  /**
   * List active Stripe prices with expanded product data.
   */
  async listPrices(): Promise<Stripe.Price[]> {
    this.ensureConfigured();

    try {
      const prices = await this.stripe!.prices.list({
        active: true,
        expand: ['data.product'],
      });
      return prices.data;
    } catch (error) {
      this.handleStripeError('listPrices', error);
      throw error;
    }
  }

  // =========================================================================
  // Webhook Verification
  // =========================================================================

  /**
   * Verify a Stripe webhook signature and construct the event.
   * If no webhook secret is configured, parses without verification (dev mode).
   */
  constructWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event {
    this.ensureConfigured();

    if (this.webhookSecret) {
      return this.stripe!.webhooks.constructEvent(
        rawBody,
        signature,
        this.webhookSecret,
      );
    }

    // Dev mode — parse without verification
    this.logger.warn(
      'Parsing webhook without signature verification (dev mode)',
    );
    return JSON.parse(rawBody.toString()) as Stripe.Event;
  }

  // =========================================================================
  // Helpers
  // =========================================================================

  private ensureConfigured(): void {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }
  }

  private handleStripeError(method: string, error: any): void {
    this.logger.error(`${method} failed: ${error.message}`, error.stack);

    if (error instanceof Stripe.errors.StripeError) {
      throw new BadRequestException(error.message);
    }
  }
}
