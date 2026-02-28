import { Capacitor } from '@capacitor/core';
import { act, renderHook } from '@testing-library/react';
import { useShare } from '../hooks/useShare';

describe('useShare', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return share function and canShare flag', () => {
    const { result } = renderHook(() => useShare());

    expect(result.current.share).toBeDefined();
    expect(typeof result.current.canShare).toBe('boolean');
    expect(typeof result.current.isNative).toBe('boolean');
  });

  it('should fallback to clipboard on web without navigator.share', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
    // navigator.share is undefined in test environment

    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
    });

    const { result } = renderHook(() => useShare());

    let shareResult: { activityType: string } | null = null;
    await act(async () => {
      shareResult = await result.current.share({
        title: 'Test',
        url: 'https://example.com',
      });
    });

    expect(writeText).toHaveBeenCalledWith('https://example.com');
    expect(shareResult).toEqual({ activityType: 'clipboard' });
  });

  it('should return null when no share method is available', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);

    // Remove clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    });

    const { result } = renderHook(() => useShare());

    let shareResult: unknown;
    await act(async () => {
      shareResult = await result.current.share({
        title: 'Test',
        // No URL so clipboard fallback won't trigger
      });
    });

    expect(shareResult).toBeNull();
  });
});
