import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { act, renderHook } from '@testing-library/react';
import { usePushNotifications } from '../hooks/usePushNotifications';

describe('usePushNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Return shape ──

  it('should return all expected fields', () => {
    const { result } = renderHook(() => usePushNotifications());

    expect(result.current.token).toBeNull();
    expect(result.current.isRegistered).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.requestPermission).toBe('function');
    expect(typeof result.current.checkPermissions).toBe('function');
  });

  // ── Web platform (default mock: isNativePlatform = false) ──

  describe('on web platform', () => {
    it('requestPermission should return false without calling Capacitor', async () => {
      const { result } = renderHook(() => usePushNotifications());

      let granted: boolean = true;
      await act(async () => {
        granted = await result.current.requestPermission();
      });

      expect(granted).toBe(false);
      expect(PushNotifications.checkPermissions).not.toHaveBeenCalled();
      expect(PushNotifications.register).not.toHaveBeenCalled();
    });

    it('checkPermissions should return denied', async () => {
      const { result } = renderHook(() => usePushNotifications());

      let status: string = '';
      await act(async () => {
        status = await result.current.checkPermissions();
      });

      expect(status).toBe('denied');
    });

    it('should not set up listeners', () => {
      renderHook(() => usePushNotifications());
      expect(PushNotifications.addListener).not.toHaveBeenCalled();
    });
  });

  // ── Native platform ──

  describe('on native platform', () => {
    beforeEach(() => {
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
    });

    it('requestPermission should call checkPermissions, requestPermissions, and register', async () => {
      vi.mocked(PushNotifications.checkPermissions).mockResolvedValue({
        receive: 'prompt',
      });
      vi.mocked(PushNotifications.requestPermissions).mockResolvedValue({
        receive: 'granted',
      });

      const { result } = renderHook(() => usePushNotifications());

      let granted: boolean = false;
      await act(async () => {
        granted = await result.current.requestPermission();
      });

      expect(granted).toBe(true);
      expect(PushNotifications.checkPermissions).toHaveBeenCalled();
      expect(PushNotifications.requestPermissions).toHaveBeenCalled();
      expect(PushNotifications.register).toHaveBeenCalled();
      expect(result.current.isRegistered).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('should skip requestPermissions if already granted', async () => {
      vi.mocked(PushNotifications.checkPermissions).mockResolvedValue({
        receive: 'granted',
      });

      const { result } = renderHook(() => usePushNotifications());

      let granted: boolean = false;
      await act(async () => {
        granted = await result.current.requestPermission();
      });

      expect(granted).toBe(true);
      expect(PushNotifications.requestPermissions).not.toHaveBeenCalled();
      expect(PushNotifications.register).toHaveBeenCalled();
    });

    it('should return false and set error when permission denied', async () => {
      vi.mocked(PushNotifications.checkPermissions).mockResolvedValue({
        receive: 'prompt',
      });
      vi.mocked(PushNotifications.requestPermissions).mockResolvedValue({
        receive: 'denied',
      });

      const { result } = renderHook(() => usePushNotifications());

      let granted: boolean = true;
      await act(async () => {
        granted = await result.current.requestPermission();
      });

      expect(granted).toBe(false);
      expect(result.current.error).toBe('Push notification permission denied');
      expect(PushNotifications.register).not.toHaveBeenCalled();
    });

    it('should handle registration errors', async () => {
      vi.mocked(PushNotifications.checkPermissions).mockRejectedValue(
        new Error('Device not supported'),
      );

      const { result } = renderHook(() => usePushNotifications());

      let granted: boolean = true;
      await act(async () => {
        granted = await result.current.requestPermission();
      });

      expect(granted).toBe(false);
      expect(result.current.error).toBe('Device not supported');
      expect(result.current.isLoading).toBe(false);
    });

    it('checkPermissions should return the mapped status', async () => {
      vi.mocked(PushNotifications.checkPermissions).mockResolvedValue({
        receive: 'granted',
      });

      const { result } = renderHook(() => usePushNotifications());

      let status: string = '';
      await act(async () => {
        status = await result.current.checkPermissions();
      });

      expect(status).toBe('granted');
    });

    it('should set up 4 listeners on mount', () => {
      renderHook(() => usePushNotifications());

      expect(PushNotifications.addListener).toHaveBeenCalledTimes(4);
      expect(PushNotifications.addListener).toHaveBeenCalledWith(
        'registration',
        expect.any(Function),
      );
      expect(PushNotifications.addListener).toHaveBeenCalledWith(
        'registrationError',
        expect.any(Function),
      );
      expect(PushNotifications.addListener).toHaveBeenCalledWith(
        'pushNotificationReceived',
        expect.any(Function),
      );
      expect(PushNotifications.addListener).toHaveBeenCalledWith(
        'pushNotificationActionPerformed',
        expect.any(Function),
      );
    });

    it('should clean up listeners on unmount', async () => {
      const removeFn = vi.fn();
      vi.mocked(PushNotifications.addListener).mockResolvedValue({
        remove: removeFn,
      });

      const { unmount } = renderHook(() => usePushNotifications());
      unmount();

      // Wait for cleanup promises to resolve
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(removeFn).toHaveBeenCalledTimes(4);
    });
  });

  // ── Auto-request ──

  describe('autoRequest option', () => {
    it('should auto-request permission on mount when enabled on native', async () => {
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
      vi.mocked(PushNotifications.checkPermissions).mockResolvedValue({
        receive: 'granted',
      });

      await act(async () => {
        renderHook(() => usePushNotifications({ autoRequest: true }));
      });

      expect(PushNotifications.checkPermissions).toHaveBeenCalled();
      expect(PushNotifications.register).toHaveBeenCalled();
    });

    it('should not auto-request on web even when enabled', () => {
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);

      renderHook(() => usePushNotifications({ autoRequest: true }));

      expect(PushNotifications.checkPermissions).not.toHaveBeenCalled();
    });
  });
});
