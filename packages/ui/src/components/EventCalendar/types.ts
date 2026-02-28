'use client';

/**
 * Event Calendar Types
 * Shared types for all EventCalendar components
 */

/** Color options for calendar events */
export type EventColor =
  | 'orange'
  | 'blue'
  | 'green'
  | 'red'
  | 'gray'
  | 'purple';

/** Event type identifiers */
export type EventType =
  | 'tournament'
  | 'league'
  | 'clinic'
  | 'lesson'
  | 'openplay'
  | 'event'
  | 'blocked'
  | 'holiday';

/**
 * Calendar event item - the core data structure for events
 */
export interface CalendarEventItem {
  /** Unique identifier for the event */
  id: string;
  /** Display title of the event */
  title: string;
  /** Start time in ISO 8601 format or HH:mm for time-only */
  startTime: string;
  /** End time in ISO 8601 format or HH:mm for time-only (optional) */
  endTime?: string;
  /** Color theme for the event (default: 'blue') */
  color?: EventColor;
  /** Type of event for filtering and display */
  type?: EventType;
  /** Whether this is an all-day event */
  allDay?: boolean;
  /** Additional metadata for the event */
  metadata?: Record<string, unknown>;
}

/**
 * Time slot for availability/booking views
 */
export interface TimeSlot {
  /** Start time in HH:mm format */
  start: string;
  /** End time in HH:mm format */
  end: string;
  /** Whether the slot is available */
  available?: boolean;
  /** Label to display (e.g., "9:00 AM - 10:00 AM") */
  label?: string;
}

/** Calendar view mode */
export type CalendarView = 'month' | 'week' | 'day';

/** Calendar theme options (matches CalendarCatto) */
export type EventCalendarTheme =
  | 'midnightEmber'
  | 'sunset'
  | 'ocean'
  | 'forest'
  | 'lavender';

/** Calendar size options */
export type EventCalendarSize = 'small' | 'medium' | 'large';

/**
 * Color classes for events based on color prop
 */
export const eventColorClasses: Record<
  EventColor,
  { bg: string; text: string; border: string; hover: string }
> = {
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-800 dark:text-orange-200',
    border: 'border-orange-300 dark:border-orange-700',
    hover: 'hover:bg-orange-200 dark:hover:bg-orange-800/40',
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-200',
    border: 'border-blue-300 dark:border-blue-700',
    hover: 'hover:bg-blue-200 dark:hover:bg-blue-800/40',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-800 dark:text-green-200',
    border: 'border-green-300 dark:border-green-700',
    hover: 'hover:bg-green-200 dark:hover:bg-green-800/40',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-200',
    border: 'border-red-300 dark:border-red-700',
    hover: 'hover:bg-red-200 dark:hover:bg-red-800/40',
  },
  gray: {
    bg: 'bg-gray-100 dark:bg-gray-700/30',
    text: 'text-gray-800 dark:text-gray-200',
    border: 'border-gray-300 dark:border-gray-600',
    hover: 'hover:bg-gray-200 dark:hover:bg-gray-600/40',
  },
  purple: {
    bg: 'bg-slate-100 dark:bg-slate-700/30',
    text: 'text-slate-800 dark:text-slate-200',
    border: 'border-slate-300 dark:border-slate-600',
    hover: 'hover:bg-slate-200 dark:hover:bg-slate-600/40',
  },
};

/**
 * Icon mapping for event types
 */
export const eventTypeIcons: Record<EventType, string> = {
  tournament: '🏆',
  league: '🏅',
  clinic: '📚',
  lesson: '🎓',
  openplay: '🎾',
  event: '📅',
  blocked: '🚫',
  holiday: '🎉',
};

/**
 * Default color mapping for event types
 */
export const eventTypeColors: Record<EventType, EventColor> = {
  tournament: 'orange',
  league: 'blue',
  clinic: 'green',
  lesson: 'green',
  openplay: 'blue',
  event: 'gray',
  blocked: 'gray',
  holiday: 'red',
};
