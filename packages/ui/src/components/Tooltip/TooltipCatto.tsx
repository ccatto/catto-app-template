'use client';

import React, { ReactNode, useState } from 'react';
import { cn } from '../../utils';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type TooltipVariant = 'default' | 'orange' | 'navy' | 'dark' | 'light';

export interface TooltipCattoProps {
  /** The content to show in the tooltip */
  content: ReactNode;
  /** The element that triggers the tooltip on hover */
  children: ReactNode;
  /** Position of the tooltip relative to the trigger */
  position?: TooltipPosition;
  /** Color variant of the tooltip */
  variant?: TooltipVariant;
  /** Additional class names for the wrapper */
  className?: string;
  /** Additional class names for the tooltip content */
  tooltipClassName?: string;
  /** Delay before showing tooltip (ms) */
  delay?: number;
  /** Maximum width of tooltip */
  maxWidth?: string;
  /** Extra offset/spacing from the trigger element (in pixels) */
  offset?: number;
}

/**
 * TooltipCatto - A pure CSS tooltip component
 *
 * Uses CSS group-hover instead of JS state for reliability.
 * This avoids hydration issues where JS event handlers can break
 * after React re-renders or async data loads.
 *
 * Features:
 * - Hover-activated tooltip (CSS group-hover, no JS state)
 * - Focus support (CSS group-focus-within)
 * - Multiple positions (top, bottom, left, right)
 * - Color variants (default, orange, navy, dark, light)
 * - Dark mode support
 * - Smooth fade-in animation with configurable delay
 */
const TooltipCatto = ({
  content,
  children,
  position = 'top',
  variant = 'default',
  className,
  tooltipClassName,
  delay = 200,
  maxWidth = '220px',
  offset = 0,
}: TooltipCattoProps) => {
  // Position-specific classes for tooltip placement
  const positionClasses: Record<TooltipPosition, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2',
    bottom: 'top-full left-1/2 -translate-x-1/2',
    left: 'right-full top-1/2 -translate-y-1/2',
    right: 'left-full top-1/2 -translate-y-1/2',
  };

  // Calculate offset styles based on position
  const getOffsetStyle = (): React.CSSProperties => {
    const baseOffset = 8;
    const totalOffset = baseOffset + offset;
    switch (position) {
      case 'top':
        return { marginBottom: `${totalOffset}px` };
      case 'bottom':
        return { marginTop: `${totalOffset}px` };
      case 'left':
        return { marginRight: `${totalOffset}px` };
      case 'right':
        return { marginLeft: `${totalOffset}px` };
    }
  };

  // Variant-specific background and text colors
  const variantClasses: Record<TooltipVariant, string> = {
    default: 'bg-gray-800 text-gray-50 dark:bg-gray-700 dark:text-gray-100',
    orange: 'bg-theme-secondary text-theme-on-secondary',
    navy: 'bg-theme-primary text-theme-on-primary',
    dark: 'bg-gray-900 text-gray-50',
    light: 'bg-gray-50 text-gray-900 border border-gray-200',
  };

  // Arrow colors per variant and position
  const getArrowClasses = (pos: TooltipPosition, v: TooltipVariant): string => {
    const baseArrow: Record<TooltipPosition, string> = {
      top: 'top-full left-1/2 -translate-x-1/2 border-x-transparent border-b-transparent',
      bottom:
        'bottom-full left-1/2 -translate-x-1/2 border-x-transparent border-t-transparent',
      left: 'left-full top-1/2 -translate-y-1/2 border-y-transparent border-r-transparent',
      right:
        'right-full top-1/2 -translate-y-1/2 border-y-transparent border-l-transparent',
    };

    const arrowColors: Record<
      TooltipVariant,
      Record<TooltipPosition, string>
    > = {
      default: {
        top: 'border-t-gray-800 dark:border-t-gray-700',
        bottom: 'border-b-gray-800 dark:border-b-gray-700',
        left: 'border-l-gray-800 dark:border-l-gray-700',
        right: 'border-r-gray-800 dark:border-r-gray-700',
      },
      orange: {
        top: 'border-t-theme-secondary',
        bottom: 'border-b-theme-secondary',
        left: 'border-l-theme-secondary',
        right: 'border-r-theme-secondary',
      },
      navy: {
        top: 'border-t-theme-primary',
        bottom: 'border-b-theme-primary',
        left: 'border-l-theme-primary',
        right: 'border-r-theme-primary',
      },
      dark: {
        top: 'border-t-gray-900',
        bottom: 'border-b-gray-900',
        left: 'border-l-gray-900',
        right: 'border-r-gray-900',
      },
      light: {
        top: 'border-t-gray-50',
        bottom: 'border-b-gray-50',
        left: 'border-l-gray-50',
        right: 'border-r-gray-50',
      },
    };

    return cn(baseArrow[pos], arrowColors[v][pos]);
  };

  // Hide tooltip on click (e.g., link navigation), reset on next hover
  const [clicked, setClicked] = useState(false);

  return (
    <div
      className={cn('group/tooltip relative inline-block', className)}
      onClick={() => setClicked(true)}
      onMouseEnter={() => setClicked(false)}
    >
      {children}

      {/* Tooltip - uses CSS group-hover instead of JS state */}
      <div
        className={cn(
          'absolute z-50 pointer-events-none whitespace-normal',
          'px-3 py-2 text-sm font-medium',
          'rounded-lg',
          'shadow-xl shadow-black/25 dark:shadow-black/40',
          'transition-all duration-200',
          'opacity-0 scale-95',
          !clicked &&
            'group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100',
          !clicked &&
            'group-focus-within/tooltip:opacity-100 group-focus-within/tooltip:scale-100',
          positionClasses[position],
          variantClasses[variant],
          tooltipClassName,
        )}
        style={{
          maxWidth,
          transitionDelay: `${delay}ms`,
          ...getOffsetStyle(),
        }}
        role="tooltip"
      >
        {content}

        {/* Arrow */}
        <div
          className={cn(
            'absolute w-0 h-0 border-4',
            getArrowClasses(position, variant),
          )}
        />
      </div>
    </div>
  );
};

export default TooltipCatto;
