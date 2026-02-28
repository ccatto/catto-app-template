import { Capacitor } from '@capacitor/core';
import { act, renderHook } from '@testing-library/react';
import { useQRScanner } from '../hooks/useQRScanner';

describe('useQRScanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    const onScan = vi.fn();
    const { result } = renderHook(() => useQRScanner({ onScan }));

    expect(result.current.isNative).toBe(false);
    expect(result.current.isScanning).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.scanNative).toBeDefined();
    expect(result.current.startScanning).toBeDefined();
    expect(result.current.stopScanning).toBeDefined();
    expect(result.current.requestPermission).toBeDefined();
  });

  it('should toggle scanning state', () => {
    const onScan = vi.fn();
    const { result } = renderHook(() => useQRScanner({ onScan }));

    act(() => {
      result.current.startScanning();
    });
    expect(result.current.isScanning).toBe(true);

    act(() => {
      result.current.stopScanning();
    });
    expect(result.current.isScanning).toBe(false);
  });

  it('should do nothing when scanNative called on web', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
    const onScan = vi.fn();
    const { result } = renderHook(() => useQRScanner({ onScan }));

    await act(async () => {
      await result.current.scanNative();
    });

    expect(onScan).not.toHaveBeenCalled();
  });
});
