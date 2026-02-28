import { describe, expect, it } from 'vitest';
import { noopLogger } from '../noop';

describe('noopLogger', () => {
  it('has all four log methods', () => {
    expect(typeof noopLogger.debug).toBe('function');
    expect(typeof noopLogger.info).toBe('function');
    expect(typeof noopLogger.warn).toBe('function');
    expect(typeof noopLogger.error).toBe('function');
  });

  it('does not throw when called with data', () => {
    expect(() => noopLogger.debug('test')).not.toThrow();
    expect(() => noopLogger.info('test', { key: 'value' })).not.toThrow();
    expect(() => noopLogger.warn('test')).not.toThrow();
    expect(() => noopLogger.error('test', new Error('boom'))).not.toThrow();
  });

  it('returns undefined for all methods', () => {
    expect(noopLogger.debug('test')).toBeUndefined();
    expect(noopLogger.info('test')).toBeUndefined();
    expect(noopLogger.warn('test')).toBeUndefined();
    expect(noopLogger.error('test')).toBeUndefined();
  });
});
