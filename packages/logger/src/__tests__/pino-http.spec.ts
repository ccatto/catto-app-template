import { describe, expect, it } from 'vitest';
import { createPinoHttpConfig } from '../pino-http';

describe('createPinoHttpConfig', () => {
  it('returns info level in production', () => {
    const config = createPinoHttpConfig({ env: 'production' });
    expect(config.level).toBe('info');
  });

  it('returns debug level in development', () => {
    const config = createPinoHttpConfig({ env: 'development' });
    expect(config.level).toBe('debug');
  });

  it('includes pino-pretty transport in development', () => {
    const config = createPinoHttpConfig({ env: 'development' });
    expect(config.transport).toBeDefined();
    expect(config.transport?.target).toBe('pino-pretty');
  });

  it('has no transport in production', () => {
    const config = createPinoHttpConfig({ env: 'production' });
    expect(config.transport).toBeUndefined();
  });

  it('uses default HTTP context label', () => {
    const config = createPinoHttpConfig({ env: 'production' });
    expect(config.customProps()).toEqual({ context: 'HTTP' });
  });

  it('accepts custom context label', () => {
    const config = createPinoHttpConfig({
      env: 'production',
      contextLabel: 'API',
    });
    expect(config.customProps()).toEqual({ context: 'API' });
  });

  it('accepts custom level override', () => {
    const config = createPinoHttpConfig({ env: 'production', level: 'warn' });
    expect(config.level).toBe('warn');
  });

  it('includes request body serializer by default', () => {
    const config = createPinoHttpConfig({ env: 'production' });
    expect(config.serializers).toBeDefined();
  });

  it('omits serializers when includeBody is false', () => {
    const config = createPinoHttpConfig({
      env: 'production',
      includeBody: false,
    });
    expect(config.serializers).toBeUndefined();
  });
});
