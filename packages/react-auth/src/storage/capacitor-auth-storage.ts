/**
 * @catto/react-auth - Capacitor Auth Storage
 *
 * Capacitor-based auth storage using @capacitor/preferences.
 * Works on BOTH web and mobile (no platform detection needed!).
 *
 * - Web: Uses localStorage
 * - iOS: Uses UserDefaults/Keychain
 * - Android: Uses SharedPreferences
 */
import { Preferences } from '@capacitor/preferences';
import type { IAuthStorage } from './auth-storage.interface';

export interface CapacitorAuthStorageOptions {
  /** Key prefix for stored tokens (default: 'catto_auth') */
  keyPrefix?: string;
}

export class CapacitorAuthStorage implements IAuthStorage {
  private readonly ACCESS_TOKEN_KEY: string;
  private readonly REFRESH_TOKEN_KEY: string;

  constructor(options?: CapacitorAuthStorageOptions) {
    const prefix = options?.keyPrefix ?? 'catto_auth';
    this.ACCESS_TOKEN_KEY = `${prefix}_access_token`;
    this.REFRESH_TOKEN_KEY = `${prefix}_refresh_token`;
  }

  async setAccessToken(token: string): Promise<void> {
    await Preferences.set({
      key: this.ACCESS_TOKEN_KEY,
      value: token,
    });
  }

  async getAccessToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.ACCESS_TOKEN_KEY });
    return value;
  }

  async setRefreshToken(token: string): Promise<void> {
    await Preferences.set({
      key: this.REFRESH_TOKEN_KEY,
      value: token,
    });
  }

  async getRefreshToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.REFRESH_TOKEN_KEY });
    return value;
  }

  async clearTokens(): Promise<void> {
    await Promise.all([
      Preferences.remove({ key: this.ACCESS_TOKEN_KEY }),
      Preferences.remove({ key: this.REFRESH_TOKEN_KEY }),
    ]);
  }

  async hasTokens(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    return accessToken !== null;
  }
}
