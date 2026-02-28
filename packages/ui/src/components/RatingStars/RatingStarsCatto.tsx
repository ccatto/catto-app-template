// @catto/ui - RatingStarsCatto Component
// Star rating display and input
'use client';

import { forwardRef, useState } from 'react';
import { cn } from '../../utils';

export type RatingStarsSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface RatingStarsCattoProps {
  /** Current rating value (0-5, supports decimals for display) */
  value: number;
  /** Maximum rating (default 5) */
  max?: number;
  /** Size of the stars */
  size?: RatingStarsSize;
  /** Whether rating can be changed by clicking */
  interactive?: boolean;
  /** Called when rating changes (only if interactive) */
  onChange?: (value: number) => void;
  /** Show the numeric value next to stars */
  showValue?: boolean;
  /** Show count (e.g., number of reviews) */
  count?: number;
  /** Color of filled stars */
  color?: 'yellow' | 'orange' | 'gold';
  /** Color of empty stars */
  emptyColor?: string;
  /** Allow half-star precision on click */
  precision?: 'full' | 'half';
  /** Disable interaction */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing */
  'data-testid'?: string;
}

const sizeStyles: Record<RatingStarsSize, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

const textSizeStyles: Record<RatingStarsSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const colorStyles: Record<string, string> = {
  yellow: 'text-yellow-400',
  orange: 'text-orange-400',
  gold: 'text-amber-400',
};

/**
 * RatingStarsCatto - Star rating display and input
 *
 * @example
 * // Display only
 * <RatingStarsCatto value={4.5} />
 *
 * @example
 * // With review count
 * <RatingStarsCatto value={4.2} count={128} showValue />
 *
 * @example
 * // Interactive rating input
 * <RatingStarsCatto value={rating} onChange={setRating} interactive />
 *
 * @example
 * // Half-star precision
 * <RatingStarsCatto value={rating} onChange={setRating} interactive precision="half" />
 */
const RatingStarsCatto = forwardRef<HTMLDivElement, RatingStarsCattoProps>(
  (
    {
      value,
      max = 5,
      size = 'md',
      interactive = false,
      onChange,
      showValue = false,
      count,
      color = 'yellow',
      emptyColor = 'text-gray-300 dark:text-gray-600',
      precision = 'full',
      disabled = false,
      className,
      'data-testid': testId,
    },
    ref,
  ) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const displayValue = hoverValue !== null ? hoverValue : value;
    const isInteractive = interactive && !disabled && onChange;

    const handleClick = (starIndex: number, isHalf: boolean) => {
      if (!isInteractive) return;

      const newValue =
        precision === 'half' && isHalf ? starIndex + 0.5 : starIndex + 1;
      onChange(newValue);
    };

    const handleMouseMove = (
      starIndex: number,
      e: React.MouseEvent<HTMLButtonElement>,
    ) => {
      if (!isInteractive) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const isHalf =
        precision === 'half' && e.clientX < rect.left + rect.width / 2;
      setHoverValue(isHalf ? starIndex + 0.5 : starIndex + 1);
    };

    const handleMouseLeave = () => {
      if (isInteractive) {
        setHoverValue(null);
      }
    };

    const renderStar = (index: number) => {
      const starValue = index + 1;
      const fillPercentage = Math.min(
        100,
        Math.max(0, (displayValue - index) * 100),
      );
      const isFilled = fillPercentage >= 100;
      const isPartial = fillPercentage > 0 && fillPercentage < 100;

      const starContent = (
        <span className="relative inline-block">
          {/* Empty star background */}
          <svg
            className={cn(sizeStyles[size], emptyColor)}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>

          {/* Filled star overlay */}
          {(isFilled || isPartial) && (
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <svg
                className={cn(sizeStyles[size], colorStyles[color])}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          )}
        </span>
      );

      if (isInteractive) {
        return (
          <button
            key={index}
            type="button"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const isHalf =
                precision === 'half' && e.clientX < rect.left + rect.width / 2;
              handleClick(index, isHalf);
            }}
            onMouseMove={(e) => handleMouseMove(index, e)}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            aria-label={`Rate ${starValue} out of ${max}`}
            className={cn(
              'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 rounded',
              'transition-transform hover:scale-110',
              disabled && 'cursor-not-allowed',
            )}
          >
            {starContent}
          </button>
        );
      }

      return <span key={index}>{starContent}</span>;
    };

    return (
      <div
        ref={ref}
        data-testid={testId}
        className={cn('inline-flex items-center gap-1', className)}
        role={isInteractive ? 'radiogroup' : 'img'}
        aria-label={`Rating: ${value} out of ${max} stars`}
      >
        <div className="flex">
          {Array.from({ length: max }, (_, i) => renderStar(i))}
        </div>

        {showValue && (
          <span
            className={cn(
              'font-medium text-gray-700 dark:text-gray-300',
              textSizeStyles[size],
            )}
          >
            {value.toFixed(1)}
          </span>
        )}

        {count !== undefined && (
          <span
            className={cn(
              'text-gray-500 dark:text-gray-400',
              textSizeStyles[size],
            )}
          >
            ({count})
          </span>
        )}
      </div>
    );
  },
);

RatingStarsCatto.displayName = 'RatingStarsCatto';

export default RatingStarsCatto;
