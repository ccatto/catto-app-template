import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createBrowserLogger } from '../browser';

// Mock pino before importing the module under test
const mockDebug = vi.fn();
const mockInfo = vi.fn();
const mockWarn = vi.fn();
const mockError = vi.fn();

vi.mock('pino', () => ({
  default: vi.fn(() => ({
    debug: mockDebug,
    info: mockInfo,
    warn: mockWarn,
    error: mockError,
  })),
}));

describe('createBrowserLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a logger with all four methods', () => {
    const log = createBrowserLogger({ env: 'test' });
    expect(typeof log.debug).toBe('function');
    expect(typeof log.info).toBe('function');
    expect(typeof log.warn).toBe('function');
    expect(typeof log.error).toBe('function');
  });

  it('delegates debug/info/warn to pino', () => {
    const log = createBrowserLogger({ env: 'test' });

    log.debug('debug msg', { key: 'val' });
    expect(mockDebug).toHaveBeenCalledWith({ key: 'val' }, 'debug msg');

    log.info('info msg');
    expect(mockInfo).toHaveBeenCalledWith({}, 'info msg');

    log.warn('warn msg', { w: true });
    expect(mockWarn).toHaveBeenCalledWith({ w: true }, 'warn msg');
  });

  it('handles direct Error objects in error()', () => {
    const log = createBrowserLogger({ env: 'production' });
    const err = new Error('boom');
    log.error('failed', err);
    expect(mockError).toHaveBeenCalledWith(
      expect.objectContaining({
        err: 'boom',
        name: 'Error',
        stack: expect.any(String),
      }),
      'failed',
    );
  });

  it('handles wrapped errors in error()', () => {
    const log = createBrowserLogger({ env: 'production' });
    const err = new Error('wrapped');
    log.error('failed', { error: err, userId: '42' });
    expect(mockError).toHaveBeenCalledWith(
      expect.objectContaining({
        err: 'wrapped',
        userId: '42',
      }),
      'failed',
    );
  });

  it('handles plain string error messages', () => {
    const log = createBrowserLogger({ env: 'production' });
    log.error('just a message');
    expect(mockError).toHaveBeenCalledWith('just a message');
  });

  it('handles error with plain data object', () => {
    const log = createBrowserLogger({ env: 'production' });
    log.error('with data', { code: 500, detail: 'server error' });
    expect(mockError).toHaveBeenCalledWith(
      { code: 500, detail: 'server error' },
      'with data',
    );
  });

  it('bridges to console.error in dev mode', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const log = createBrowserLogger({ env: 'development' });
    const err = new Error('dev error');
    log.error('oops', err);
    expect(consoleSpy).toHaveBeenCalledWith('[LOG ERROR] oops', err);
    consoleSpy.mockRestore();
  });

  it('does NOT bridge to console.error in production', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const log = createBrowserLogger({ env: 'production' });
    log.error('oops', new Error('prod error'));
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
