// @catto/ui - HideOnScrollWrapper Component
// Wrapper that hides content when scrolling down, shows when scrolling up
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '../../utils';

// ============================================
// Types
// ============================================

export type HideDirection = 'up' | 'down';

export interface HideOnScrollWrapperProps {
  /** Content to wrap */
  children: React.ReactNode;
  /** Direction to hide (up = slide up and hide, down = slide down and hide) */
  hideDirection?: HideDirection;
  /** Threshold in pixels before hide/show triggers (default: 10) */
  threshold?: number;
  /** Whether the hide-on-scroll behavior is enabled */
  enabled?: boolean;
  /** Additional className for the wrapper */
  className?: string;
  /** Callback when visibility changes */
  onVisibilityChange?: (isVisible: boolean) => void;
  /** Custom transition duration in ms (default: 300) */
  transitionDuration?: number;
}

/**
 * HideOnScrollWrapper - Hides content when scrolling down, shows when scrolling up
 *
 * Features:
 * - Hides on scroll down, shows on scroll up
 * - Configurable hide direction (up or down)
 * - Threshold to prevent jitter
 * - Always shows at top of page
 * - Callback for visibility changes
 *
 * Usage:
 * ```tsx
 * <HideOnScrollWrapper hideDirection="up">
 *   <header className="fixed top-0">...</header>
 * </HideOnScrollWrapper>
 *
 * <HideOnScrollWrapper hideDirection="down">
 *   <nav className="fixed bottom-0">...</nav>
 * </HideOnScrollWrapper>
 * ```
 */
const HideOnScrollWrapper: React.FC<HideOnScrollWrapperProps> = ({
  children,
  hideDirection = 'up',
  threshold = 10,
  enabled = true,
  className,
  onVisibilityChange,
  transitionDuration = 300,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll to show/hide
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    requestAnimationFrame(() => {
      // Always show when at top of page
      if (currentScrollY <= threshold) {
        if (!isVisible) {
          setIsVisible(true);
          onVisibilityChange?.(true);
        }
      } else {
        // Show when scrolling up, hide when scrolling down
        const shouldShow = currentScrollY <= lastScrollY;
        if (shouldShow !== isVisible) {
          setIsVisible(shouldShow);
          onVisibilityChange?.(shouldShow);
        }
      }
      setLastScrollY(currentScrollY);
    });
  }, [lastScrollY, isVisible, threshold, onVisibilityChange]);

  // Set up scroll listener
  useEffect(() => {
    if (!enabled) {
      setIsVisible(true);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 10);
    };

    window.addEventListener('scroll', debouncedScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll, enabled]);

  // Transform class based on hide direction and visibility
  const transformClass = isVisible
    ? 'translate-y-0'
    : hideDirection === 'up'
      ? '-translate-y-full'
      : 'translate-y-full';

  return (
    <div
      className={cn('transition-transform', transformClass, className)}
      style={{ transitionDuration: `${transitionDuration}ms` }}
    >
      {children}
    </div>
  );
};

export default HideOnScrollWrapper;
