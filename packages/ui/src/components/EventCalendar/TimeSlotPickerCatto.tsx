'use client';

import React, { useMemo } from 'react';
import { Check, Clock } from 'lucide-react';
import { cn } from '../../utils';
import { EventCalendarTheme, TimeSlot } from './types';

export interface TimeSlotPickerLabels {
  /** Header text (default: "Select a time") */
  header?: string;
  /** No slots available message (default: "No available times") */
  noSlots?: string;
  /** Booked slot text (default: "Booked") */
  booked?: string;
  /** Selected slot text (default: "Selected") */
  selected?: string;
}

export const DEFAULT_TIME_SLOT_PICKER_LABELS: Required<TimeSlotPickerLabels> = {
  header: 'Select a time',
  noSlots: 'No available times',
  booked: 'Booked',
  selected: 'Selected',
};

export interface TimeSlotPickerCattoProps {
  /** Available time slots */
  availableSlots: TimeSlot[];
  /** Slots that are already booked (shown as disabled) */
  bookedSlots?: TimeSlot[];
  /** Currently selected slot */
  selectedSlot?: TimeSlot;
  /** Callback when a slot is selected */
  onSlotSelect: (slot: TimeSlot) => void;
  /** Date for the slots (for display) */
  date?: Date;
  /** Duration of each slot in minutes (for display purposes) */
  slotDuration?: 30 | 60 | 90;
  /** Color theme */
  theme?: EventCalendarTheme;
  /** i18n labels */
  labels?: Partial<TimeSlotPickerLabels>;
  /** Number of columns for slot grid (default: 3 on desktop, 2 on mobile) */
  columns?: 2 | 3 | 4;
  /** Show slot duration */
  showDuration?: boolean;
  /** Loading state */
  loading?: boolean;
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
 * Format time from HH:mm to display format
 */
const formatTimeDisplay = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Check if two time slots match
 */
const slotsMatch = (a: TimeSlot | undefined, b: TimeSlot): boolean => {
  if (!a) return false;
  return a.start === b.start && a.end === b.end;
};

/**
 * Check if a slot is in the booked list
 */
const isSlotBooked = (slot: TimeSlot, bookedSlots: TimeSlot[]): boolean => {
  return bookedSlots.some(
    (booked) => booked.start === slot.start && booked.end === slot.end,
  );
};

/**
 * TimeSlotPickerCatto - Time slot selection grid for booking flows
 *
 * Features:
 * - Grid of available time slots
 * - Visual distinction for booked vs available slots
 * - Selected slot highlighting
 * - Mobile-responsive grid
 * - Loading state support
 */
const TimeSlotPickerCatto: React.FC<TimeSlotPickerCattoProps> = ({
  availableSlots,
  bookedSlots = [],
  selectedSlot,
  onSlotSelect,
  date,
  slotDuration,
  theme = 'midnightEmber',
  labels = {},
  columns = 3,
  showDuration = false,
  loading = false,
  className,
}) => {
  const mergedLabels = { ...DEFAULT_TIME_SLOT_PICKER_LABELS, ...labels };

  // Sort slots by start time
  const sortedSlots = useMemo(() => {
    return [...availableSlots].sort((a, b) => {
      const aTime = parseInt(a.start.replace(':', ''), 10);
      const bTime = parseInt(b.start.replace(':', ''), 10);
      return aTime - bTime;
    });
  }, [availableSlots]);

  // Column classes
  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
  };

  // Format date header
  const dateHeader = date
    ? date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : null;

  if (loading) {
    return (
      <div
        className={cn(
          'w-full',
          themeClasses[theme],
          'rounded-lg border border-gray-200 dark:border-gray-700 p-4',
          className,
        )}
      >
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className={cn('grid gap-2', columnClasses[columns])}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 dark:bg-gray-700 rounded"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center gap-2 text-orange-500">
          <Clock size={18} />
          <h3 className="font-semibold">{mergedLabels.header}</h3>
        </div>
        {dateHeader && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {dateHeader}
          </div>
        )}
      </div>

      {/* Slots grid */}
      <div className="p-4">
        {sortedSlots.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {mergedLabels.noSlots}
          </div>
        ) : (
          <div className={cn('grid gap-2', columnClasses[columns])}>
            {sortedSlots.map((slot) => {
              const isBooked = isSlotBooked(slot, bookedSlots);
              const isSelected = slotsMatch(selectedSlot, slot);

              return (
                <button
                  key={`${slot.start}-${slot.end}`}
                  type="button"
                  onClick={() => !isBooked && onSlotSelect(slot)}
                  disabled={isBooked}
                  className={cn(
                    'relative p-3 rounded-lg border-2 transition-all duration-150',
                    'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                    // Selected state
                    isSelected && [
                      'border-orange-500 bg-orange-50 dark:bg-orange-900/30',
                      'text-orange-700 dark:text-orange-200',
                    ],
                    // Booked state
                    isBooked && [
                      'border-gray-200 dark:border-gray-700',
                      'bg-gray-100 dark:bg-gray-800',
                      'text-gray-400 dark:text-gray-500',
                      'cursor-not-allowed',
                      'line-through',
                    ],
                    // Available state (not selected, not booked)
                    !isSelected &&
                      !isBooked && [
                        'border-gray-200 dark:border-gray-700',
                        'hover:border-orange-300 dark:hover:border-orange-600',
                        'hover:bg-orange-50 dark:hover:bg-orange-900/20',
                        'cursor-pointer',
                      ],
                  )}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-1 right-1">
                      <Check size={14} className="text-orange-500" />
                    </div>
                  )}

                  {/* Time display */}
                  <div className="font-medium">
                    {slot.label || formatTimeDisplay(slot.start)}
                  </div>

                  {/* Duration or end time */}
                  {showDuration && slotDuration && !isBooked && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {slotDuration} min
                    </div>
                  )}
                  {!showDuration && slot.end && !isBooked && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      to {formatTimeDisplay(slot.end)}
                    </div>
                  )}

                  {/* Booked indicator */}
                  {isBooked && (
                    <div className="text-xs mt-0.5">{mergedLabels.booked}</div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected slot summary */}
      {selectedSlot && (
        <div className="px-4 pb-4">
          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700">
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-orange-500" />
              <span className="font-medium text-orange-700 dark:text-orange-200">
                {mergedLabels.selected}:
              </span>
              <span className="text-orange-600 dark:text-orange-300">
                {formatTimeDisplay(selectedSlot.start)}
                {selectedSlot.end &&
                  ` - ${formatTimeDisplay(selectedSlot.end)}`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

TimeSlotPickerCatto.displayName = 'TimeSlotPickerCatto';

export default TimeSlotPickerCatto;
