// @catto/ui - BadgeCatto Component
// Status badges, count indicators, and labels
'use client';

import { cn } from '../../utils';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BadgeCattoProps {
  /** Badge content (text or number) */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Makes badge circular (ideal for single digits/icons) */
  rounded?: boolean;
  /** Icon to display before the content */
  leftIcon?: React.ReactNode;
  /** Icon to display after the content */
  rightIcon?: React.ReactNode;
  /** Show as a dot indicator (hides children) */
  dot?: boolean;
  /** Pulsing animation for notifications */
  pulse?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Click handler (makes badge interactive) */
  onClick?: () => void;
  /** Test ID for testing */
  'data-testid'?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  primary: 'bg-theme-primary-subtle text-theme-primary',
  secondary: 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  warning:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  outline:
    'bg-transparent border border-current text-gray-600 dark:text-gray-300',
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'text-xs px-1.5 py-0.5',
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

const dotSizeStyles: Record<BadgeSize, string> = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
};

/**
 * BadgeCatto - Versatile badge component for status indicators, counts, and labels
 *
 * @example
 * // Basic usage
 * <BadgeCatto>New</BadgeCatto>
 *
 * @example
 * // With variant and icon
 * <BadgeCatto variant="success" leftIcon={<Check />}>Completed</BadgeCatto>
 *
 * @example
 * // Count badge
 * <BadgeCatto variant="error" rounded>5</BadgeCatto>
 *
 * @example
 * // Dot indicator with pulse
 * <BadgeCatto variant="success" dot pulse />
 */
export default function BadgeCatto({
  children,
  variant = 'default',
  size = 'sm',
  rounded = false,
  leftIcon,
  rightIcon,
  dot = false,
  pulse = false,
  className,
  onClick,
  'data-testid': testId,
}: BadgeCattoProps) {
  // Dot mode renders just a circular indicator
  if (dot) {
    return (
      <span
        data-testid={testId}
        className={cn(
          'inline-block rounded-full',
          dotSizeStyles[size],
          variantStyles[variant],
          pulse && 'animate-pulse',
          className,
        )}
        aria-hidden="true"
      />
    );
  }

  const isInteractive = !!onClick;
  const Component = isInteractive ? 'button' : 'span';

  return (
    <Component
      data-testid={testId}
      onClick={onClick}
      type={isInteractive ? 'button' : undefined}
      className={cn(
        'inline-flex items-center justify-center gap-1 font-medium',
        rounded ? 'rounded-full' : 'rounded-md',
        variantStyles[variant],
        sizeStyles[size],
        isInteractive &&
          'cursor-pointer transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary',
        pulse && 'animate-pulse',
        className,
      )}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </Component>
  );
}
