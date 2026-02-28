import { CattoSmsConfig } from '../interfaces/config.interfaces';

export function createMockConfig(
  overrides: Partial<CattoSmsConfig> = {},
): CattoSmsConfig {
  return {
    provider: 'telnyx',
    apiKey: 'KEY_test123',
    phoneNumber: '+15551234567',
    messagingProfileId: 'profile-123',
    ...overrides,
  };
}
