import { Test, TestingModule } from '@nestjs/testing';
import { CattoPushService } from '../catto-push.service';
import { CATTO_PUSH_CONFIG } from '../constants';
import { CattoPushConfig } from '../interfaces/config.interfaces';

// Store mocks on a shared object so the hoisted jest.mock can access them
const mocks = {
  send: jest.fn(),
  initializeApp: jest.fn(),
  cert: jest.fn(),
  _apps: [] as any[],
};

jest.mock('firebase-admin', () => ({
  get apps() {
    return mocks._apps;
  },
  initializeApp: (...args: any[]) => {
    mocks._apps.push({});
    return mocks.initializeApp(...args);
  },
  credential: {
    get cert() {
      return mocks.cert;
    },
  },
  messaging: () => ({
    get send() {
      return mocks.send;
    },
  }),
}));

async function createService(
  config: CattoPushConfig,
): Promise<CattoPushService> {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      CattoPushService,
      { provide: CATTO_PUSH_CONFIG, useValue: config },
    ],
  }).compile();

  const service = module.get<CattoPushService>(CattoPushService);
  service.onModuleInit();
  return service;
}

describe('CattoPushService', () => {
  beforeEach(() => {
    mocks.send.mockReset();
    mocks.initializeApp.mockReset();
    mocks.cert.mockReset();
    mocks._apps.length = 0;
  });

  describe('onModuleInit()', () => {
    it('initializes Firebase when config is provided', async () => {
      const json = JSON.stringify({ project_id: 'test-project' });
      await createService({ firebaseServiceAccountJson: json });

      expect(mocks.cert).toHaveBeenCalledWith({ project_id: 'test-project' });
      expect(mocks.initializeApp).toHaveBeenCalled();
    });

    it('skips initialization when disabled', async () => {
      await createService({
        firebaseServiceAccountJson: '{"test": true}',
        disabled: true,
      });

      expect(mocks.initializeApp).not.toHaveBeenCalled();
    });

    it('skips initialization when no config JSON', async () => {
      await createService({});

      expect(mocks.initializeApp).not.toHaveBeenCalled();
    });
  });

  describe('sendToToken()', () => {
    it('sends push notification via Firebase messaging', async () => {
      const json = JSON.stringify({ project_id: 'test' });
      const service = await createService({
        firebaseServiceAccountJson: json,
      });

      mocks.send.mockResolvedValue('message-id-123');

      await service.sendToToken('device-token', 'Title', 'Body', {
        type: 'FOLLOW',
      });

      expect(mocks.send).toHaveBeenCalledWith({
        token: 'device-token',
        notification: { title: 'Title', body: 'Body' },
        data: { type: 'FOLLOW' },
        apns: {
          payload: {
            aps: { sound: 'default', badge: 1 },
          },
        },
      });
    });

    it('throws on stale/invalid registration token', async () => {
      const json = JSON.stringify({ project_id: 'test' });
      const service = await createService({
        firebaseServiceAccountJson: json,
      });

      const staleError = {
        code: 'messaging/invalid-registration-token',
        message: 'Invalid token',
      };
      mocks.send.mockRejectedValue(staleError);

      await expect(
        service.sendToToken('stale-token', 'Title', 'Body'),
      ).rejects.toBe(staleError);
    });

    it('is a no-op when disabled', async () => {
      const service = await createService({
        firebaseServiceAccountJson: '{"test": true}',
        disabled: true,
      });

      await service.sendToToken('token', 'Title', 'Body');
      expect(mocks.send).not.toHaveBeenCalled();
    });

    it('is a no-op when firebaseServiceAccountJson is undefined', async () => {
      const service = await createService({});

      await service.sendToToken('token', 'Title', 'Body');
      expect(mocks.send).not.toHaveBeenCalled();
    });

    it('does not throw on non-stale errors', async () => {
      const json = JSON.stringify({ project_id: 'test' });
      const service = await createService({
        firebaseServiceAccountJson: json,
      });

      mocks.send.mockRejectedValue({
        code: 'messaging/internal-error',
        message: 'Internal error',
      });

      await expect(
        service.sendToToken('token', 'Title', 'Body'),
      ).resolves.toBeUndefined();
    });
  });

  describe('sendToTokens()', () => {
    it('returns staleTokens for failed sends', async () => {
      const json = JSON.stringify({ project_id: 'test' });
      const service = await createService({
        firebaseServiceAccountJson: json,
      });

      mocks.send.mockResolvedValueOnce('ok').mockRejectedValueOnce({
        code: 'messaging/invalid-registration-token',
        message: 'Invalid',
      });

      const result = await service.sendToTokens(
        ['good-token', 'stale-token'],
        'Title',
        'Body',
      );

      expect(result.staleTokens).toEqual(['stale-token']);
    });

    it('returns empty staleTokens on all success', async () => {
      const json = JSON.stringify({ project_id: 'test' });
      const service = await createService({
        firebaseServiceAccountJson: json,
      });

      mocks.send.mockResolvedValue('ok');

      const result = await service.sendToTokens(
        ['token1', 'token2'],
        'Title',
        'Body',
      );

      expect(result.staleTokens).toEqual([]);
    });
  });
});
