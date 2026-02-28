// @catto/ui - CheckboxCatto Component
'use client';

import React, { forwardRef } from 'react';
import { cn } from '../../utils';

type CheckboxSize = 'md' | 'lg' | 'xl' | 'xxl';

export interface CheckboxCattoProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'onChange'
> {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  checkboxSize?: CheckboxSize;
  /** Visible label text displayed next to the checkbox */
  label?: string;
  /** Screen reader only label when no visible label is provided */
  'aria-label'?: string;
}

const sizeMap: Record<CheckboxSize, string> = {
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  xxl: 'w-10 h-10',
};

const CheckboxCatto = forwardRef<HTMLInputElement, CheckboxCattoProps>(
  (
    {
      id,
      checked,
      onChange,
      disabled = false,
      checkboxSize = 'md',
      className,
      label,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) => {
    return (
      <label
        htmlFor={id}
        className={cn(
          'relative inline-flex items-center cursor-pointer group',
          label && 'gap-2',
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          id={id}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          aria-label={!label ? ariaLabel : undefined}
          {...rest}
        />
        <div
          className={cn(
            'flex items-center justify-center border-2 rounded transition-colors',
            'group-focus-within:ring-2 group-focus-within:ring-theme-primary',
            checked
              ? 'bg-theme-secondary border-theme-secondary'
              : 'bg-transparent border-theme-primary',
            disabled && 'opacity-50 cursor-not-allowed',
            sizeMap[checkboxSize],
            className,
          )}
          aria-hidden="true"
        >
          {checked && (
            <svg
              className="w-3 h-3 text-theme-on-secondary pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        {label && (
          <span
            className={cn(
              'text-theme-text select-none',
              disabled && 'opacity-50',
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  },
);

CheckboxCatto.displayName = 'CheckboxCatto';

export default CheckboxCatto;
