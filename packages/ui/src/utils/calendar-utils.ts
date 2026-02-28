// @catto/ui - Calendar utilities for iCal (.ics) and Google Calendar export
'use client';

// ============================================================================
// TYPES
// ============================================================================

export interface CalendarEvent {
  /** Unique identifier for the event */
  id: string;
  /** Event title/summary */
  title: string;
  /** Event description (optional) */
  description?: string;
  /** Event location (optional) */
  location?: string;
  /** Start time in ISO 8601 format */
  startTime: string;
  /** End time in ISO 8601 format (defaults to startTime + 2 hours if not provided) */
  endTime?: string;
}

// ============================================================================
// DATE FORMATTING HELPERS
// ============================================================================

/**
 * Format a date string to iCal/Google Calendar format: YYYYMMDDTHHMMSSZ
 */
function toCalendarDate(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Add hours to a date and return ISO string
 */
function addHours(isoDate: string, hours: number): string {
  const date = new Date(isoDate);
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  return date.toISOString();
}

// ============================================================================
// iCal (.ics) GENERATION
// ============================================================================

/**
 * Escape special characters for iCal text fields
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generate an iCal (.ics) file content string
 */
export function generateICSContent(event: CalendarEvent): string {
  const start = toCalendarDate(event.startTime);
  const end = event.endTime
    ? toCalendarDate(event.endTime)
    : toCalendarDate(addHours(event.startTime, 2));

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CattoUI//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeICalText(event.title)}`,
    `UID:${event.id}@catto-ui`,
    'STATUS:CONFIRMED',
  ];

  if (event.location) {
    lines.push(`LOCATION:${escapeICalText(event.location)}`);
  }
  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICalText(event.description)}`);
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.join('\r\n');
}

/**
 * Download an .ics file to the user's device
 */
export function downloadICSFile(event: CalendarEvent): void {
  const content = generateICSContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================================================
// GOOGLE CALENDAR URL
// ============================================================================

/**
 * Generate a Google Calendar "Add Event" URL
 */
export function generateGoogleCalendarURL(event: CalendarEvent): string {
  const start = toCalendarDate(event.startTime);
  const end = event.endTime
    ? toCalendarDate(event.endTime)
    : toCalendarDate(addHours(event.startTime, 2));

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
  });

  if (event.location) {
    params.set('location', event.location);
  }
  if (event.description) {
    params.set('details', event.description);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
