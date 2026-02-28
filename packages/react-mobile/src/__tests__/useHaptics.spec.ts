import { Capacitor } from '@capacitor/core';
import { Haptics } from '@capacitor/haptics';
import { act, renderHook } from '@testing-library/react';
import { useHaptics } from '../hooks/useHaptics';

describe('useHaptics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all haptic functions', () => {
    const { result } = renderHook(() => useHaptics());
    expect(result.current.impact).toBeDefined();
    expect(result.current.notification).toBeDefined();
    expect(result.current.selectionChanged).toBeDefined();
    expect(result.current.vibrate).toBeDefined();
    expect(typeof result.current.isNative).toBe('boolean');
  });

  it('should not call Haptics on web platform', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);

    const { result } = renderHook(() => useHaptics());

    await act(async () => {
      await result.current.impact('light');
      await result.current.notification('success');
      await result.current.selectionChanged();
      await result.current.vibrate(300);
    });

    expect(Haptics.impact).not.toHaveBeenCalled();
    expect(Haptics.notification).not.toHaveBeenCalled();
    expect(Haptics.selectionChanged).not.toHaveBeenCalled();
    expect(Haptics.vibrate).not.toHaveBeenCalled();
  });

  it('should call Haptics.impact on native platform', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);

    const { result } = renderHook(() => useHaptics());

    await act(async () => {
      await result.current.impact('medium');
    });

    expect(Haptics.impact).toHaveBeenCalledWith({ style: 'MEDIUM' });
  });

  it('should call Haptics.notification on native platform', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);

    const { result } = renderHook(() => useHaptics());

    await act(async () => {
      await result.current.notification('error');
    });

    expect(Haptics.notification).toHaveBeenCalledWith({ type: 'ERROR' });
  });

  it('should call Haptics.vibrate on native platform', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);

    const { result } = renderHook(() => useHaptics());

    await act(async () => {
      await result.current.vibrate(500);
    });

    expect(Haptics.vibrate).toHaveBeenCalledWith({ duration: 500 });
  });

  it('should default impact weight to light', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);

    const { result } = renderHook(() => useHaptics());

    await act(async () => {
      await result.current.impact();
    });

    expect(Haptics.impact).toHaveBeenCalledWith({ style: 'LIGHT' });
  });
});
