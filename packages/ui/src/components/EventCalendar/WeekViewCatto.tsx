'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarLabels, DEFAULT_CALENDAR_LABELS } from '../../i18n/defaults';
import { cn } from '../../utils';
import CalendarEventCard from './CalendarEventCard';
import { CalendarEventItem, EventCalendarTheme } from './types';

export interface WeekViewLabels extends CalendarLabels {
  /** Text for "Today" button */
  todayButton?: string;
  /** Text for previous week */
  previousWeek?: string;
  /** Text for next week */
  nextWeek?: string;
  /** All day section label */
  allDay?: string;
}

export const DEFAULT_WEEK_VIEW_LABELS: Required<WeekViewLabels> = {
  ...DEFAULT_CALENDAR_LABELS,
  todayButton: 'Today',
  previousWeek: 'Previous week',
  nextWeek: 'Next week',
  allDay: 'All day',
};

export interface WeekViewCattoProps {
  /** Array of events to display */
  events: CalendarEventItem[];
  /** Start date of the week to display */
  weekStart?: Date;
  /** Callback when an event is clicked */
  onEventClick?: (event: CalendarEventItem) => void;
  /** Callback when an empty slot is clicked */
  onSlotClick?: (date: Date, time: string) => void;
  /** Callback when week changes */
  onWeekChange?: (weekStart: Date) => void;
  /** Starting hour of the day (default: 6) */
  startHour?: number;
  /** Ending hour of the day (default: 22) */
  endHour?: number;
  /** Duration of each slot in minutes (default: 60) */
  slotDuration?: 30 | 60;
  /** Color theme */
  theme?: EventCalendarTheme;
  /** i18n labels */
  labels?: Partial<WeekViewLabels>;
  /** Show today button */
  showTodayButton?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// Theme classes
const themeClasses: Record<EventCalendarTheme, string> = {
  midnightEmber: 'bg-slate-800 text-slate-50 dark:bg-slate-900',
  sunset: 'bg-amber-50 text-amber-900 dark:bg-amber-900 dark:text-amber-100',
  ocean: 'bg-blue-50 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
  forest: 'bg-green-50 text-green-900 dark:bg-green-900 dark:text-green-100',
  lavender: 'bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100',
};

/**
 * Get the start of the week (Sunday) for a given date
 */
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Generate time slots for the day
 */
const generateTimeSlots = (
  startHour: number,
  endHour: number,
  slotDuration: 30 | 60,
): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (slotDuration === 30) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
};

/**
 * Format time to display format (e.g., "9 AM", "2:30 PM")
 */
const formatTimeDisplay = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  if (minutes === 0) {
    return `${displayHours} ${period}`;
  }
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Get events for a specific date and time slot
 */
const getEventsForSlot = (
  events: CalendarEventItem[],
  date: Date,
  slotTime: string,
  slotDuration: number,
): CalendarEventItem[] => {
  const dateStr = date.toDateString();
  const slotStart = parseInt(slotTime.replace(':', ''), 10);
  const slotEnd = slotStart + (slotDuration === 30 ? 30 : 100);

  return events.filter((event) => {
    try {
      const eventDate = new Date(event.startTime);
      if (eventDate.toDateString() !== dateStr) return false;
      if (event.allDay) return false;

      const eventTime = eventDate.getHours() * 100 + eventDate.getMinutes();
      return eventTime >= slotStart && eventTime < slotEnd;
    } catch {
      // Handle HH:mm format
      if (/^\d{2}:\d{2}$/.test(event.startTime)) {
        const eventTime = parseInt(event.startTime.replace(':', ''), 10);
        return eventTime >= slotStart && eventTime < slotEnd;
      }
      return false;
    }
  });
};

/**
 * Get all-day events for a specific date
 */
const getAllDayEvents = (
  events: CalendarEventItem[],
  date: Date,
): CalendarEventItem[] => {
  const dateStr = date.toDateString();
  return events.filter((event) => {
    if (!event.allDay) return false;
    try {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === dateStr;
    } catch {
      return false;
    }
  });
};

/**
 * WeekViewCatto - Weekly schedule grid with time slots
 *
 * Features:
 * - 7-day view with hourly/half-hourly slots
 * - Week navigation
 * - All-day events section
 * - Click handlers for events and empty slots
 */
const WeekViewCatto: React.FC<WeekViewCattoProps> = ({
  events = [],
  weekStart: initialWeekStart,
  onEventClick,
  onSlotClick,
  onWeekChange,
  startHour = 6,
  endHour = 22,
  slotDuration = 60,
  theme = 'midnightEmber',
  labels = {},
  showTodayButton = true,
  className,
}) => {
  const mergedLabels = { ...DEFAULT_WEEK_VIEW_LABELS, ...labels };

  const [weekStart, setWeekStart] = useState(() =>
    getWeekStart(initialWeekStart || new Date()),
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate week days
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  }, [weekStart]);

  // Generate time slots
  const timeSlots = useMemo(
    () => generateTimeSlots(startHour, endHour, slotDuration),
    [startHour, endHour, slotDuration],
  );

  // Navigation
  const navigateWeek = (direction: number) => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + direction * 7);
    setWeekStart(newStart);
    onWeekChange?.(newStart);
  };

  const goToToday = () => {
    const today = getWeekStart(new Date());
    setWeekStart(today);
    onWeekChange?.(today);
  };

  const isToday = (date: Date) => {
    if (!mounted) return false;
    return date.toDateString() === new Date().toDateString();
  };

  // Format week header
  const weekRangeText = useMemo(() => {
    const endOfWeek = new Date(weekStart);
    endOfWeek.setDate(weekStart.getDate() + 6);

    const startMonth = weekStart.toLocaleDateString(mergedLabels.locale, {
      month: 'short',
    });
    const endMonth = endOfWeek.toLocaleDateString(mergedLabels.locale, {
      month: 'short',
    });
    const year = weekStart.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${weekStart.getDate()} - ${endOfWeek.getDate()}, ${year}`;
    }
    return `${startMonth} ${weekStart.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${year}`;
  }, [weekStart, mergedLabels.locale]);

  return (
    <div
      className={cn(
        'w-full',
        themeClasses[theme],
        'rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateWeek(-1)}
            className="p-1 rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-500"
            aria-label={mergedLabels.previousWeek}
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="font-semibold min-w-48 text-center">
            {weekRangeText}
          </h2>
          <button
            type="button"
            onClick={() => navigateWeek(1)}
            className="p-1 rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-500"
            aria-label={mergedLabels.nextWeek}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {showTodayButton && (
          <button
            type="button"
            onClick={goToToday}
            className="px-3 py-1 text-sm rounded border border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30"
          >
            {mergedLabels.todayButton}
          </button>
        )}
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-8 border-b dark:border-gray-700">
        <div className="p-2 text-xs text-gray-500 dark:text-gray-400 border-r dark:border-gray-700" />
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={cn(
              'p-2 text-center border-r last:border-r-0 dark:border-gray-700',
              isToday(day) && 'bg-orange-50 dark:bg-orange-900/20',
            )}
          >
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {day.toLocaleDateString(mergedLabels.locale, {
                weekday: 'short',
              })}
            </div>
            <div
              className={cn(
                'text-lg font-semibold',
                isToday(day) && 'text-orange-500',
              )}
            >
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* All-day events row */}
      <div className="grid grid-cols-8 border-b dark:border-gray-700 min-h-8">
        <div className="p-1 text-xs text-gray-500 dark:text-gray-400 border-r dark:border-gray-700 flex items-center justify-end pr-2">
          {mergedLabels.allDay}
        </div>
        {weekDays.map((day, index) => {
          const allDayEvents = getAllDayEvents(events, day);
          return (
            <div
              key={index}
              className={cn(
                'p-1 border-r last:border-r-0 dark:border-gray-700',
                isToday(day) && 'bg-orange-50/50 dark:bg-orange-900/10',
              )}
            >
              {allDayEvents.map((event) => (
                <CalendarEventCard
                  key={event.id}
                  event={event}
                  variant="compact"
                  showTime={false}
                  onClick={onEventClick}
                  className="mb-0.5"
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="max-h-96 overflow-y-auto">
        {timeSlots.map((time) => (
          <div
            key={time}
            className="grid grid-cols-8 border-b last:border-b-0 dark:border-gray-700"
          >
            {/* Time label */}
            <div className="p-1 text-xs text-gray-500 dark:text-gray-400 border-r dark:border-gray-700 flex items-start justify-end pr-2">
              {formatTimeDisplay(time)}
            </div>

            {/* Day columns */}
            {weekDays.map((day, dayIndex) => {
              const slotEvents = getEventsForSlot(
                events,
                day,
                time,
                slotDuration,
              );

              return (
                <div
                  key={dayIndex}
                  className={cn(
                    'min-h-12 p-0.5 border-r last:border-r-0 dark:border-gray-700',
                    'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50',
                    isToday(day) && 'bg-orange-50/30 dark:bg-orange-900/10',
                  )}
                  onClick={() => onSlotClick?.(day, time)}
                >
                  {slotEvents.map((event) => (
                    <CalendarEventCard
                      key={event.id}
                      event={event}
                      variant="compact"
                      showTime={true}
                      onClick={onEventClick}
                      className="mb-0.5"
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

WeekViewCatto.displayName = 'WeekViewCatto';

export default WeekViewCatto;
