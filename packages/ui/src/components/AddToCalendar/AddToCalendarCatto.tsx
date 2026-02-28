// @catto/ui - AddToCalendarCatto Component
// Dropdown button to add an event to Google Calendar or download .ics file
'use client';

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import type { AddToCalendarLabels } from '../../i18n/defaults';
import { DEFAULT_ADD_TO_CALENDAR_LABELS } from '../../i18n/defaults';
import { cn } from '../../utils';
import type { CalendarEvent } from '../../utils/calendar-utils';
import {
  downloadICSFile,
  generateGoogleCalendarURL,
} from '../../utils/calendar-utils';
import ButtonCatto from '../Button/ButtonCatto';

// ============================================================================
// TYPES
// ============================================================================

export interface AddToCalendarCattoProps {
  /** Calendar event data */
  event: CalendarEvent;
  /** Compact icon-only mode (for dashboard cards) */
  compact?: boolean;
  /** i18n labels */
  labels?: AddToCalendarLabels;
  /** Additional CSS classes */
  className?: string;
  /** Disable the button */
  disabled?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * AddToCalendarCatto - Dropdown button for calendar export
 *
 * Two options:
 * - Download .ics file (Apple Calendar, Outlook, etc.)
 * - Open in Google Calendar
 */
const AddToCalendarCatto = forwardRef<HTMLDivElement, AddToCalendarCattoProps>(
  ({ event, compact = false, labels, className, disabled = false }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Merge labels with defaults
    const l = { ...DEFAULT_ADD_TO_CALENDAR_LABELS, ...labels };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
      }
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const handleDownloadICS = () => {
      downloadICSFile(event);
      setIsOpen(false);
    };

    const handleGoogleCalendar = () => {
      window.open(generateGoogleCalendarURL(event), '_blank', 'noopener');
      setIsOpen(false);
    };

    const handleContainerRef = (node: HTMLDivElement | null) => {
      dropdownRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <div className={cn('relative', className)} ref={handleContainerRef}>
        {/* Trigger Button */}
        <ButtonCatto
          variant="ghost"
          size="small"
          width={compact ? 'fit' : 'auto'}
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            compact
              ? 'text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400'
              : 'text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400',
          )}
        >
          <Calendar className="h-4 w-4" aria-hidden="true" />
          {!compact && <span className="ml-1.5">{l.buttonText}</span>}
        </ButtonCatto>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            role="menu"
            aria-label={l.buttonTooltip}
            className="absolute right-0 z-50 mt-1 w-52 rounded-lg border border-gray-200 bg-slate-50 shadow-lg dark:border-gray-600 dark:bg-gray-800"
          >
            <button
              role="menuitem"
              onClick={handleDownloadICS}
              className="flex w-full items-center gap-3 rounded-t-lg px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Download
                className="h-4 w-4 text-orange-500"
                aria-hidden="true"
              />
              <div>
                <div className="font-medium">{l.downloadTitle}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {l.downloadDescription}
                </div>
              </div>
            </button>
            <button
              role="menuitem"
              onClick={handleGoogleCalendar}
              className="flex w-full items-center gap-3 rounded-b-lg px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <ExternalLink
                className="h-4 w-4 text-blue-500"
                aria-hidden="true"
              />
              <div>
                <div className="font-medium">{l.googleTitle}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {l.googleDescription}
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
    );
  },
);

AddToCalendarCatto.displayName = 'AddToCalendarCatto';

export default AddToCalendarCatto;
