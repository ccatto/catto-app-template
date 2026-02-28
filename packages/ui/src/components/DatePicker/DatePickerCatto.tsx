// @catto/ui - DatePickerCatto Component
'use client';

import React, { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { Calendar, X } from 'lucide-react';
import {
  DEFAULT_DATE_PICKER_LABELS,
  type DatePickerLabels,
} from '../../i18n/defaults';
import { cn } from '../../utils';
import CalendarCatto, { type CalendarTheme } from '../Calendar/CalendarCatto';

export type DatePickerSize = 'small' | 'medium' | 'large';
export type DatePickerVariant = 'outlined' | 'filled' | 'minimal';
export type DatePickerWidth =
  | 'auto'
  | 'full'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

export interface DatePickerCattoProps {
  /** Selected date value */
  value?: Date | null;
  /** Callback when date changes */
  onChange?: (date: Date | null) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Label text displayed above the input */
  label?: string;
  /** Error message or boolean for error state */
  error?: string | boolean;
  /** Helper text below the input */
  helperText?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is required */
  required?: boolean;
  /** Size variant */
  size?: DatePickerSize;
  /** Visual variant */
  variant?: DatePickerVariant;
  /** Width setting */
  width?: DatePickerWidth;
  /** Calendar theme (passed to CalendarCatto) */
  calendarTheme?: CalendarTheme;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Date format for display - uses locale-aware formatting by default */
  dateFormat?: Intl.DateTimeFormatOptions;
  /** Whether to show clear button (default: true) */
  clearable?: boolean;
  /** i18n labels */
  labels?: DatePickerLabels;
  /** Additional CSS classes */
  className?: string;
  /** ID for the input element */
  id?: string;
  /** Name attribute for form submission */
  name?: string;
  /** onBlur handler for React Hook Form */
  onBlur?: () => void;
}

/**
 * DatePickerCatto - A date input with calendar popup
 *
 * Combines an input field with CalendarCatto for a complete date selection experience.
 * Supports min/max date constraints, i18n labels, error states, and React Hook Form.
 *
 * @example
 * ```tsx
 * <DatePickerCatto
 *   label="Start Date"
 *   value={date}
 *   onChange={setDate}
 *   minDate={new Date()}
 *   required
 * />
 * ```
 */
const DatePickerCatto = forwardRef<HTMLDivElement, DatePickerCattoProps>(
  (
    {
      value,
      onChange,
      placeholder,
      label,
      error,
      helperText,
      disabled = false,
      required = false,
      size = 'medium',
      variant = 'outlined',
      width = 'full',
      calendarTheme = 'midnightEmber',
      minDate,
      maxDate,
      dateFormat,
      clearable = true,
      labels,
      className = '',
      id: providedId,
      name,
      onBlur,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const generatedId = useId();
    const inputId = providedId || generatedId;

    // Merge provided labels with defaults
    const resolvedLabels = {
      ...DEFAULT_DATE_PICKER_LABELS,
      ...labels,
    };

    const resolvedPlaceholder = placeholder ?? resolvedLabels.placeholder;

    // Format date for display
    const formatDate = (date: Date | null | undefined): string => {
      if (!date) return '';

      const defaultFormat: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };

      try {
        return date.toLocaleDateString(undefined, dateFormat || defaultFormat);
      } catch {
        return date.toLocaleDateString();
      }
    };

    // Handle click outside to close popup
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle escape key to close popup
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          setIsOpen(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    // Handle date selection from calendar
    const handleDateSelect = (date: Date) => {
      onChange?.(date);
      setIsOpen(false);
    };

    // Handle clear button click
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(null);
    };

    // Toggle calendar open/closed
    const toggleCalendar = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    // Handle keyboard events on the input container
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleCalendar();
      }
    };

    // Size classes
    const sizeClasses = {
      small: 'h-8 px-2 text-sm',
      medium: 'h-10 px-3 text-base',
      large: 'h-12 px-4 text-lg',
    };

    const iconSizeClasses = {
      small: 'h-3.5 w-3.5',
      medium: 'h-4 w-4',
      large: 'h-5 w-5',
    };

    const calendarSizeMap = {
      small: 'small' as const,
      medium: 'medium' as const,
      large: 'large' as const,
    };

    // Width classes
    const widthClasses = {
      auto: 'w-auto',
      full: 'w-full',
      xs: 'w-20',
      sm: 'w-32',
      md: 'w-48',
      lg: 'w-64',
      xl: 'w-full md:w-96',
    };

    // Error state
    const hasError = Boolean(error);

    // Variant styles with focus states - explicit Tailwind colors
    const getVariantClasses = () => {
      const focusBorder = hasError
        ? 'border-red-500 dark:border-red-400'
        : 'border-theme-secondary';

      const baseBorder = hasError
        ? 'border-red-500 dark:border-red-400'
        : 'border-theme-border';

      switch (variant) {
        case 'outlined':
          return cn(
            'border bg-theme-surface text-theme-text',
            isOpen ? focusBorder : baseBorder,
          );
        case 'filled':
          return cn(
            'border-0 border-b-2 bg-theme-surface-secondary text-theme-text',
            isOpen ? focusBorder : baseBorder,
          );
        case 'minimal':
          return cn(
            'border-0 border-b bg-transparent text-theme-text',
            isOpen ? focusBorder : baseBorder,
          );
        default:
          return '';
      }
    };

    // Focus ring and glow effect
    const focusClasses =
      isOpen && !disabled
        ? hasError
          ? 'ring-4 ring-red-500/20 dark:ring-red-400/20 shadow-lg shadow-red-500/10'
          : 'ring-4 ring-theme-secondary shadow-lg shadow-theme-secondary'
        : '';

    // Label classes
    const labelClasses = 'block text-sm font-medium text-theme-text-muted mb-1';

    return (
      <div ref={ref} className={cn('relative', widthClasses[width], className)}>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
            {required && (
              <span className="ml-1 text-red-500 dark:text-red-400">*</span>
            )}
          </label>
        )}

        {/* Input container */}
        <div
          ref={containerRef}
          className={cn(
            'relative flex items-center cursor-pointer rounded-md',
            'transition-all duration-200',
            sizeClasses[size],
            getVariantClasses(),
            focusClasses,
            disabled && 'opacity-50 cursor-not-allowed',
            'hover:border-theme-border-strong',
          )}
          onClick={toggleCalendar}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-controls={`${inputId}-calendar`}
          aria-label={label || resolvedPlaceholder}
          tabIndex={disabled ? -1 : 0}
        >
          {/* Hidden input for form submission */}
          <input
            type="hidden"
            id={inputId}
            name={name}
            value={value ? value.toISOString() : ''}
            aria-invalid={hasError ? 'true' : undefined}
            aria-describedby={
              error && typeof error === 'string'
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
          />

          {/* Display value or placeholder */}
          <span
            className={cn(
              'flex-1 truncate select-none',
              !value && 'text-theme-text-muted',
            )}
          >
            {value ? formatDate(value) : resolvedPlaceholder}
          </span>

          {/* Clear button */}
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                'p-1 rounded-full hover:bg-theme-surface-secondary',
                'text-theme-text-muted hover:text-theme-text',
                'transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-theme-secondary',
              )}
              aria-label={resolvedLabels.clearButton}
            >
              <X className={iconSizeClasses[size]} />
            </button>
          )}

          {/* Calendar icon button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleCalendar();
            }}
            className={cn(
              'p-1 ml-1 rounded-full',
              'text-theme-text-muted hover:text-theme-text',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-theme-secondary',
            )}
            aria-label={resolvedLabels.calendarButton}
            disabled={disabled}
          >
            <Calendar className={iconSizeClasses[size]} />
          </button>

          {/* Calendar popup */}
          {isOpen && (
            <div
              id={`${inputId}-calendar`}
              role="dialog"
              aria-modal="true"
              aria-label="Choose date"
              className={cn(
                'absolute z-50 mt-1 top-full left-0',
                'shadow-xl rounded-lg',
                // Ensure calendar is visible on mobile
                'max-sm:fixed max-sm:left-2 max-sm:right-2 max-sm:w-auto',
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <CalendarCatto
                value={value || new Date()}
                onChange={handleDateSelect}
                size={calendarSizeMap[size]}
                theme={calendarTheme}
                variant="outlined"
                minDate={minDate}
                maxDate={maxDate}
              />
            </div>
          )}
        </div>

        {/* Error message */}
        {error && typeof error === 'string' && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper text (only shown when no error message) */}
        {helperText && !(error && typeof error === 'string') && (
          <p
            id={`${inputId}-helper`}
            className="mt-1 text-sm text-theme-text-muted"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

DatePickerCatto.displayName = 'DatePickerCatto';

export default DatePickerCatto;
