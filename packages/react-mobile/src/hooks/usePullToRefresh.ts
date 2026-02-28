/**
 * usePullToRefresh - Pull-to-refresh functionality for mobile apps
 *
 * Implements pull-to-refresh gesture detection for native mobile apps.
 * Does nothing on web to avoid interfering with browser's native behavior.
 *
 * Usage:
 *   const { isRefreshing } = usePullToRefresh({
 *     onRefresh: async () => {
 *       await refetchData();
 *     }
 *   });
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { getLogger } from '../logger';
import { useHaptics } from './useHaptics';

export interface UsePullToRefreshOptions {
  /** Callback when pull-to-refresh is triggered */
  onRefresh: () => Promise<void>;
  /** Minimum pull distance to trigger refresh (px). Default: 80 */
  threshold?: number;
  /** Whether pull-to-refresh is enabled. Default: true */
  enabled?: boolean;
}

export interface UsePullToRefreshReturn {
  /** Whether a refresh is currently in progress */
  isRefreshing: boolean;
  /** Manually trigger a refresh */
  triggerRefresh: () => Promise<void>;
}

export function usePullToRefresh(
  options: UsePullToRefreshOptions,
): UsePullToRefreshReturn {
  const { onRefresh, threshold = 80, enabled = true } = options;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { impact } = useHaptics();

  const isNative = Capacitor.isNativePlatform();
  const startY = useRef(0);
  const currentY = useRef(0);
  const isPulling = useRef(false);

  const triggerRefresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    impact('medium');

    try {
      await onRefresh();
    } catch (error) {
      getLogger().error('[PullToRefresh] Refresh error:', {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, onRefresh, impact]);

  useEffect(() => {
    if (!isNative || !enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current) return;

      currentY.current = e.touches[0].clientY;
      const pullDistance = currentY.current - startY.current;

      if (pullDistance > 0 && window.scrollY === 0) {
        if (pullDistance >= threshold && !isRefreshing) {
          impact('light');
        }
      } else {
        isPulling.current = false;
      }
    };

    const handleTouchEnd = () => {
      if (!isPulling.current) return;

      const pullDistance = currentY.current - startY.current;

      if (pullDistance >= threshold && !isRefreshing) {
        getLogger().info('[PullToRefresh] Triggered');
        triggerRefresh();
      }

      isPulling.current = false;
      startY.current = 0;
      currentY.current = 0;
    };

    document.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isNative, enabled, threshold, isRefreshing, triggerRefresh, impact]);

  return {
    isRefreshing,
    triggerRefresh,
  };
}

export default usePullToRefresh;
