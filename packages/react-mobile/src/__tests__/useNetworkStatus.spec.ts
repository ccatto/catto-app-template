import { Capacitor } from '@capacitor/core';
import { act, renderHook } from '@testing-library/react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

describe('useNetworkStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useNetworkStatus());

    expect(result.current.isConnected).toBeDefined();
    expect(result.current.connectionType).toBeDefined();
    expect(result.current.checkStatus).toBeDefined();
  });

  it('should use navigator.onLine on web platform', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });

    const { result } = renderHook(() => useNetworkStatus());

    // Wait for checkStatus to complete
    await vi.waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current.isConnected).toBe(true);
  });

  it('should provide a checkStatus callback', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);

    const { result } = renderHook(() => useNetworkStatus());

    let status: { connected: boolean; connectionType: string };
    await act(async () => {
      status = await result.current.checkStatus();
    });

    expect(status!).toHaveProperty('connected');
    expect(status!).toHaveProperty('connectionType');
  });
});
