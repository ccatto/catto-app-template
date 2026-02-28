// EventCalendar components - Full calendar views with event display
export { default as EventCalendarCatto } from './EventCalendarCatto';
export { default as WeekViewCatto } from './WeekViewCatto';
export { default as DayViewCatto } from './DayViewCatto';
export { default as TimeSlotPickerCatto } from './TimeSlotPickerCatto';
export { default as CalendarEventCard } from './CalendarEventCard';

// Types
export type {
  CalendarEventItem,
  TimeSlot,
  CalendarView,
  EventCalendarTheme,
  EventCalendarSize,
  EventColor,
  EventType,
} from './types';
export { eventColorClasses, eventTypeIcons } from './types';

// Props types
export type {
  EventCalendarCattoProps,
  EventCalendarLabels,
} from './EventCalendarCatto';
export type { WeekViewCattoProps, WeekViewLabels } from './WeekViewCatto';
export type { DayViewCattoProps, DayViewLabels } from './DayViewCatto';
export type {
  TimeSlotPickerCattoProps,
  TimeSlotPickerLabels,
} from './TimeSlotPickerCatto';
export type { CalendarEventCardProps } from './CalendarEventCard';

// Default labels
export { DEFAULT_EVENT_CALENDAR_LABELS } from './EventCalendarCatto';
export { DEFAULT_WEEK_VIEW_LABELS } from './WeekViewCatto';
export { DEFAULT_DAY_VIEW_LABELS } from './DayViewCatto';
export { DEFAULT_TIME_SLOT_PICKER_LABELS } from './TimeSlotPickerCatto';
