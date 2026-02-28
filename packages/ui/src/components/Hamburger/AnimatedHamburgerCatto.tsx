// @catto/ui - AnimatedHamburgerCatto Component
// Animated 3-bar hamburger that transforms to X when open
'use client';

import React from 'react';
import { cn } from '../../utils';

// ============================================
// Types
// ============================================

export type HamburgerSize = 'sm' | 'md' | 'lg';

export interface AnimatedHamburgerCattoProps {
  /** Whether the hamburger is in open (X) state */
  isOpen: boolean;
  /** Click handler */
  onClick: () => void;
  /** Size of the hamburger */
  size?: HamburgerSize;
  /** Optional label text below the icon */
  label?: string;
  /** Show label below icon */
  showLabel?: boolean;
  /** Additional className for the button */
  className?: string;
  /** Accessible label */
  'aria-label'?: string;
}

// Size configurations with pixel values for reliable cross-package rendering
const sizeConfig: Record<
  HamburgerSize,
  {
    containerSize: number; // in pixels
    barHeight: number; // in pixels
    topOffset: number; // in pixels
    middleOffset: number; // in pixels
    bottomOffset: number; // in pixels
    labelClass: string;
  }
> = {
  sm: {
    containerSize: 16,
    barHeight: 2,
    topOffset: 2,
    middleOffset: 7,
    bottomOffset: 12,
    labelClass: 'text-[10px] mt-1',
  },
  md: {
    containerSize: 20,
    barHeight: 2,
    topOffset: 3,
    middleOffset: 9,
    bottomOffset: 15,
    labelClass: 'text-xs mt-1.5',
  },
  lg: {
    containerSize: 24,
    barHeight: 2,
    topOffset: 4,
    middleOffset: 11,
    bottomOffset: 18,
    labelClass: 'text-xs mt-2',
  },
};

/**
 * AnimatedHamburgerCatto - Animated 3-bar hamburger menu icon
 *
 * Features:
 * - Smooth CSS transition from hamburger to X
 * - Top bar rotates 45° clockwise
 * - Middle bar fades out
 * - Bottom bar rotates 45° counter-clockwise
 * - Color changes from green (closed) to red (open)
 * - Theme-aware colors
 * - Configurable sizes (sm, md, lg)
 * - Optional label text
 *
 * Usage:
 * ```tsx
 * <AnimatedHamburgerCatto
 *   isOpen={isMenuOpen}
 *   onClick={() => setIsMenuOpen(!isMenuOpen)}
 *   label="Menu"
 * />
 * ```
 */
const AnimatedHamburgerCatto: React.FC<AnimatedHamburgerCattoProps> = ({
  isOpen,
  onClick,
  size = 'lg',
  label,
  showLabel = true,
  className,
  'aria-label': ariaLabel,
}) => {
  const config = sizeConfig[size];

  // Text/label color classes - these control the bar color via currentColor
  const textColorClass = isOpen
    ? 'text-red-700 dark:text-red-400'
    : 'text-green-700 dark:text-green-500';

  // Calculate the middle position for transforms
  const middleY = config.middleOffset;
  const translateAmount = middleY - config.topOffset;

  // Container style
  const containerStyle: React.CSSProperties = {
    width: config.containerSize,
    height: config.containerSize,
    position: 'relative',
  };

  // Base bar style
  const baseBarStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    width: config.containerSize,
    height: config.barHeight,
    backgroundColor: 'currentColor',
    transition: 'transform 300ms, opacity 300ms',
  };

  // Top bar style
  const topBarStyle: React.CSSProperties = {
    ...baseBarStyle,
    top: config.topOffset,
    transform: isOpen
      ? `translateY(${translateAmount}px) rotate(45deg)`
      : 'none',
  };

  // Middle bar style
  const middleBarStyle: React.CSSProperties = {
    ...baseBarStyle,
    top: config.middleOffset,
    opacity: isOpen ? 0 : 1,
  };

  // Bottom bar style
  const bottomBarStyle: React.CSSProperties = {
    ...baseBarStyle,
    top: config.bottomOffset,
    transform: isOpen
      ? `translateY(-${config.bottomOffset - middleY}px) rotate(-45deg)`
      : 'none',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center rounded-lg p-2 transition-colors',
        textColorClass,
        'hover:bg-theme-surface-secondary',
        'focus:outline-none focus:ring-2 focus:ring-theme-secondary',
        className,
      )}
      aria-label={ariaLabel || (isOpen ? 'Close menu' : 'Open menu')}
      aria-expanded={isOpen}
    >
      {/* Hamburger bars container */}
      <div style={containerStyle}>
        {/* Top bar - rotates 45° when open */}
        <span style={topBarStyle} />
        {/* Middle bar - fades out when open */}
        <span style={middleBarStyle} />
        {/* Bottom bar - rotates -45° when open */}
        <span style={bottomBarStyle} />
      </div>

      {/* Optional label */}
      {showLabel && label && (
        <span className={cn(textColorClass, config.labelClass)}>{label}</span>
      )}
    </button>
  );
};

export default AnimatedHamburgerCatto;
