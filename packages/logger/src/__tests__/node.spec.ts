import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createNodeLogger } from '../node';

// Mock pino
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

describe('createNodeLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a logger with all four methods', () => {
    const log = createNodeLogger({ env: 'test' });
    expect(typeof log.debug).toBe('function');
    expect(typeof log.info).toBe('function');
    expect(typeof log.warn).toBe('function');
    expect(typeof log.error).toBe('function');
  });

  it('delegates debug/info/warn to pino', () => {
    const log = createNodeLogger({ env: 'test' });

    log.debug('debug msg', { key: 'val' });
    expect(mockDebug).toHaveBeenCalledWith({ key: 'val' }, 'debug msg');

    log.info('info msg');
    expect(mockInfo).toHaveBeenCalledWith({}, 'info msg');

    log.warn('warn msg', { w: true });
    expect(mockWarn).toHaveBeenCalledWith({ w: true }, 'warn msg');
  });

  it('handles Error objects in error()', () => {
    const log = createNodeLogger({ env: 'production' });
    const err = new Error('node boom');
    log.error('failed', err);
    expect(mockError).toHaveBeenCalledWith(
      expect.objectContaining({
        err: 'node boom',
        name: 'Error',
        stack: expect.any(String),
      }),
      'failed',
    );
  });

  it('does NOT bridge to console.error (node logger has no bridge)', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const log = createNodeLogger({ env: 'development' });
    log.error('oops', new Error('dev error'));
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('handles plain error messages', () => {
    const log = createNodeLogger({ env: 'production' });
    log.error('just a message');
    expect(mockError).toHaveBeenCalledWith('just a message');
  });
});
