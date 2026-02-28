import { Preferences } from '@capacitor/preferences';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CapacitorAuthStorage } from '../capacitor-auth-storage';

// Mock @capacitor/preferences before importing the class
const mockStore: Record<string, string> = {};
vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    set: vi.fn(async ({ key, value }: { key: string; value: string }) => {
      mockStore[key] = value;
    }),
    get: vi.fn(async ({ key }: { key: string }) => ({
      value: mockStore[key] ?? null,
    })),
    remove: vi.fn(async ({ key }: { key: string }) => {
      delete mockStore[key];
    }),
  },
}));

describe('CapacitorAuthStorage', () => {
  beforeEach(() => {
    // Clear the mock store
    Object.keys(mockStore).forEach((key) => delete mockStore[key]);
    vi.clearAllMocks();
  });

  describe('with default prefix', () => {
    let storage: CapacitorAuthStorage;

    beforeEach(() => {
      storage = new CapacitorAuthStorage();
    });

    it('stores access token with correct key', async () => {
      await storage.setAccessToken('my-access-token');
      expect(Preferences.set).toHaveBeenCalledWith({
        key: 'catto_auth_access_token',
        value: 'my-access-token',
      });
    });

    it('retrieves access token with correct key', async () => {
      mockStore['catto_auth_access_token'] = 'stored-token';
      const result = await storage.getAccessToken();
      expect(result).toBe('stored-token');
    });

    it('stores refresh token with correct key', async () => {
      await storage.setRefreshToken('my-refresh-token');
      expect(Preferences.set).toHaveBeenCalledWith({
        key: 'catto_auth_refresh_token',
        value: 'my-refresh-token',
      });
    });

    it('retrieves refresh token with correct key', async () => {
      mockStore['catto_auth_refresh_token'] = 'stored-refresh';
      const result = await storage.getRefreshToken();
      expect(result).toBe('stored-refresh');
    });

    it('clears both tokens', async () => {
      mockStore['catto_auth_access_token'] = 'token1';
      mockStore['catto_auth_refresh_token'] = 'token2';

      await storage.clearTokens();

      expect(Preferences.remove).toHaveBeenCalledWith({
        key: 'catto_auth_access_token',
      });
      expect(Preferences.remove).toHaveBeenCalledWith({
        key: 'catto_auth_refresh_token',
      });
    });

    it('hasTokens returns true when access token exists', async () => {
      mockStore['catto_auth_access_token'] = 'some-token';
      const result = await storage.hasTokens();
      expect(result).toBe(true);
    });

    it('hasTokens returns false when no access token', async () => {
      const result = await storage.hasTokens();
      expect(result).toBe(false);
    });

    it('getAccessToken returns null when not set', async () => {
      const result = await storage.getAccessToken();
      expect(result).toBeNull();
    });
  });

  describe('with custom prefix', () => {
    it('uses custom keyPrefix for storage keys', async () => {
      const storage = new CapacitorAuthStorage({ keyPrefix: 'rleaguez' });
      await storage.setAccessToken('custom-token');

      expect(Preferences.set).toHaveBeenCalledWith({
        key: 'rleaguez_access_token',
        value: 'custom-token',
      });
    });

    it('retrieves with custom keyPrefix', async () => {
      const storage = new CapacitorAuthStorage({ keyPrefix: 'myapp' });
      mockStore['myapp_access_token'] = 'custom-stored';

      const result = await storage.getAccessToken();
      expect(result).toBe('custom-stored');
    });
  });
});
