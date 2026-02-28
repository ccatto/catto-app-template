// @catto/ui - ViewToggleCatto Component
'use client';

import { ReactNode } from 'react';
import { cn } from '../../utils';

// ============================================
// Types
// ============================================

export interface ViewToggleOption<T extends string = string> {
  /** Unique value for this option */
  value: T;
  /** Display label for the option */
  label: string;
  /** Optional icon to display before the label */
  icon?: ReactNode;
}

export interface ViewToggleCattoProps<T extends string = string> {
  /** Array of toggle options (typically 2-3 options) */
  options: ViewToggleOption<T>[];
  /** Currently selected value */
  value: T;
  /** Callback when selection changes */
  onChange: (value: T) => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Visual variant */
  variant?: 'default' | 'pill' | 'minimal';
  /** Full width toggle */
  fullWidth?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Accessible label for the toggle group */
  ariaLabel?: string;
  /** Disable all options */
  disabled?: boolean;
}

// ============================================
// Component
// ============================================

export function ViewToggleCatto<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  className,
  ariaLabel = 'View toggle',
  disabled = false,
}: ViewToggleCattoProps<T>) {
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  // Variant classes for the container
  const containerVariantClasses = {
    default: 'bg-gray-200 dark:bg-gray-700 rounded-lg p-1',
    pill: 'bg-gray-200 dark:bg-gray-700 rounded-full p-1',
    minimal: 'border border-gray-300 dark:border-gray-600 rounded-lg p-0.5',
  };

  // Variant classes for active button
  const activeVariantClasses = {
    default:
      'bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm',
    pill: 'bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm',
    minimal: 'bg-orange-500 dark:bg-orange-600 text-slate-50',
  };

  // Variant classes for inactive button
  const inactiveVariantClasses = {
    default:
      'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
    pill: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
    minimal:
      'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
  };

  // Border radius for buttons based on variant
  const buttonRadiusClasses = {
    default: 'rounded-md',
    pill: 'rounded-full',
    minimal: 'rounded-md',
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center gap-0.5',
        containerVariantClasses[variant],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={disabled}
            onClick={() => {
              if (!disabled && !isActive) {
                onChange(option.value);
              }
            }}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-200',
              sizeClasses[size],
              buttonRadiusClasses[variant],
              fullWidth && 'flex-1',
              isActive
                ? activeVariantClasses[variant]
                : inactiveVariantClasses[variant],
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            {option.icon && (
              <span className="inline-flex shrink-0">{option.icon}</span>
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default ViewToggleCatto;
