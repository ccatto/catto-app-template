// @catto/ui - Phone Number Utilities
// US-focused formatting with optional libphonenumber-js integration path

/**
 * Options for phone number formatting
 */
export interface PhoneFormatOptions {
  /** Output format style (default: 'national') */
  format?: 'national' | 'international' | 'e164' | 'raw';
  /** Default country code for parsing (default: 'US') */
  defaultCountry?: string;
  /** Custom formatter function (for libphonenumber-js integration) */
  customFormatter?: (phone: string, country: string) => string;
}

/**
 * Extract only digits from a phone string
 * Preserves leading + for international numbers
 *
 * @param phone - Phone number in any format
 * @returns Digits only (with + preserved if present)
 *
 * @example
 * extractPhoneDigits('(555) 123-4567') // '5551234567'
 * extractPhoneDigits('+1 555-123-4567') // '+15551234567'
 */
export function extractPhoneDigits(phone: string | null | undefined): string {
  if (!phone) return '';

  // Preserve leading + for international, then extract digits
  const hasPlus = phone.startsWith('+');
  const digits = phone.replace(/\D/g, '');

  return hasPlus ? `+${digits}` : digits;
}

/**
 * Format a phone number for display
 * Handles US phone numbers (10 digits) with optional country code (11 digits starting with 1)
 *
 * @param phone - Raw phone number string (digits, may include +)
 * @param options - Formatting options
 * @returns Formatted phone string
 *
 * @example
 * formatPhoneNumber('5551234567') // '(555) 123-4567'
 * formatPhoneNumber('15551234567') // '(555) 123-4567'
 * formatPhoneNumber('5551234567', { format: 'international' }) // '+1 (555) 123-4567'
 * formatPhoneNumber('5551234567', { format: 'e164' }) // '+15551234567'
 */
export function formatPhoneNumber(
  phone: string | null | undefined,
  options: PhoneFormatOptions = {},
): string {
  if (!phone) return '';

  const {
    format = 'national',
    defaultCountry = 'US',
    customFormatter,
  } = options;

  // Use custom formatter if provided (libphonenumber-js integration point)
  if (customFormatter) {
    return customFormatter(phone, defaultCountry);
  }

  // Extract digits only
  const digits = phone.replace(/\D/g, '');

  // Handle empty or invalid
  if (!digits) return '';

  // Determine if has country code (starts with 1 and has 11 digits)
  const hasCountryCode = digits.length === 11 && digits.startsWith('1');
  const nationalDigits = hasCountryCode ? digits.slice(1) : digits;

  // For complete US numbers (10 digits)
  if (nationalDigits.length === 10) {
    const areaCode = nationalDigits.slice(0, 3);
    const exchange = nationalDigits.slice(3, 6);
    const subscriber = nationalDigits.slice(6, 10);

    switch (format) {
      case 'e164':
        return `+1${nationalDigits}`;
      case 'international':
        return `+1 (${areaCode}) ${exchange}-${subscriber}`;
      case 'raw':
        return nationalDigits;
      case 'national':
      default:
        return `(${areaCode}) ${exchange}-${subscriber}`;
    }
  }

  // For partial numbers during typing - format progressively
  if (nationalDigits.length < 10) {
    if (nationalDigits.length === 0) {
      return '';
    }
    if (nationalDigits.length <= 3) {
      return `(${nationalDigits}`;
    }
    if (nationalDigits.length <= 6) {
      return `(${nationalDigits.slice(0, 3)}) ${nationalDigits.slice(3)}`;
    }
    return `(${nationalDigits.slice(0, 3)}) ${nationalDigits.slice(
      3,
      6,
    )}-${nationalDigits.slice(6)}`;
  }

  // For numbers longer than expected, just return raw
  return phone;
}

/**
 * Format phone number as user types with backspace handling
 * Used for controlled input components
 *
 * @param current - Current input value
 * @param previous - Previous input value (for backspace detection)
 * @returns Formatted value for display in input
 *
 * @example
 * formatPhoneAsYouType('5', '') // '(5'
 * formatPhoneAsYouType('555', '(55') // '(555'
 * formatPhoneAsYouType('5551', '(555') // '(555) 1'
 */
export function formatPhoneAsYouType(
  current: string,
  previous: string = '',
): string {
  // Extract digits from current input
  const currentDigits = current.replace(/\D/g, '');
  const previousDigits = previous.replace(/\D/g, '');

  // Detect backspace (current has fewer digits than previous)
  const isDeleting = currentDigits.length < previousDigits.length;

  if (isDeleting) {
    // On backspace, just format what's left
    return formatPhoneNumber(currentDigits, { format: 'national' });
  }

  // On typing, format progressively
  return formatPhoneNumber(currentDigits, { format: 'national' });
}

/**
 * Validate a phone number (basic US validation)
 * Checks for valid 10-digit or 11-digit (with leading 1) US phone numbers
 *
 * @param phone - Phone number to validate
 * @returns Whether the phone appears valid
 *
 * @example
 * isValidPhoneNumber('5551234567') // true
 * isValidPhoneNumber('15551234567') // true
 * isValidPhoneNumber('123') // false
 * isValidPhoneNumber('+15551234567') // true
 */
export function isValidPhoneNumber(phone: string | null | undefined): boolean {
  if (!phone) return false;

  // Extract digits only
  const digits = phone.replace(/\D/g, '');

  // Valid: 10 digits (US national) or 11 digits starting with 1 (US with country code)
  if (digits.length === 10) {
    // Basic check: area code can't start with 0 or 1
    const areaCode = digits.slice(0, 3);
    return !areaCode.startsWith('0') && !areaCode.startsWith('1');
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    // With country code - same area code check
    const areaCode = digits.slice(1, 4);
    return !areaCode.startsWith('0') && !areaCode.startsWith('1');
  }

  return false;
}

/**
 * Parse phone input and get raw digits
 * Convenience function for form handling
 *
 * @param phone - Phone number in any format
 * @returns Raw digits only (no formatting characters)
 *
 * @example
 * parsePhoneInput('(555) 123-4567') // '5551234567'
 */
export function parsePhoneInput(phone: string | null | undefined): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}
