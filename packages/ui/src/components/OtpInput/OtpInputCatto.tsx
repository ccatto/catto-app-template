'use client';

import {
  ClipboardEvent,
  forwardRef,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '../../utils';

export interface OtpInputCattoProps {
  /** Number of OTP digits */
  length?: number;
  /** Callback when all digits are entered */
  onComplete: (otp: string) => void;
  /** Disable input */
  disabled?: boolean;
  /** Auto-focus first input on mount */
  autoFocus?: boolean;
  /** Error message to display */
  error?: string;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * OTP Input Component - Multi-digit code input with auto-advance
 *
 * Features:
 * - Auto-focus next input on digit entry
 * - Backspace moves to previous input
 * - Paste support for full code
 * - Arrow key navigation
 * - Mobile-friendly with numeric keyboard
 */
const OtpInputCatto = forwardRef<HTMLDivElement, OtpInputCattoProps>(
  (
    {
      length = 6,
      onComplete,
      disabled = false,
      autoFocus = true,
      error,
      className,
    },
    ref,
  ) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Focus first input on mount (if autoFocus is enabled)
    useEffect(() => {
      if (autoFocus && inputRefs.current[0] && !disabled) {
        inputRefs.current[0].focus();
      }
    }, [autoFocus, disabled]);

    // Check if OTP is complete
    useEffect(() => {
      const otpValue = otp.join('');
      if (otpValue.length === length && !otp.includes('')) {
        onComplete(otpValue);
      }
    }, [otp, length, onComplete]);

    const handleChange = (index: number, value: string) => {
      if (disabled) return;

      // Only allow single digit
      const digit = value.slice(-1);
      if (!/^\d*$/.test(digit)) return;

      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);

      // Auto-advance to next input
      if (digit && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (
      index: number,
      e: KeyboardEvent<HTMLInputElement>,
    ) => {
      if (disabled) return;

      // Backspace: clear current or move to previous
      if (e.key === 'Backspace') {
        if (otp[index]) {
          const newOtp = [...otp];
          newOtp[index] = '';
          setOtp(newOtp);
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          const newOtp = [...otp];
          newOtp[index - 1] = '';
          setOtp(newOtp);
        }
      }

      // Arrow keys for navigation
      if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

      if (pastedData.length === length) {
        const newOtp = pastedData.split('').slice(0, length);
        setOtp(newOtp);
        inputRefs.current[length - 1]?.focus();
      }
    };

    const handleFocus = (index: number) => {
      // Select input content on focus
      inputRefs.current[index]?.select();
    };

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center gap-2', className)}
      >
        <div className="flex gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={() => handleFocus(index)}
              disabled={disabled}
              className={cn(
                'h-12 w-10 sm:h-14 sm:w-12',
                'rounded-lg border-2 text-center text-xl font-bold',
                'transition-all duration-150',
                'focus:outline-none focus:ring-2 focus:ring-theme-secondary',
                error
                  ? 'border-red-500 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-900/30 dark:text-red-300'
                  : digit
                    ? 'border-theme-secondary bg-theme-secondary-subtle text-theme-text'
                    : 'border-theme-border bg-theme-surface text-theme-text',
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-text',
              )}
              aria-label={`Digit ${index + 1} of ${length}`}
            />
          ))}
        </div>
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  },
);

OtpInputCatto.displayName = 'OtpInputCatto';

export default OtpInputCatto;
