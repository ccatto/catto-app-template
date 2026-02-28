'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarLabels, DEFAULT_CALENDAR_LABELS } from '../../i18n/defaults';
import { cn } from '../../utils';
import CalendarEventCard from './CalendarEventCard';
import { CalendarEventItem, EventCalendarTheme } from './types';

export interface DayViewLabels extends CalendarLabels {
  /** Text for "Today" button */
  todayButton?: string;
  /** Text for previous day */
  previousDay?: string;
  /** Text for next day */
  nextDay?: string;
  /** All day section label */
  allDay?: string;
  /** No events message */
  noEvents?: string;
}

export const DEFAULT_DAY_VIEW_LABELS: Required<DayViewLabels> = {
  ...DEFAULT_CALENDAR_LABELS,
  todayButton: 'Today',
  previousDay: 'Previous day',
  nextDay: 'Next day',
  allDay: 'All day',
  noEvents: 'No events scheduled',
};

export interface DayViewCattoProps {
  /** Array of events to display */
  events: CalendarEventItem[];
  /** Date to display */
  date?: Date;
  /** Callback when an event is clicked */
  onEventClick?: (event: CalendarEventItem) => void;
  /** Callback when an empty slot is clicked */
  onSlotClick?: (time: string) => void;
  /** Callback when date changes */
  onDateChange?: (date: Date) => void;
  /** Starting hour of the day (default: 6) */
  startHour?: number;
  /** Ending hour of the day (default: 22) */
  endHour?: number;
  /** Duration of each slot in minutes (default: 60) */
  slotDuration?: 30 | 60;
  /** Color theme */
  theme?: EventCalendarTheme;
  /** i18n labels */
  labels?: Partial<DayViewLabels>;
  /** Show navigation buttons */
  showNavigation?: boolean;
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
 * Format time to display format
 */
const formatTimeDisplay = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  if (minutes === 0) {
    return `${displayHours}:00 ${period}`;
  }
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Get events for a specific time slot
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
    if (event.allDay) return false;

    try {
      const eventDate = new Date(event.startTime);
      if (eventDate.toDateString() !== dateStr) return false;

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
 * Get all-day events
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
 * DayViewCatto - Single day schedule view with time slots
 *
 * Features:
 * - Hourly/half-hourly time slots
 * - Day navigation
 * - All-day events section
 * - Expanded event cards with full details
 */
const DayViewCatto: React.FC<DayViewCattoProps> = ({
  events = [],
  date: initialDate,
  onEventClick,
  onSlotClick,
  onDateChange,
  startHour = 6,
  endHour = 22,
  slotDuration = 60,
  theme = 'midnightEmber',
  labels = {},
  showNavigation = true,
  showTodayButton = true,
  className,
}) => {
  const mergedLabels = { ...DEFAULT_DAY_VIEW_LABELS, ...labels };

  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate time slots
  const timeSlots = useMemo(
    () => generateTimeSlots(startHour, endHour, slotDuration),
    [startHour, endHour, slotDuration],
  );

  // Get events for this date
  const dateEvents = useMemo(() => {
    const dateStr = currentDate.toDateString();
    return events.filter((event) => {
      try {
        const eventDate = new Date(event.startTime);
        return eventDate.toDateString() === dateStr;
      } catch {
        return false;
      }
    });
  }, [events, currentDate]);

  const allDayEvents = getAllDayEvents(events, currentDate);

  // Navigation
  const navigateDay = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateChange?.(today);
  };

  const isToday = () => {
    if (!mounted) return false;
    return currentDate.toDateString() === new Date().toDateString();
  };

  // Format date header
  const dateHeaderText = currentDate.toLocaleDateString(mergedLabels.locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={cn(
        'w-full max-w-2xl',
        themeClasses[theme],
        'rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          {showNavigation && (
            <button
              type="button"
              onClick={() => navigateDay(-1)}
              className="p-1 rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-500"
              aria-label={mergedLabels.previousDay}
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <h2 className="font-semibold text-lg">{dateHeaderText}</h2>
          {showNavigation && (
            <button
              type="button"
              onClick={() => navigateDay(1)}
              className="p-1 rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-500"
              aria-label={mergedLabels.nextDay}
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isToday() && (
            <span className="px-2 py-1 text-xs bg-orange-500 text-white rounded-full">
              {mergedLabels.today}
            </span>
          )}
          {showTodayButton && !isToday() && (
            <button
              type="button"
              onClick={goToToday}
              className="px-3 py-1 text-sm rounded border border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30"
            >
              {mergedLabels.todayButton}
            </button>
          )}
        </div>
      </div>

      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div className="p-3 border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {mergedLabels.allDay}
          </div>
          <div className="space-y-1">
            {allDayEvents.map((event) => (
              <CalendarEventCard
                key={event.id}
                event={event}
                variant="expanded"
                showTime={false}
                onClick={onEventClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Time slots */}
      <div className="max-h-96 overflow-y-auto">
        {dateEvents.length === 0 && allDayEvents.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            {mergedLabels.noEvents}
          </div>
        ) : (
          timeSlots.map((time) => {
            const slotEvents = getEventsForSlot(
              events,
              currentDate,
              time,
              slotDuration,
            );

            return (
              <div
                key={time}
                className={cn(
                  'flex border-b last:border-b-0 dark:border-gray-700',
                  'min-h-16',
                )}
              >
                {/* Time label */}
                <div className="w-20 flex-shrink-0 p-2 text-sm text-gray-500 dark:text-gray-400 border-r dark:border-gray-700 text-right">
                  {formatTimeDisplay(time)}
                </div>

                {/* Slot content */}
                <div
                  className={cn(
                    'flex-1 p-2',
                    'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50',
                  )}
                  onClick={() => onSlotClick?.(time)}
                >
                  {slotEvents.length > 0 ? (
                    <div className="space-y-1">
                      {slotEvents.map((event) => (
                        <CalendarEventCard
                          key={event.id}
                          event={event}
                          variant="expanded"
                          showTime={true}
                          onClick={onEventClick}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

DayViewCatto.displayName = 'DayViewCatto';

export default DayViewCatto;
