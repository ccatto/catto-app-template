'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarLabels, DEFAULT_CALENDAR_LABELS } from '../../i18n/defaults';
import { cn } from '../../utils';
import CalendarEventCard from './CalendarEventCard';
import {
  CalendarEventItem,
  CalendarView,
  EventCalendarSize,
  EventCalendarTheme,
} from './types';

export interface EventCalendarLabels extends CalendarLabels {
  /** Text for "Today" button (default: "Today") */
  todayButton?: string;
  /** Text shown when no events (default: "No events") */
  noEvents?: string;
  /** Text for showing more events (default: "+{count} more") */
  moreEvents?: string;
  /** View labels */
  month?: string;
  week?: string;
  day?: string;
}

export const DEFAULT_EVENT_CALENDAR_LABELS: Required<EventCalendarLabels> = {
  ...DEFAULT_CALENDAR_LABELS,
  todayButton: 'Today',
  noEvents: 'No events',
  moreEvents: '+{count} more',
  month: 'Month',
  week: 'Week',
  day: 'Day',
};

export interface EventCalendarCattoProps {
  /** Array of events to display */
  events: CalendarEventItem[];
  /** Current view mode */
  view?: CalendarView;
  /** Currently selected/displayed date */
  selectedDate?: Date;
  /** Callback when a date is selected */
  onDateSelect?: (date: Date) => void;
  /** Callback when an event is clicked */
  onEventClick?: (event: CalendarEventItem) => void;
  /** Callback when hovering over an event */
  onEventHover?: (event: CalendarEventItem | null) => void;
  /** Callback when view changes */
  onViewChange?: (view: CalendarView) => void;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Color theme */
  theme?: EventCalendarTheme;
  /** Size variant */
  size?: EventCalendarSize;
  /** i18n labels */
  labels?: Partial<EventCalendarLabels>;
  /** Custom event tooltip renderer */
  renderEventTooltip?: (event: CalendarEventItem) => React.ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Show view switcher buttons */
  showViewSwitcher?: boolean;
  /** Show today button */
  showTodayButton?: boolean;
  /** Maximum events to show per day before "+N more" */
  maxEventsPerDay?: number;
  /** Additional CSS classes */
  className?: string;
}

// Theme classes matching CalendarCatto
const themeClasses: Record<EventCalendarTheme, string> = {
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
 * Get events for a specific date
 */
const getEventsForDate = (
  events: CalendarEventItem[],
  date: Date,
): CalendarEventItem[] => {
  const dateStr = date.toDateString();
  return events.filter((event) => {
    try {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === dateStr;
    } catch {
      return false;
    }
  });
};

/**
 * EventCalendarCatto - Full calendar view with event display
 *
 * Features:
 * - Month view with event dots/cards
 * - Navigation between months
 * - Event click handling
 * - Customizable themes
 * - i18n support
 */
const EventCalendarCatto: React.FC<EventCalendarCattoProps> = ({
  events = [],
  view = 'month',
  selectedDate: initialSelectedDate,
  onDateSelect,
  onEventClick,
  onEventHover,
  onViewChange,
  minDate,
  maxDate,
  theme = 'midnightEmber',
  size = 'medium',
  labels = {},
  loading = false,
  showViewSwitcher = false,
  showTodayButton = true,
  maxEventsPerDay = 3,
  className,
}) => {
  const mergedLabels = { ...DEFAULT_EVENT_CALENDAR_LABELS, ...labels };

  const [currentDate, setCurrentDate] = useState(
    initialSelectedDate || new Date(),
  );
  const [selectedDate, setSelectedDate] = useState(
    initialSelectedDate || new Date(),
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Size classes
  const sizeClasses = {
    small: {
      container: 'max-w-md',
      header: 'text-sm py-2 px-3',
      dayHeader: 'text-xs py-1',
      day: 'min-h-16 p-1',
      dayNumber: 'text-xs',
      event: 'text-xs',
    },
    medium: {
      container: 'max-w-2xl',
      header: 'text-base py-3 px-4',
      dayHeader: 'text-sm py-2',
      day: 'min-h-24 p-1.5',
      dayNumber: 'text-sm',
      event: 'text-xs',
    },
    large: {
      container: 'max-w-4xl',
      header: 'text-lg py-4 px-6',
      dayHeader: 'text-base py-2',
      day: 'min-h-32 p-2',
      dayNumber: 'text-base',
      event: 'text-sm',
    },
  };

  // Navigation
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    onDateSelect?.(today);
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  // Generate calendar days
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [currentDate]);

  // Format month/year header
  const currentMonthYear = currentDate.toLocaleDateString(mergedLabels.locale, {
    month: 'long',
    year: 'numeric',
  });

  const isToday = (date: Date | null) => {
    if (!date || !mounted) return false;
    return date.toDateString() === new Date().toDateString();
  };

  const isSelected = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isDisabled = (date: Date | null) => {
    if (!date) return false;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  // Render a single day cell
  const renderDayCell = (date: Date | null, index: number) => {
    if (!date) {
      return (
        <div
          key={`empty-${index}`}
          className="bg-gray-50/50 dark:bg-gray-800/30"
        />
      );
    }

    const dayEvents = getEventsForDate(events, date);
    const visibleEvents = dayEvents.slice(0, maxEventsPerDay);
    const moreCount = dayEvents.length - maxEventsPerDay;

    return (
      <div
        key={date.toISOString()}
        className={cn(
          sizeClasses[size].day,
          'border-r border-b border-gray-200 dark:border-gray-700',
          'cursor-pointer transition-colors',
          isSelected(date) && 'bg-orange-50 dark:bg-orange-900/20',
          !isSelected(date) && 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
          isDisabled(date) && 'opacity-50 cursor-not-allowed',
        )}
        onClick={() => !isDisabled(date) && handleDateSelect(date)}
      >
        {/* Day number */}
        <div
          className={cn(
            sizeClasses[size].dayNumber,
            'font-medium mb-1',
            isToday(date) &&
              'bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center',
            !isToday(date) && 'text-gray-700 dark:text-gray-300',
          )}
        >
          {date.getDate()}
        </div>

        {/* Events */}
        <div className="space-y-0.5">
          {visibleEvents.map((event) => (
            <CalendarEventCard
              key={event.id}
              event={event}
              variant="compact"
              showTime={false}
              showIcon={false}
              onClick={onEventClick}
              onHover={onEventHover}
              className={sizeClasses[size].event}
            />
          ))}
          {moreCount > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
              {mergedLabels.moreEvents.replace('{count}', String(moreCount))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className={cn(
          sizeClasses[size].container,
          'w-full',
          themeClasses[theme],
          'rounded-lg border',
          'animate-pulse',
          className,
        )}
      >
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        sizeClasses[size].container,
        'w-full',
        themeClasses[theme],
        'rounded-lg border overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between border-b dark:border-gray-700',
          sizeClasses[size].header,
        )}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateMonth(-1)}
            className="p-1 rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-500"
            aria-label={mergedLabels.previousMonth}
          >
            <ChevronLeft
              size={size === 'small' ? 16 : size === 'medium' ? 20 : 24}
            />
          </button>
          <h2 className="font-semibold min-w-32 text-center">
            {currentMonthYear}
          </h2>
          <button
            type="button"
            onClick={() => navigateMonth(1)}
            className="p-1 rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-500"
            aria-label={mergedLabels.nextMonth}
          >
            <ChevronRight
              size={size === 'small' ? 16 : size === 'medium' ? 20 : 24}
            />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {showTodayButton && (
            <button
              type="button"
              onClick={goToToday}
              className="px-3 py-1 text-sm rounded border border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30"
            >
              {mergedLabels.todayButton}
            </button>
          )}

          {showViewSwitcher && (
            <div className="flex border rounded overflow-hidden">
              {(['month', 'week', 'day'] as CalendarView[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => onViewChange?.(v)}
                  className={cn(
                    'px-3 py-1 text-sm capitalize',
                    view === v
                      ? 'bg-orange-500 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800',
                  )}
                >
                  {mergedLabels[v]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b dark:border-gray-700">
        {mergedLabels.dayNames.map((day, index) => (
          <div
            key={index}
            className={cn(
              sizeClasses[size].dayHeader,
              'text-center font-medium text-orange-500 dark:text-orange-400',
              'border-r last:border-r-0 dark:border-gray-700',
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarData.map((date, index) => renderDayCell(date, index))}
      </div>
    </div>
  );
};

EventCalendarCatto.displayName = 'EventCalendarCatto';

export default EventCalendarCatto;
