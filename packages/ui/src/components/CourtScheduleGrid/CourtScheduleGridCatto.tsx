// @catto/ui - CourtScheduleGridCatto Component
'use client';

import { ReactNode, useCallback, useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '../../utils';

// ============================================
// Types
// ============================================

export interface CourtInfo {
  /** Unique court identifier */
  id: number | string;
  /** Court display name */
  name: string;
}

export interface TimeSlotData {
  /** Time slot string (e.g., "09:00", "14:30") */
  time: string;
  /** Display label for the time slot (e.g., "9:00 AM") */
  label?: string;
}

export interface CourtTimeSlotState {
  /** Court ID */
  courtId: number | string;
  /** Time slot string */
  time: string;
  /** Availability state */
  state: 'available' | 'booked' | 'partial' | 'unavailable';
  /** Optional tooltip/description */
  tooltip?: string;
  /** Optional metadata for click handlers */
  metadata?: Record<string, unknown>;
}

export interface CourtScheduleGridLabels {
  /** Header for court column */
  courtHeader: string;
  /** Text for available slots */
  available: string;
  /** Text for booked slots */
  booked: string;
  /** Text for partial availability */
  partial: string;
  /** Text for unavailable slots */
  unavailable: string;
  /** Empty state message when no courts */
  noCourts: string;
  /** Empty state description */
  noCourtsDescription: string;
}

export const DEFAULT_COURT_SCHEDULE_GRID_LABELS: CourtScheduleGridLabels = {
  courtHeader: 'Court',
  available: 'Available',
  booked: 'Booked',
  partial: 'Partial',
  unavailable: 'Unavailable',
  noCourts: 'No courts available',
  noCourtsDescription: 'No courts are configured for this venue.',
};

/** Data passed during drag-drop operations */
export interface ScheduleDropData {
  /** Type identifier for the dragged item */
  type: string;
  /** The data payload */
  payload: Record<string, unknown>;
}

export interface CourtScheduleGridCattoProps {
  /** List of courts to display as rows */
  courts: CourtInfo[];
  /** List of time slots to display as columns */
  timeSlots: TimeSlotData[];
  /** Slot states - maps court/time combinations to their availability */
  slotStates: CourtTimeSlotState[];
  /** Callback when a slot is clicked */
  onSlotClick?: (
    courtId: number | string,
    time: string,
    state: CourtTimeSlotState | undefined,
  ) => void;
  /** Whether slots are clickable */
  interactive?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show icons in slots */
  showIcons?: boolean;
  /** Custom cell renderer (overrides default) */
  renderCell?: (
    state: CourtTimeSlotState | undefined,
    courtId: number | string,
    time: string,
  ) => ReactNode;
  /** i18n labels */
  labels?: Partial<CourtScheduleGridLabels>;
  /** Additional CSS classes */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Enable drop functionality - makes available slots drop targets */
  acceptDrop?: boolean;
  /** Callback when an item is dropped on an available slot */
  onDrop?: (
    courtId: number | string,
    time: string,
    data: ScheduleDropData,
  ) => void;
  /** Filter function to determine if a drop should be accepted */
  canDrop?: (
    courtId: number | string,
    time: string,
    state: CourtTimeSlotState | undefined,
  ) => boolean;
}

// ============================================
// Component
// ============================================

export function CourtScheduleGridCatto({
  courts,
  timeSlots,
  slotStates,
  onSlotClick,
  interactive = true,
  size = 'md',
  showIcons = true,
  renderCell,
  labels: customLabels,
  className,
  isLoading = false,
  acceptDrop = false,
  onDrop,
  canDrop,
}: CourtScheduleGridCattoProps) {
  const labels = { ...DEFAULT_COURT_SCHEDULE_GRID_LABELS, ...customLabels };

  // Track which slot is being dragged over
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  // Handle drag over event
  const handleDragOver = useCallback(
    (
      e: React.DragEvent,
      courtId: number | string,
      time: string,
      slotState: CourtTimeSlotState | undefined,
    ) => {
      if (!acceptDrop) return;

      // Check if drop is allowed for this slot
      const isDropAllowed = canDrop
        ? canDrop(courtId, time, slotState)
        : slotState?.state === 'available';

      if (isDropAllowed) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverSlot(`${courtId}-${time}`);
      }
    },
    [acceptDrop, canDrop],
  );

  // Handle drag leave event
  const handleDragLeave = useCallback(() => {
    setDragOverSlot(null);
  }, []);

  // Handle drop event
  const handleDrop = useCallback(
    (
      e: React.DragEvent,
      courtId: number | string,
      time: string,
      slotState: CourtTimeSlotState | undefined,
    ) => {
      e.preventDefault();
      setDragOverSlot(null);

      if (!acceptDrop || !onDrop) return;

      // Check if drop is allowed
      const isDropAllowed = canDrop
        ? canDrop(courtId, time, slotState)
        : slotState?.state === 'available';

      if (!isDropAllowed) return;

      try {
        const dataStr = e.dataTransfer.getData('application/json');
        if (dataStr) {
          const data: ScheduleDropData = JSON.parse(dataStr);
          onDrop(courtId, time, data);
        }
      } catch (error) {
        console.error('Failed to parse drop data:', error);
      }
    },
    [acceptDrop, onDrop, canDrop],
  );

  // Build a lookup map for quick access: `${courtId}-${time}` -> state
  const slotMap = useMemo(() => {
    const map = new Map<string, CourtTimeSlotState>();
    slotStates.forEach((slot) => {
      map.set(`${slot.courtId}-${slot.time}`, slot);
    });
    return map;
  }, [slotStates]);

  // Size classes
  const cellSizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const headerSizeClasses = {
    sm: 'text-xs px-1 py-1',
    md: 'text-sm px-2 py-2',
    lg: 'text-base px-3 py-2',
  };

  const courtNameSizeClasses = {
    sm: 'text-xs px-2 py-1 min-w-20',
    md: 'text-sm px-3 py-2 min-w-28',
    lg: 'text-base px-4 py-2 min-w-32',
  };

  // State colors
  const getStateClasses = (state: CourtTimeSlotState['state'] | undefined) => {
    switch (state) {
      case 'available':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'booked':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'partial':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      case 'unavailable':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500';
      default:
        return 'bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600';
    }
  };

  // Default cell content
  const getDefaultCellContent = (
    state: CourtTimeSlotState['state'] | undefined,
  ) => {
    if (!showIcons) return null;

    switch (state) {
      case 'available':
        return <Check className="w-4 h-4" />;
      case 'booked':
        return <X className="w-4 h-4" />;
      case 'partial':
        return <span className="text-xs font-medium">P</span>;
      case 'unavailable':
        return <span className="text-xs">—</span>;
      default:
        return null;
    }
  };

  // Empty state
  if (courts.length === 0) {
    return (
      <div
        className={cn(
          'text-center py-8 text-gray-500 dark:text-gray-400',
          className,
        )}
      >
        <p className="font-medium">{labels.noCourts}</p>
        <p className="text-sm mt-1">{labels.noCourtsDescription}</p>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th
                  className={cn(
                    'bg-gray-200 dark:bg-gray-700 rounded',
                    headerSizeClasses[size],
                    'w-28',
                  )}
                >
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16" />
                </th>
                {timeSlots.slice(0, 6).map((_, i) => (
                  <th
                    key={i}
                    className={cn(
                      'bg-gray-200 dark:bg-gray-700',
                      headerSizeClasses[size],
                    )}
                  >
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12 mx-auto" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((row) => (
                <tr key={row}>
                  <td
                    className={cn(
                      'bg-gray-100 dark:bg-gray-800',
                      courtNameSizeClasses[size],
                    )}
                  >
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                  </td>
                  {timeSlots.slice(0, 6).map((_, i) => (
                    <td key={i} className="p-1">
                      <div
                        className={cn(
                          'bg-gray-200 dark:bg-gray-700 rounded',
                          cellSizeClasses[size],
                        )}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse min-w-max">
        <thead>
          <tr>
            {/* Court header cell */}
            <th
              className={cn(
                'sticky left-0 z-10 text-left font-semibold',
                'bg-slate-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                'border-b border-r border-gray-200 dark:border-gray-700',
                headerSizeClasses[size],
              )}
            >
              {labels.courtHeader}
            </th>
            {/* Time slot headers */}
            {timeSlots.map((slot) => (
              <th
                key={slot.time}
                className={cn(
                  'text-center font-medium whitespace-nowrap',
                  'bg-slate-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
                  'border-b border-gray-200 dark:border-gray-700',
                  headerSizeClasses[size],
                )}
              >
                {slot.label || slot.time}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {courts.map((court) => (
            <tr key={court.id} className="group">
              {/* Court name cell */}
              <td
                className={cn(
                  'sticky left-0 z-10 font-medium whitespace-nowrap',
                  'bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                  'border-b border-r border-gray-200 dark:border-gray-700',
                  'group-hover:bg-gray-100 dark:group-hover:bg-gray-700/50 transition-colors',
                  courtNameSizeClasses[size],
                )}
              >
                {court.name}
              </td>
              {/* Time slot cells */}
              {timeSlots.map((slot) => {
                const key = `${court.id}-${slot.time}`;
                const slotState = slotMap.get(key);
                const state = slotState?.state;
                const isDragOver = dragOverSlot === key;

                // Check if this slot can accept drops
                const isDropTarget =
                  acceptDrop &&
                  (canDrop
                    ? canDrop(court.id, slot.time, slotState)
                    : state === 'available');

                return (
                  <td
                    key={key}
                    className="border-b border-gray-200 dark:border-gray-700 p-1"
                  >
                    <button
                      type="button"
                      disabled={!interactive && !isDropTarget}
                      onClick={() => {
                        if (interactive && onSlotClick) {
                          onSlotClick(court.id, slot.time, slotState);
                        }
                      }}
                      onDragOver={(e) =>
                        handleDragOver(e, court.id, slot.time, slotState)
                      }
                      onDragLeave={handleDragLeave}
                      onDrop={(e) =>
                        handleDrop(e, court.id, slot.time, slotState)
                      }
                      title={slotState?.tooltip}
                      className={cn(
                        'flex items-center justify-center rounded transition-all',
                        cellSizeClasses[size],
                        getStateClasses(state),
                        interactive &&
                          'hover:ring-2 hover:ring-orange-400 dark:hover:ring-orange-500 cursor-pointer',
                        !interactive && !isDropTarget && 'cursor-default',
                        // Drag-over visual feedback
                        isDragOver &&
                          'ring-2 ring-orange-500 dark:ring-orange-400 bg-orange-200 dark:bg-orange-900/50 scale-110',
                        // Drop target indicator
                        isDropTarget &&
                          !isDragOver &&
                          'ring-1 ring-dashed ring-orange-300 dark:ring-orange-600',
                      )}
                    >
                      {renderCell
                        ? renderCell(slotState, court.id, slot.time)
                        : getDefaultCellContent(state)}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'w-4 h-4 rounded flex items-center justify-center',
              getStateClasses('available'),
            )}
          >
            {showIcons && <Check className="w-3 h-3" />}
          </span>
          <span>{labels.available}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'w-4 h-4 rounded flex items-center justify-center',
              getStateClasses('booked'),
            )}
          >
            {showIcons && <X className="w-3 h-3" />}
          </span>
          <span>{labels.booked}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'w-4 h-4 rounded flex items-center justify-center',
              getStateClasses('partial'),
            )}
          >
            {showIcons && <span className="text-[10px] font-medium">P</span>}
          </span>
          <span>{labels.partial}</span>
        </div>
      </div>
    </div>
  );
}

export default CourtScheduleGridCatto;
