import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRecaptcha } from '../hooks/useRecaptcha';

describe('useRecaptcha', () => {
  beforeEach(() => {
    // Clear grecaptcha from window
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).grecaptcha;
    // Clean up any script tags
    document
      .querySelectorAll('script[src*="recaptcha"]')
      .forEach((el) => el.remove());
    document.querySelectorAll('.grecaptcha-badge').forEach((el) => el.remove());
  });

  it('returns ready=true and noop executeRecaptcha when no siteKey', async () => {
    const { result } = renderHook(() => useRecaptcha());

    expect(result.current.ready).toBe(true);
    const token = await result.current.executeRecaptcha();
    expect(token).toBeUndefined();
  });

  it('returns ready=true when siteKey is undefined', async () => {
    const { result } = renderHook(() => useRecaptcha(undefined));

    expect(result.current.ready).toBe(true);
  });

  it('detects already-loaded grecaptcha', () => {
    // Simulate grecaptcha already loaded
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).grecaptcha = {
      ready: (cb: () => void) => cb(),
      execute: vi.fn().mockResolvedValue('test-token'),
    };

    const { result } = renderHook(() => useRecaptcha('test-site-key'));

    expect(result.current.ready).toBe(true);
  });

  it('returns undefined when executeRecaptcha fails', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).grecaptcha = {
      ready: (cb: () => void) => cb(),
      execute: vi.fn().mockRejectedValue(new Error('Failed')),
    };

    const { result } = renderHook(() => useRecaptcha('test-site-key'));

    let token: string | undefined;
    await act(async () => {
      token = await result.current.executeRecaptcha();
    });
    expect(token).toBeUndefined();
  });

  it('executes recaptcha and returns token', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).grecaptcha = {
      ready: (cb: () => void) => cb(),
      execute: vi.fn().mockResolvedValue('recaptcha-token-123'),
    };

    const { result } = renderHook(() => useRecaptcha('test-site-key'));

    let token: string | undefined;
    await act(async () => {
      token = await result.current.executeRecaptcha();
    });
    expect(token).toBe('recaptcha-token-123');
  });
});
