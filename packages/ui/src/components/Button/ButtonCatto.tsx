// @catto/ui - ButtonCatto Component
'use client';

import { forwardRef, ReactNode, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useHaptics } from '../../hooks/useHaptics';
import type { HapticFeedback, StyleAnimations } from '../../types';
import { cn } from '../../utils';

// ============================================
// Button Variants using CVA

const buttonVariants = cva(
  // Base styles (always applied)
  [
    'inline-flex items-center justify-center gap-3 font-medium',
    'transition-all duration-200',
    'focus:outline-hidden focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:active:scale-100',
    'active:scale-95',
  ],
  {
    variants: {
      variant: {
        // ============================================
        // Primary variants (themed - uses token contract)
        // ============================================
        primary: [
          'rounded-lg',
          'bg-theme-primary text-theme-on-primary',
          'hover:bg-theme-primary-hover active:bg-theme-primary-active',
          'focus:ring-theme-primary',
          'border-2 border-transparent hover:border-theme-primary-subtle',
          'disabled:bg-gray-300 disabled:text-gray-500',
          'dark:disabled:bg-gray-700 dark:disabled:text-gray-500',
        ],
        secondary: [
          'rounded-lg',
          // Neutral gray - intentionally not themed
          'bg-gray-500 text-slate-50',
          'hover:bg-gray-600 active:bg-gray-700',
          'focus:ring-gray-500',
          'dark:bg-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-800',
          'border-2 border-transparent hover:border-gray-400 dark:hover:border-gray-300',
          'disabled:bg-gray-300 disabled:text-gray-500',
          'dark:disabled:bg-gray-700 dark:disabled:text-gray-500',
        ],
        tertiary: [
          'rounded-lg',
          'bg-transparent text-slate-900 dark:text-slate-50',
          'hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600',
          'focus:ring-theme-primary',
          'border-2 border-slate-300 dark:border-slate-700 hover:border-theme-primary-subtle',
          'disabled:text-gray-400 dark:disabled:text-gray-500 disabled:border-transparent',
        ],
        catto: [
          'rounded-lg',
          'bg-theme-primary text-theme-on-primary',
          'hover:bg-theme-primary-hover active:bg-theme-primary-active',
          'focus:ring-theme-primary',
          'border-2 border-transparent hover:border-theme-primary-subtle',
          'disabled:bg-gray-300 disabled:text-gray-500',
          'dark:disabled:bg-gray-700 dark:disabled:text-gray-500',
        ],
        // ============================================
        // Utility variants (minimal styling)
        // ============================================
        ghost: [
          'rounded-lg',
          'hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-theme-secondary',
          'h-8 w-8 p-0',
        ],
        outline: [
          'rounded-lg',
          'border-2 border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-slate-50',
          'hover:border-theme-primary hover:text-theme-primary dark:hover:border-theme-secondary dark:hover:text-theme-secondary',
          'ml-auto',
        ],
        // ============================================
        // Status variants (fixed colors - not themed)
        // ============================================
        danger: [
          'rounded-lg',
          // Fixed red - status color should be consistent across themes
          'bg-red-500 text-slate-50',
          'hover:bg-red-600 active:bg-red-700',
          'focus:ring-red-500 focus:text-slate-950',
          'dark:bg-red-600 dark:hover:bg-red-700 dark:active:bg-red-800',
          'border-2 border-transparent hover:border-red-400 dark:hover:border-red-300',
          'disabled:bg-gray-300 disabled:text-gray-500',
          'dark:disabled:bg-gray-700 dark:disabled:text-gray-500',
        ],
        goGreen: [
          'rounded-lg',
          // Fixed green - status color should be consistent across themes
          'bg-green-400 text-gray-950',
          'hover:bg-green-600 active:bg-green-700',
          'focus:ring-green-500 focus:text-gray-50',
          'dark:bg-green-500 dark:hover:bg-green-700 dark:active:bg-green-800',
          'border-2 border-transparent hover:border-green-400 dark:hover:border-green-300',
          'disabled:bg-gray-300 disabled:text-gray-500',
          'dark:disabled:bg-gray-700 dark:disabled:text-gray-500',
        ],
        // ============================================
        // Brand accent variants (themed secondary)
        // ============================================
        pill: [
          'rounded-full',
          'bg-theme-secondary text-theme-on-secondary',
          'hover:bg-theme-secondary-hover active:bg-theme-secondary-active',
          'focus:ring-theme-secondary',
          'shadow-md hover:shadow-lg',
          'disabled:bg-gray-300 disabled:text-gray-500',
          'dark:disabled:bg-gray-700 dark:disabled:text-gray-500',
        ],
        pillOutline: [
          'rounded-full',
          'bg-slate-100/80 dark:bg-slate-800/80',
          'text-theme-secondary',
          'hover:bg-slate-200 dark:hover:bg-slate-700',
          'border-2 border-theme-secondary-subtle',
          'hover:border-theme-secondary',
          'focus:ring-theme-secondary',
          'backdrop-blur-sm',
          'shadow-sm hover:shadow-md',
          'disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300',
          'dark:disabled:bg-gray-800 dark:disabled:text-gray-500 dark:disabled:border-gray-600',
        ],
        // ============================================
        // Marketing variants (themed gradients)
        // ============================================
        funOrange: [
          'rounded-2xl',
          'bg-gradient-to-r from-[var(--catto-theme-secondary)] to-[var(--catto-theme-secondary-hover)]',
          'hover:from-[var(--catto-theme-secondary-hover)] hover:to-[var(--catto-theme-secondary-active)]',
          'px-16 py-5',
          'font-bold text-xl text-theme-on-secondary',
          'transition-all duration-300',
          'transform hover:scale-105',
          'shadow-2xl hover:shadow-orange-500/25',
        ],
        outlineRoundedXL: [
          'rounded-2xl',
          'border-2 border-slate-500 dark:border-slate-300',
          'text-slate-800 dark:text-slate-50',
          'hover:bg-slate-200/30 dark:hover:bg-slate-50/10',
          'px-16 py-5',
          'font-bold text-xl',
          'transition-all duration-300',
          'transform hover:scale-105',
        ],
        blueGradientXL: [
          'rounded-xl',
          'bg-gradient-to-r from-[var(--catto-theme-primary)] to-[var(--catto-theme-primary-hover)]',
          'hover:from-[var(--catto-theme-primary-hover)] hover:to-[var(--catto-theme-primary-active)]',
          'py-3',
          'font-semibold text-theme-on-primary',
          'transition-all duration-300',
          'transform hover:scale-105',
        ],
      },
      size: {
        small: 'px-3 py-1 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg',
      },
      width: {
        full: 'w-full',
        auto: 'w-auto',
        fit: 'w-fit',
      },
    },
    defaultVariants: {
      variant: 'catto',
      size: 'large',
      width: 'full',
    },
  },
);

// ============================================
// Types
// ============================================
type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonCattoProps extends Omit<ButtonVariants, 'width'> {
  label?: string | React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  /** Width: 'full' | 'auto' | 'fit' or custom Tailwind class */
  width?: 'full' | 'auto' | 'fit' | string;
  animation?: StyleAnimations;
  haptic?: HapticFeedback;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  /** Icon to display before the label/children */
  leftIcon?: ReactNode;
  /** Icon to display after the label/children */
  rightIcon?: ReactNode;
  /** Shows a loading spinner and disables the button */
  isLoading?: boolean;
}

// ============================================
// Component
// ============================================
// Loading spinner component
const LoadingSpinner = () => (
  <svg
    className="h-5 w-5 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const ButtonCatto = forwardRef<HTMLButtonElement, ButtonCattoProps>(
  (
    {
      label,
      children,
      onClick,
      variant = 'catto',
      size = 'large',
      disabled = false,
      width = 'full',
      animation = 'tada',
      haptic = 'light',
      className = '',
      type = 'button',
      leftIcon,
      rightIcon,
      isLoading = false,
    },
    ref,
  ) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const { impact } = useHaptics();

    const handleClick = () => {
      if (disabled || isLoading) return;

      // Trigger haptic feedback on native platforms
      if (haptic !== 'none') {
        impact(haptic);
      }

      if (animation !== 'none') {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
      onClick?.();
    };

    // Button is disabled when explicitly disabled OR when loading
    const isDisabled = disabled || isLoading;

    // Resolve width to class name
    const widthMap: Record<string, string> = {
      full: 'w-full',
      auto: 'w-auto',
      fit: 'w-fit',
    };
    const widthClass = widthMap[width] || width;

    // Get animation class if animating
    // Using explicit mapping instead of template literal so Tailwind can scan these classes
    const animationMap: Record<StyleAnimations, string> = {
      tada: 'animate-tada',
      pulse: 'animate-pulse',
      bounce: 'animate-bounce',
      shake: 'animate-shake',
      none: '',
    };
    const animationClass =
      isAnimating && animation !== 'none' ? animationMap[animation] : '';

    // Build final class string using cn() for proper merging
    const classes = cn(
      buttonVariants({
        variant,
        size,
        // Only apply width from CVA for standard values, custom handled below
        width: ['full', 'auto', 'fit'].includes(width)
          ? (width as 'full' | 'auto' | 'fit')
          : undefined,
      }),
      // Apply custom width class if not a standard value
      !['full', 'auto', 'fit'].includes(width) && widthClass,
      animationClass,
      className,
    );

    return (
      <button
        ref={ref}
        className={classes}
        onClick={handleClick}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        onMouseLeave={(e) => e.currentTarget.blur()}
        onMouseUp={(e) => e.currentTarget.blur()}
        type={type}
      >
        {isLoading && <LoadingSpinner />}
        {!isLoading && leftIcon && (
          <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children || label}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  },
);

ButtonCatto.displayName = 'ButtonCatto';

export default ButtonCatto;

// Export variants for external use (e.g., testing, documentation)
export { buttonVariants };
