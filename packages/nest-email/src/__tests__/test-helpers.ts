import { CattoEmailConfig } from '../interfaces/config.interfaces';

export function createMockConfig(
  overrides: Partial<CattoEmailConfig> = {},
): CattoEmailConfig {
  return {
    apiKey: 'SG.test-api-key',
    fromEmail: 'test@example.com',
    ...overrides,
  };
}

export function createMockFetch(
  status = 202,
  body = '',
): jest.Mock<Promise<Response>> {
  return jest.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    text: jest.fn().mockResolvedValue(body),
    json: jest.fn().mockResolvedValue(JSON.parse(body || '{}')),
  } as unknown as Response);
}
