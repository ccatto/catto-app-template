'use client';

import React from 'react';
import { cn } from '../../utils';
import { CalendarEventItem, eventColorClasses, eventTypeIcons } from './types';

export interface CalendarEventCardProps {
  /** The event to display */
  event: CalendarEventItem;
  /** Click handler for the event */
  onClick?: (event: CalendarEventItem) => void;
  /** Hover handler for the event */
  onHover?: (event: CalendarEventItem | null) => void;
  /** Display mode - compact for month view, expanded for day/week */
  variant?: 'compact' | 'expanded';
  /** Whether to show the time */
  showTime?: boolean;
  /** Whether to show the event type icon */
  showIcon?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Format time from various formats to display format
 */
const formatTime = (timeStr: string): string => {
  // Handle HH:mm format
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  // Handle ISO 8601 format
  try {
    const date = new Date(timeStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return timeStr;
  }
};

/**
 * CalendarEventCard - Displays a single event in the calendar
 *
 * Used in:
 * - Month view (compact mode, truncated)
 * - Week view (expanded mode, shows time)
 * - Day view (expanded mode, full details)
 */
const CalendarEventCard: React.FC<CalendarEventCardProps> = ({
  event,
  onClick,
  onHover,
  variant = 'compact',
  showTime = false,
  showIcon = true,
  className,
}) => {
  const colors = eventColorClasses[event.color || 'blue'];
  const icon = event.type ? eventTypeIcons[event.type] : null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(event);
  };

  const handleMouseEnter = () => {
    onHover?.(event);
  };

  const handleMouseLeave = () => {
    onHover?.(null);
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'w-full text-left text-xs truncate px-1.5 py-0.5 rounded',
          'transition-colors duration-150 cursor-pointer',
          'border-l-2',
          colors.bg,
          colors.text,
          colors.border,
          colors.hover,
          'focus:outline-none focus:ring-1 focus:ring-orange-500',
          className,
        )}
        title={event.title}
      >
        {showIcon && icon && <span className="mr-1">{icon}</span>}
        {showTime && event.startTime && (
          <span className="font-medium mr-1">
            {formatTime(event.startTime)}
          </span>
        )}
        <span className="truncate">{event.title}</span>
      </button>
    );
  }

  // Expanded variant for week/day views
  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'w-full text-left p-2 rounded-lg',
        'transition-colors duration-150 cursor-pointer',
        'border-l-4',
        colors.bg,
        colors.text,
        colors.border,
        colors.hover,
        'focus:outline-none focus:ring-2 focus:ring-orange-500',
        className,
      )}
    >
      <div className="flex items-start gap-2">
        {showIcon && icon && <span className="text-base mt-0.5">{icon}</span>}
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{event.title}</div>
          {showTime && event.startTime && (
            <div className="text-xs opacity-75 mt-0.5">
              {formatTime(event.startTime)}
              {event.endTime && ` - ${formatTime(event.endTime)}`}
            </div>
          )}
          {event.allDay && (
            <div className="text-xs opacity-75 mt-0.5">All day</div>
          )}
        </div>
      </div>
    </button>
  );
};

CalendarEventCard.displayName = 'CalendarEventCard';

export default CalendarEventCard;
