// @catto/ui - QuantitySelectorCatto Component
// Quantity input with increment/decrement buttons
'use client';

import { forwardRef } from 'react';
import { cn } from '../../utils';

export type QuantitySelectorSize = 'sm' | 'md' | 'lg';
export type QuantitySelectorVariant = 'default' | 'outline' | 'filled';

export interface QuantitySelectorCattoProps {
  /** Current quantity value */
  value: number;
  /** Called when quantity changes */
  onChange: (value: number) => void;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step increment/decrement amount */
  step?: number;
  /** Size variant */
  size?: QuantitySelectorSize;
  /** Visual variant */
  variant?: QuantitySelectorVariant;
  /** Disable the selector */
  disabled?: boolean;
  /** Show the input field (vs just buttons with count) */
  showInput?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Aria label for accessibility */
  'aria-label'?: string;
  /** Test ID for testing */
  'data-testid'?: string;
}

const sizeStyles: Record<
  QuantitySelectorSize,
  { button: string; input: string; icon: string }
> = {
  sm: {
    button: 'h-7 w-7',
    input: 'h-7 w-10 text-sm',
    icon: 'h-3 w-3',
  },
  md: {
    button: 'h-9 w-9',
    input: 'h-9 w-14 text-base',
    icon: 'h-4 w-4',
  },
  lg: {
    button: 'h-11 w-11',
    input: 'h-11 w-16 text-lg',
    icon: 'h-5 w-5',
  },
};

const variantStyles: Record<
  QuantitySelectorVariant,
  { container: string; button: string; input: string }
> = {
  default: {
    container: 'bg-gray-100 dark:bg-gray-800',
    button:
      'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700',
    input: 'bg-transparent text-gray-900 dark:text-white',
  },
  outline: {
    container: 'border border-gray-300 dark:border-gray-600 bg-transparent',
    button:
      'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
    input: 'bg-transparent text-gray-900 dark:text-white',
  },
  filled: {
    container: 'bg-gray-200 dark:bg-gray-700',
    button:
      'text-gray-800 hover:bg-gray-300 dark:text-gray-200 dark:hover:bg-gray-600',
    input: 'bg-transparent text-gray-900 dark:text-white',
  },
};

/**
 * QuantitySelectorCatto - Quantity input with +/- buttons
 *
 * @example
 * // Basic usage
 * <QuantitySelectorCatto value={1} onChange={setQuantity} />
 *
 * @example
 * // With min/max limits
 * <QuantitySelectorCatto value={qty} onChange={setQty} min={1} max={10} />
 *
 * @example
 * // Large size with input field
 * <QuantitySelectorCatto value={qty} onChange={setQty} size="lg" showInput />
 */
const QuantitySelectorCatto = forwardRef<
  HTMLDivElement,
  QuantitySelectorCattoProps
>(
  (
    {
      value,
      onChange,
      min = 0,
      max = 99,
      step = 1,
      size = 'md',
      variant = 'default',
      disabled = false,
      showInput = false,
      className,
      'aria-label': ariaLabel = 'Quantity',
      'data-testid': testId,
    },
    ref,
  ) => {
    const canDecrement = value > min;
    const canIncrement = value < max;

    const handleDecrement = () => {
      if (canDecrement && !disabled) {
        onChange(Math.max(min, value - step));
      }
    };

    const handleIncrement = () => {
      if (canIncrement && !disabled) {
        onChange(Math.min(max, value + step));
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10);
      if (!isNaN(newValue)) {
        onChange(Math.min(max, Math.max(min, newValue)));
      }
    };

    const styles = sizeStyles[size];
    const variantStyle = variantStyles[variant];

    return (
      <div
        ref={ref}
        data-testid={testId}
        className={cn(
          'inline-flex items-center rounded-lg',
          variantStyle.container,
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        role="group"
        aria-label={ariaLabel}
      >
        {/* Decrement Button */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || !canDecrement}
          aria-label="Decrease quantity"
          className={cn(
            'flex items-center justify-center rounded-l-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            styles.button,
            variantStyle.button,
          )}
        >
          <svg
            className={styles.icon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>

        {/* Value Display / Input */}
        {showInput ? (
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            aria-label={`${ariaLabel} value`}
            className={cn(
              'text-center font-medium border-x border-gray-200 dark:border-gray-600',
              'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500',
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              styles.input,
              variantStyle.input,
            )}
          />
        ) : (
          <span
            className={cn(
              'flex items-center justify-center font-medium border-x border-gray-200 dark:border-gray-600',
              styles.input,
              variantStyle.input,
            )}
            aria-live="polite"
          >
            {value}
          </span>
        )}

        {/* Increment Button */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || !canIncrement}
          aria-label="Increase quantity"
          className={cn(
            'flex items-center justify-center rounded-r-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            styles.button,
            variantStyle.button,
          )}
        >
          <svg
            className={styles.icon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    );
  },
);

QuantitySelectorCatto.displayName = 'QuantitySelectorCatto';

export default QuantitySelectorCatto;
