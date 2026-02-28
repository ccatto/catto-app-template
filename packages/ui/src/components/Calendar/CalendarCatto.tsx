'use client';

import { forwardRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarLabels, DEFAULT_CALENDAR_LABELS } from '../../i18n/defaults';
import { cn } from '../../utils';

export type CalendarTheme =
  | 'midnightEmber'
  | 'sunset'
  | 'ocean'
  | 'forest'
  | 'lavender';

export type CalendarSize = 'small' | 'medium' | 'large';
export type CalendarVariant = 'outlined' | 'filled' | 'minimal';

export interface CalendarCattoProps {
  /** Selected date */
  value?: Date;
  /** Callback when date changes */
  onChange?: (date: Date) => void;
  /** Size variant */
  size?: CalendarSize;
  /** Color theme */
  theme?: CalendarTheme;
  /** Additional CSS classes */
  className?: string;
  /** Style variant */
  variant?: CalendarVariant;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** i18n labels for internationalization */
  labels?: CalendarLabels;
}

// Theme classes for the calendar
const themeClasses: Record<CalendarTheme, string> = {
  midnightEmber: `
    bg-slate-800 text-slate-50 border-orange-500
    dark:bg-slate-900 dark:text-orange-100 dark:border-orange-400
  `,
  sunset: `
    bg-amber-50 text-amber-900 border-amber-300
    dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700
  `,
  ocean: `
    bg-blue-50 text-blue-900 border-blue-300
    dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700
  `,
  forest: `
    bg-green-50 text-green-900 border-green-300
    dark:bg-green-900 dark:text-green-100 dark:border-green-700
  `,
  lavender: `
    bg-slate-50 text-slate-900 border-slate-300
    dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700
  `,
};

/**
 * Calendar component for date selection
 *
 * @example
 * // English (default)
 * <CalendarCatto value={date} onChange={setDate} />
 *
 * @example
 * // Spanish
 * <CalendarCatto
 *   value={date}
 *   onChange={setDate}
 *   labels={{
 *     locale: 'es-ES',
 *     dayNames: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
 *     previousMonth: 'Mes anterior',
 *     nextMonth: 'Mes siguiente',
 *   }}
 * />
 */
const CalendarCatto = forwardRef<HTMLDivElement, CalendarCattoProps>(
  (
    {
      value = new Date(),
      onChange,
      size = 'medium',
      theme = 'midnightEmber',
      className = '',
      variant = 'outlined',
      minDate,
      maxDate,
      labels = {},
      ...props
    },
    ref,
  ) => {
    // Merge with defaults
    const mergedLabels = { ...DEFAULT_CALENDAR_LABELS, ...labels };

    const [currentDate, setCurrentDate] = useState(value || new Date());
    const [selectedDate, setSelectedDate] = useState(value || new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    const handleDateSelect = (date: Date) => {
      setSelectedDate(date);
      onChange?.(date);
    };

    const navigateMonth = (direction: number) => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + direction);
      setCurrentDate(newDate);
    };

    // Size variations
    const sizeClasses = {
      small: {
        calendar: 'w-64',
        header: 'text-sm py-2',
        dayNames: 'text-xs',
        days: 'text-xs',
        day: 'h-6 w-6',
      },
      medium: {
        calendar: 'w-80',
        header: 'text-base py-3',
        dayNames: 'text-sm',
        days: 'text-sm',
        day: 'h-8 w-8',
      },
      large: {
        calendar: 'w-96',
        header: 'text-lg py-4',
        dayNames: 'text-base',
        days: 'text-base',
        day: 'h-10 w-10',
      },
    };

    // Variant styles
    const variantClasses = {
      outlined: 'border rounded-lg',
      filled: 'border-0 shadow-md rounded-lg',
      minimal: 'border-0',
    };

    // Get days in month
    const getDaysInMonth = (year: number, month: number) => {
      return new Date(year, month + 1, 0).getDate();
    };

    // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
    const getFirstDayOfMonth = (year: number, month: number) => {
      return new Date(year, month, 1).getDay();
    };

    // Generate calendar data
    const generateCalendarDays = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const daysInMonth = getDaysInMonth(year, month);
      const firstDayOfMonth = getFirstDayOfMonth(year, month);

      const days: (Date | null)[] = [];

      // Add empty slots for days before the first day of month
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
      }

      // Add days of current month
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        days.push(date);
      }

      return days;
    };

    const calendarDays = generateCalendarDays();

    // Use locale for month/year formatting
    const currentMonthYear = currentDate.toLocaleDateString(
      mergedLabels.locale,
      {
        month: 'long',
        year: 'numeric',
      },
    );

    const isSelectedDate = (date: Date | null) => {
      if (!date) return false;
      return date.toDateString() === selectedDate.toDateString();
    };

    const isToday = (date: Date | null) => {
      if (!date || !mounted) return false;
      return date.toDateString() === new Date().toDateString();
    };

    const isDisabled = (date: Date | null) => {
      if (!date) return false;
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    };

    const getDayClasses = (date: Date | null) => {
      if (!date) return 'invisible';

      return cn(
        'flex items-center justify-center rounded-full cursor-pointer transition-colors duration-150',
        sizeClasses[size].day,
        isSelectedDate(date) && 'bg-theme-secondary text-theme-on-secondary',
        !isSelectedDate(date) &&
          isToday(date) &&
          'border border-theme-secondary',
        !isSelectedDate(date) &&
          !isToday(date) &&
          isDisabled(date) &&
          'opacity-40 cursor-not-allowed',
        !isSelectedDate(date) &&
          !isToday(date) &&
          !isDisabled(date) &&
          'hover:bg-theme-secondary-subtle',
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          sizeClasses[size].calendar,
          themeClasses[theme],
          variantClasses[variant],
          'transition-all duration-200',
          className,
        )}
        {...props}
      >
        {/* Header with month navigation */}
        <div className="flex items-center justify-between px-4 border-b border-theme-border">
          <button
            onClick={() => navigateMonth(-1)}
            className={cn(
              'text-theme-secondary focus:outline-none',
              sizeClasses[size].header,
            )}
            aria-label={mergedLabels.previousMonth}
          >
            <ChevronLeft
              size={size === 'small' ? 16 : size === 'medium' ? 20 : 24}
            />
          </button>

          <h2 className={cn('font-medium', sizeClasses[size].header)}>
            {currentMonthYear}
          </h2>

          <button
            onClick={() => navigateMonth(1)}
            className={cn(
              'text-theme-secondary focus:outline-none',
              sizeClasses[size].header,
            )}
            aria-label={mergedLabels.nextMonth}
          >
            <ChevronRight
              size={size === 'small' ? 16 : size === 'medium' ? 20 : 24}
            />
          </button>
        </div>

        {/* Day names */}
        <div
          className={cn(
            'grid grid-cols-7 gap-1 py-2 text-center',
            sizeClasses[size].dayNames,
          )}
        >
          {mergedLabels.dayNames.map((day, index) => (
            <div key={index} className="font-medium text-theme-secondary">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div
          className={cn('grid grid-cols-7 gap-1 p-2', sizeClasses[size].days)}
        >
          {calendarDays.map((date, index) => (
            <div
              key={index}
              className={getDayClasses(date)}
              onClick={() =>
                date && !isDisabled(date) && handleDateSelect(date)
              }
              title={isToday(date) ? mergedLabels.today : undefined}
            >
              {date ? date.getDate() : ''}
            </div>
          ))}
        </div>
      </div>
    );
  },
);

CalendarCatto.displayName = 'CalendarCatto';

export default CalendarCatto;
