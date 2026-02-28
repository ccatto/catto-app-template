'use client';

/**
 * PushNotificationProvider - Initializes push notifications for mobile apps
 *
 * This provider should be placed in the root layout to initialize push notifications
 * on app launch. It handles:
 * - Permission requests (with delay to not interrupt onboarding)
 * - Token registration with the backend (via GraphQL)
 * - Foreground notification handling
 * - Notification tap handling
 *
 * Usage:
 *   // In layout.tsx
 *   <PushNotificationProvider>
 *     {children}
 *   </PushNotificationProvider>
 */
import { ReactNode, useEffect, useRef } from 'react';
import { log } from '@app/lib/logger';
import { Capacitor } from '@capacitor/core';
import { usePushNotifications } from '@catto/react-push';
import { apolloClient } from '@lib/apollo-client';
import { useSession } from '@lib/auth-client-compat';
import { REGISTER_PUSH_TOKEN } from '@lib/graphql/mutations/push-token.mutations';
import { useAuth } from '@lib/hooks/useAuth';
import { useHaptics } from '@lib/hooks/useHaptics';

interface PushNotificationProviderProps {
  children: ReactNode;
  /** Delay before requesting permission (ms). Default: 3000 (3 seconds) */
  requestDelay?: number;
  /** Whether to auto-request permissions. Default: true */
  autoRequest?: boolean;
}

export function PushNotificationProvider({
  children,
  requestDelay = 3000,
  autoRequest = true,
}: PushNotificationProviderProps) {
  const { notification } = useHaptics();
  const hasRequested = useRef(false);
  const tokenSent = useRef(false);

  // Dual-auth: check both NextAuth (OAuth) and JWT (email/mobile)
  const { data: session } = useSession();
  const { user: jwtUser, isAuthenticated } = useAuth();
  const isLoggedIn =
    !!session?.user?.id || (isAuthenticated && !!jwtUser?.userId);

  const { token, requestPermission, isRegistered } = usePushNotifications({
    onNotificationReceived: (notif) => {
      // Haptic feedback when notification arrives in foreground
      notification('success');
      log.info('[PushNotificationProvider] Foreground notification:', {
        title: notif.title,
        body: notif.body,
      });
    },
    onNotificationActionPerformed: (action) => {
      log.info('[PushNotificationProvider] Notification tapped:', {
        actionId: action.actionId,
        data: action.notification.data,
      });
      // Handle navigation based on notification data
      // For example: router.push(action.notification.data?.url)
    },
  });

  // Request permission after a delay (to not interrupt app onboarding)
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || hasRequested.current || !autoRequest) {
      return;
    }

    const timer = setTimeout(async () => {
      hasRequested.current = true;
      const granted = await requestPermission();
      if (granted) {
        log.info('[PushNotificationProvider] Push notifications enabled');
      } else {
        log.info(
          '[PushNotificationProvider] Push notifications denied or unavailable',
        );
      }
    }, requestDelay);

    return () => clearTimeout(timer);
  }, [requestPermission, requestDelay, autoRequest]);

  // Send token to backend when available and user is logged in
  useEffect(() => {
    if (!token || !isRegistered || !isLoggedIn || tokenSent.current) {
      return;
    }

    const sendToken = async () => {
      try {
        const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'
        await apolloClient.mutate({
          mutation: REGISTER_PUSH_TOKEN,
          variables: {
            input: {
              token,
              platform,
            },
          },
        });
        tokenSent.current = true;
        log.info(
          '[PushNotificationProvider] Push token registered with backend',
          {
            platform,
            tokenPrefix: token.substring(0, 20) + '...',
          },
        );
      } catch (error) {
        // Reset so it can retry on next render cycle
        tokenSent.current = false;
        log.error('[PushNotificationProvider] Failed to register push token', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    sendToken();
  }, [token, isRegistered, isLoggedIn]);

  return <>{children}</>;
}

export default PushNotificationProvider;
