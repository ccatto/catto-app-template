/**
 * usePushNotifications - Push notification hook for iOS/Android
 *
 * Handles push notification registration, permissions, and listeners.
 * Silently does nothing on web to avoid errors.
 *
 * Usage:
 *   const { token, requestPermission, isRegistered } = usePushNotifications();
 *
 *   // Request permission (usually on first app launch or after sign-in)
 *   const granted = await requestPermission();
 *
 *   // Token is available after successful registration
 *   if (token) {
 *     // Send token to your backend for push notification targeting
 *   }
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { getLogger } from '../logger';

export interface PushNotificationState {
  /** The device push token (APNs token for iOS, FCM token for Android) */
  token: string | null;
  /** Whether push notifications are registered */
  isRegistered: boolean;
  /** Whether we're currently requesting permission */
  isLoading: boolean;
  /** Any error that occurred during registration */
  error: string | null;
}

export interface UsePushNotificationsOptions {
  /** Called when a notification is received while app is in foreground */
  onNotificationReceived?: (notification: PushNotificationSchema) => void;
  /** Called when user taps on a notification */
  onNotificationActionPerformed?: (action: ActionPerformed) => void;
  /** Auto-request permission on mount (default: false) */
  autoRequest?: boolean;
}

export interface UsePushNotificationsReturn extends PushNotificationState {
  /** Request push notification permissions from the user */
  requestPermission: () => Promise<boolean>;
  /** Check if notifications are already permitted */
  checkPermissions: () => Promise<'granted' | 'denied' | 'prompt'>;
}

export function usePushNotifications(
  options: UsePushNotificationsOptions = {},
): UsePushNotificationsReturn {
  const {
    onNotificationReceived,
    onNotificationActionPerformed,
    autoRequest = false,
  } = options;

  const log = getLogger();

  const [state, setState] = useState<PushNotificationState>({
    token: null,
    isRegistered: false,
    isLoading: false,
    error: null,
  });

  const isNative = Capacitor.isNativePlatform();
  const listenersRegistered = useRef(false);

  /**
   * Check current permission status
   */
  const checkPermissions = useCallback(async (): Promise<
    'granted' | 'denied' | 'prompt'
  > => {
    if (!isNative) return 'denied';

    try {
      const result = await PushNotifications.checkPermissions();
      // Map Capacitor permission states to simplified states
      const receive = result.receive;
      if (receive === 'granted') return 'granted';
      if (receive === 'denied') return 'denied';
      return 'prompt'; // 'prompt' or 'prompt-with-rationale'
    } catch {
      return 'denied';
    }
  }, [isNative]);

  /**
   * Request push notification permissions
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isNative) {
      log.debug('[PushNotifications] Not a native platform, skipping');
      return false;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check current permission status
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        // Request permission
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Push notification permission denied',
        }));
        return false;
      }

      // Register with APNs/FCM
      await PushNotifications.register();

      setState((prev) => ({
        ...prev,
        isLoading: false,
        isRegistered: true,
      }));

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to register for push notifications';
      log.error('[PushNotifications] Registration error:', {
        error: errorMessage,
      });

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      return false;
    }
  }, [isNative, log]);

  /**
   * Set up push notification listeners
   */
  useEffect(() => {
    if (!isNative || listenersRegistered.current) return;

    listenersRegistered.current = true;

    // On successful registration, receive the token
    const registrationListener = PushNotifications.addListener(
      'registration',
      (token: Token) => {
        log.info('[PushNotifications] Registered with token:', {
          token: token.value.substring(0, 20) + '...',
        });
        setState((prev) => ({
          ...prev,
          token: token.value,
          isRegistered: true,
        }));
      },
    );

    // Handle registration errors
    const errorListener = PushNotifications.addListener(
      'registrationError',
      (err) => {
        log.error('[PushNotifications] Registration error:', {
          error: err.error,
        });
        setState((prev) => ({
          ...prev,
          error: err.error,
          isRegistered: false,
        }));
      },
    );

    // Handle notifications received while app is in foreground
    const receivedListener = PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        log.info('[PushNotifications] Notification received:', {
          title: notification.title,
          body: notification.body,
        });
        onNotificationReceived?.(notification);
      },
    );

    // Handle notification tap/action
    const actionListener = PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        log.info('[PushNotifications] Action performed:', {
          actionId: action.actionId,
          notification: action.notification.title,
        });
        onNotificationActionPerformed?.(action);
      },
    );

    // Cleanup listeners on unmount
    return () => {
      registrationListener.then((l) => l.remove());
      errorListener.then((l) => l.remove());
      receivedListener.then((l) => l.remove());
      actionListener.then((l) => l.remove());
    };
  }, [isNative, log, onNotificationReceived, onNotificationActionPerformed]);

  /**
   * Auto-request permission if option is enabled
   */
  useEffect(() => {
    if (autoRequest && isNative && !state.isRegistered && !state.isLoading) {
      requestPermission();
    }
  }, [
    autoRequest,
    isNative,
    state.isRegistered,
    state.isLoading,
    requestPermission,
  ]);

  return {
    ...state,
    requestPermission,
    checkPermissions,
  };
}

export default usePushNotifications;
