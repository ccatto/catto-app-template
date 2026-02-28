import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CattoPaymentsService } from '../catto-payments.service';
import { CATTO_PAYMENTS_CONFIG } from '../constants';
import { CattoPaymentsConfig } from '../interfaces/config.interfaces';

// Mock Stripe
const mockPaymentIntentsCreate = jest.fn();
const mockPaymentIntentsUpdate = jest.fn();
const mockCheckoutSessionsCreate = jest.fn();
const mockCheckoutSessionsRetrieve = jest.fn();
const mockPricesList = jest.fn();
const mockConstructEvent = jest.fn();

jest.mock('stripe', () => {
  const MockStripe = jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: mockPaymentIntentsCreate,
      update: mockPaymentIntentsUpdate,
    },
    checkout: {
      sessions: {
        create: mockCheckoutSessionsCreate,
        retrieve: mockCheckoutSessionsRetrieve,
      },
    },
    prices: { list: mockPricesList },
    webhooks: { constructEvent: mockConstructEvent },
  }));
  (MockStripe as any).errors = {
    StripeError: class StripeError extends Error {},
  };
  return MockStripe;
});

async function createService(
  config: CattoPaymentsConfig,
): Promise<CattoPaymentsService> {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      CattoPaymentsService,
      { provide: CATTO_PAYMENTS_CONFIG, useValue: config },
    ],
  }).compile();

  return module.get<CattoPaymentsService>(CattoPaymentsService);
}

describe('CattoPaymentsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isConfigured', () => {
    it('returns true when secretKey is provided', async () => {
      const service = await createService({ secretKey: 'sk_test_123' });
      expect(service.isConfigured).toBe(true);
    });

    it('returns false when secretKey is undefined', async () => {
      const service = await createService({});
      expect(service.isConfigured).toBe(false);
    });

    it('returns false when disabled is true', async () => {
      const service = await createService({
        secretKey: 'sk_test_123',
        disabled: true,
      });
      expect(service.isConfigured).toBe(false);
    });
  });

  describe('createPaymentIntent()', () => {
    it('creates PaymentIntent with correct params', async () => {
      const service = await createService({ secretKey: 'sk_test_123' });

      const mockIntent = {
        id: 'pi_123',
        client_secret: 'pi_123_secret',
        amount: 5000,
      };
      mockPaymentIntentsCreate.mockResolvedValue(mockIntent);

      const result = await service.createPaymentIntent({
        amountCents: 5000,
        currency: 'usd',
        metadata: { user_id: 'user-1' },
      });

      expect(result).toEqual(mockIntent);
      expect(mockPaymentIntentsCreate).toHaveBeenCalledWith({
        amount: 5000,
        currency: 'usd',
        metadata: { user_id: 'user-1' },
      });
    });

    it('throws when Stripe is not configured', async () => {
      const service = await createService({});

      await expect(
        service.createPaymentIntent({ amountCents: 1000 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('uses default currency usd', async () => {
      const service = await createService({ secretKey: 'sk_test_123' });

      mockPaymentIntentsCreate.mockResolvedValue({ id: 'pi_123' });

      await service.createPaymentIntent({ amountCents: 1000 });

      expect(mockPaymentIntentsCreate).toHaveBeenCalledWith(
        expect.objectContaining({ currency: 'usd' }),
      );
    });
  });

  describe('updatePaymentIntentMetadata()', () => {
    it('updates metadata on existing intent', async () => {
      const service = await createService({ secretKey: 'sk_test_123' });

      const mockUpdated = { id: 'pi_123', metadata: { paymentId: 'db-1' } };
      mockPaymentIntentsUpdate.mockResolvedValue(mockUpdated);

      const result = await service.updatePaymentIntentMetadata('pi_123', {
        paymentId: 'db-1',
      });

      expect(result).toEqual(mockUpdated);
      expect(mockPaymentIntentsUpdate).toHaveBeenCalledWith('pi_123', {
        metadata: { paymentId: 'db-1' },
      });
    });
  });

  describe('createCheckoutSession()', () => {
    it('returns session ID and URL', async () => {
      const service = await createService({ secretKey: 'sk_test_123' });

      mockCheckoutSessionsCreate.mockResolvedValue({
        id: 'cs_123',
        url: 'https://checkout.stripe.com/pay/cs_123',
      });

      const result = await service.createCheckoutSession({
        priceId: 'price_123',
        mode: 'payment',
        successUrl: 'https://app.com/success',
        cancelUrl: 'https://app.com/cancel',
      });

      expect(result).toEqual({
        sessionId: 'cs_123',
        url: 'https://checkout.stripe.com/pay/cs_123',
      });
    });

    it('throws when session URL is null', async () => {
      const service = await createService({ secretKey: 'sk_test_123' });

      mockCheckoutSessionsCreate.mockResolvedValue({
        id: 'cs_123',
        url: null,
      });

      await expect(
        service.createCheckoutSession({
          priceId: 'price_123',
          mode: 'payment',
          successUrl: 'https://app.com/success',
          cancelUrl: 'https://app.com/cancel',
        }),
      ).rejects.toThrow('Failed to generate checkout URL');
    });
  });

  describe('getCheckoutSession()', () => {
    it('retrieves session with expanded options', async () => {
      const service = await createService({ secretKey: 'sk_test_123' });

      const mockSession = { id: 'cs_123', payment_intent: { id: 'pi_123' } };
      mockCheckoutSessionsRetrieve.mockResolvedValue(mockSession);

      const result = await service.getCheckoutSession('cs_123');

      expect(result).toEqual(mockSession);
      expect(mockCheckoutSessionsRetrieve).toHaveBeenCalledWith('cs_123', {
        expand: ['line_items', 'payment_intent'],
      });
    });
  });

  describe('listPrices()', () => {
    it('returns active prices', async () => {
      const service = await createService({ secretKey: 'sk_test_123' });

      const mockPrices = [{ id: 'price_1' }, { id: 'price_2' }];
      mockPricesList.mockResolvedValue({ data: mockPrices });

      const result = await service.listPrices();

      expect(result).toEqual(mockPrices);
      expect(mockPricesList).toHaveBeenCalledWith({
        active: true,
        expand: ['data.product'],
      });
    });
  });

  describe('constructWebhookEvent()', () => {
    it('verifies signature and constructs event', async () => {
      const service = await createService({
        secretKey: 'sk_test_123',
        webhookSecret: 'whsec_test',
      });

      const mockEvent = { type: 'payment_intent.succeeded' };
      mockConstructEvent.mockReturnValue(mockEvent);

      const rawBody = Buffer.from('{}');
      const result = service.constructWebhookEvent(rawBody, 'sig_test');

      expect(result).toEqual(mockEvent);
      expect(mockConstructEvent).toHaveBeenCalledWith(
        rawBody,
        'sig_test',
        'whsec_test',
      );
    });

    it('parses without verification when no webhook secret (dev mode)', async () => {
      const service = await createService({ secretKey: 'sk_test_123' });

      const eventPayload = {
        type: 'payment_intent.succeeded',
        data: { object: {} },
      };
      const rawBody = Buffer.from(JSON.stringify(eventPayload));

      const result = service.constructWebhookEvent(rawBody, 'sig_test');

      expect(result).toEqual(eventPayload);
      expect(mockConstructEvent).not.toHaveBeenCalled();
    });

    it('throws when Stripe is not configured', async () => {
      const service = await createService({});

      expect(() =>
        service.constructWebhookEvent(Buffer.from('{}'), 'sig'),
      ).toThrow(BadRequestException);
    });
  });
});
