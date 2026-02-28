// @catto/ui - PhoneDisplayCatto Component
// Display-only component for formatted phone numbers
'use client';

import React from 'react';
import { formatPhoneNumber, PhoneFormatOptions } from '../../utils/phone';

export interface PhoneDisplayCattoProps {
  /** Phone number to display (raw or formatted) */
  value: string | null | undefined;

  /** Format style (default: 'national') */
  format?: 'national' | 'international' | 'e164';

  /** Text to show when value is empty (default: 'Not provided') */
  emptyText?: string;

  /** Additional class names */
  className?: string;

  /** Render as a clickable tel: link */
  asLink?: boolean;

  /** Link class names (only applies when asLink is true) */
  linkClassName?: string;
}

/**
 * Display a formatted phone number (read-only)
 *
 * @example
 * // Basic display
 * <PhoneDisplayCatto value="5551234567" />
 * // Renders: (555) 123-4567
 *
 * @example
 * // As clickable link
 * <PhoneDisplayCatto value="5551234567" asLink />
 * // Renders: <a href="tel:+15551234567">(555) 123-4567</a>
 *
 * @example
 * // International format
 * <PhoneDisplayCatto value="5551234567" format="international" />
 * // Renders: +1 (555) 123-4567
 */
export default function PhoneDisplayCatto({
  value,
  format = 'national',
  emptyText = 'Not provided',
  className = '',
  asLink = false,
  linkClassName = '',
}: PhoneDisplayCattoProps): React.ReactElement {
  // Format the phone number for display
  const formattedPhone = formatPhoneNumber(value, {
    format,
  } as PhoneFormatOptions);

  // If no value or formatting returned empty, show empty text
  if (!formattedPhone) {
    return (
      <span className={`text-gray-500 dark:text-gray-400 ${className}`}>
        {emptyText}
      </span>
    );
  }

  // Get E.164 format for tel: link
  const telHref = `tel:${formatPhoneNumber(value, { format: 'e164' })}`;

  // Render as link if requested
  if (asLink) {
    return (
      <a
        href={telHref}
        className={`text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline ${linkClassName} ${className}`}
      >
        {formattedPhone}
      </a>
    );
  }

  // Render as plain text
  return (
    <span className={`text-gray-900 dark:text-slate-50 ${className}`}>
      {formattedPhone}
    </span>
  );
}

PhoneDisplayCatto.displayName = 'PhoneDisplayCatto';
