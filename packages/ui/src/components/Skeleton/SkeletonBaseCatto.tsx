// Base skeleton component with shimmer animation for loading states

'use client';

import { cn } from '../../utils';

export interface SkeletonBaseCattoProps {
  /** Width of skeleton: preset string or number in pixels */
  width?: 'full' | '3/4' | '1/2' | '1/4' | number;
  /** Height of skeleton: preset string or number in pixels */
  height?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Enable/disable shimmer animation */
  animate?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const SkeletonBaseCatto = ({
  width = 'full',
  height = 'md',
  rounded = 'md',
  animate = true,
  className = '',
}: SkeletonBaseCattoProps) => {
  // Height presets
  const heightMap: Record<string, string> = {
    xs: 'h-2',
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-6',
    xl: 'h-8',
  };

  // Width presets
  const widthMap: Record<string, string> = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/4': 'w-1/4',
  };

  // Rounded presets
  const roundedMap: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  // Determine height class or inline style
  const heightClass =
    typeof height === 'string' ? heightMap[height] || heightMap.md : '';
  const heightStyle =
    typeof height === 'number' ? { height: `${height}px` } : {};

  // Determine width class or inline style
  const widthClass =
    typeof width === 'string' ? widthMap[width] || widthMap.full : '';
  const widthStyle = typeof width === 'number' ? { width: `${width}px` } : {};

  return (
    <div
      className={cn(
        // Base skeleton appearance
        'bg-gray-200 dark:bg-gray-700',
        // Shimmer effect (gradient that moves)
        animate && [
          'bg-gradient-to-r',
          'from-gray-200 via-gray-100 to-gray-200',
          'dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
          'bg-[length:200%_100%]',
          'animate-shimmer',
        ],
        // Size classes
        heightClass,
        widthClass,
        // Border radius
        roundedMap[rounded] || roundedMap.md,
        className,
      )}
      style={{ ...heightStyle, ...widthStyle }}
      aria-hidden="true"
      role="presentation"
    />
  );
};

export default SkeletonBaseCatto;
