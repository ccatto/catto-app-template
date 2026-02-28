import { Capacitor } from '@capacitor/core';
import { act, renderHook } from '@testing-library/react';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

describe('usePullToRefresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return isRefreshing and triggerRefresh', () => {
    const onRefresh = vi.fn(() => Promise.resolve());
    const { result } = renderHook(() => usePullToRefresh({ onRefresh }));

    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.triggerRefresh).toBeDefined();
  });

  it('should call onRefresh when triggerRefresh is called', async () => {
    const onRefresh = vi.fn(() => Promise.resolve());
    const { result } = renderHook(() => usePullToRefresh({ onRefresh }));

    await act(async () => {
      await result.current.triggerRefresh();
    });

    expect(onRefresh).toHaveBeenCalled();
  });

  it('should set isRefreshing during refresh', async () => {
    let resolveRefresh: () => void;
    const onRefresh = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveRefresh = resolve;
        }),
    );

    const { result } = renderHook(() => usePullToRefresh({ onRefresh }));

    // Start refresh
    let refreshPromise: Promise<void>;
    act(() => {
      refreshPromise = result.current.triggerRefresh();
    });

    // Should be refreshing
    expect(result.current.isRefreshing).toBe(true);

    // Finish refresh
    await act(async () => {
      resolveRefresh!();
      await refreshPromise!;
    });

    expect(result.current.isRefreshing).toBe(false);
  });

  it('should not attach touch listeners on web', () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
    const spy = vi.spyOn(document, 'addEventListener');

    const onRefresh = vi.fn(() => Promise.resolve());
    renderHook(() => usePullToRefresh({ onRefresh }));

    expect(spy).not.toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function),
      expect.any(Object),
    );

    spy.mockRestore();
  });
});
