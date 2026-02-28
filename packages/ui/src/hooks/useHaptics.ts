// @catto/ui - Haptic feedback hook
'use client';

/**
 * useHaptics - Native haptic feedback hook for iOS/Android
 *
 * Provides haptic feedback on native platforms (iOS/Android via Capacitor).
 * Silently does nothing on web or when Capacitor is not available.
 *
 * Usage:
 *   const { impact, notification, selectionChanged } = useHaptics();
 *
 *   // Light tap feedback (buttons, toggles)
 *   <button onClick={() => { impact('light'); handleClick(); }}>
 *
 *   // Success/error feedback (form submission)
 *   notification('success');
 *   notification('error');
 */
import { useCallback, useMemo } from 'react';

type ImpactWeight = 'light' | 'medium' | 'heavy';
type NotificationStyle = 'success' | 'warning' | 'error';

// Dynamically check for Capacitor availability
function getCapacitorModules() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Capacitor } = require('@capacitor/core');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const {
      Haptics,
      ImpactStyle,
      NotificationType,
    } = require('@capacitor/haptics');
    return { Capacitor, Haptics, ImpactStyle, NotificationType };
  } catch {
    return null;
  }
}

export function useHaptics() {
  const capacitorModules = useMemo(() => getCapacitorModules(), []);

  const isNative = useMemo(() => {
    if (!capacitorModules) return false;
    return capacitorModules.Capacitor.isNativePlatform();
  }, [capacitorModules]);

  /**
   * Trigger impact feedback - use for button taps, UI interactions
   * @param weight - 'light' (default), 'medium', or 'heavy'
   */
  const impact = useCallback(
    async (weight: ImpactWeight = 'light') => {
      if (!isNative || !capacitorModules) return;

      const { Haptics, ImpactStyle } = capacitorModules;
      const impactStyleMap: Record<ImpactWeight, typeof ImpactStyle.Light> = {
        light: ImpactStyle.Light,
        medium: ImpactStyle.Medium,
        heavy: ImpactStyle.Heavy,
      };

      try {
        await Haptics.impact({ style: impactStyleMap[weight] });
      } catch {
        // Silently fail - haptics may not be available
      }
    },
    [isNative, capacitorModules],
  );

  /**
   * Trigger notification feedback - use for success/error states
   * @param type - 'success', 'warning', or 'error'
   */
  const notification = useCallback(
    async (type: NotificationStyle = 'success') => {
      if (!isNative || !capacitorModules) return;

      const { Haptics, NotificationType } = capacitorModules;
      const notificationTypeMap: Record<
        NotificationStyle,
        typeof NotificationType.Success
      > = {
        success: NotificationType.Success,
        warning: NotificationType.Warning,
        error: NotificationType.Error,
      };

      try {
        await Haptics.notification({ type: notificationTypeMap[type] });
      } catch {
        // Silently fail
      }
    },
    [isNative, capacitorModules],
  );

  /**
   * Trigger selection changed feedback - use for sliders, pickers
   */
  const selectionChanged = useCallback(async () => {
    if (!isNative || !capacitorModules) return;
    try {
      await capacitorModules.Haptics.selectionChanged();
    } catch {
      // Silently fail
    }
  }, [isNative, capacitorModules]);

  /**
   * Trigger vibration - use sparingly, mainly for critical alerts
   * @param duration - milliseconds (default 300)
   */
  const vibrate = useCallback(
    async (duration: number = 300) => {
      if (!isNative || !capacitorModules) return;
      try {
        await capacitorModules.Haptics.vibrate({ duration });
      } catch {
        // Silently fail
      }
    },
    [isNative, capacitorModules],
  );

  return {
    impact,
    notification,
    selectionChanged,
    vibrate,
    isNative,
  };
}

export default useHaptics;
