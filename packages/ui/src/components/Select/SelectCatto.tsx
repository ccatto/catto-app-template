// @catto/ui - SelectCatto Component
'use client';

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { DEFAULT_SELECT_LABELS, type SelectLabels } from '../../i18n/defaults';
import type { SelectOption } from '../../types';
import {
  clearTypeahead,
  handleKeyDown,
  handleOptionKeyDown,
  scrollOptionIntoContainer,
} from '../../utils/keyboard';

type SelectVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
type SelectSize = 'sm' | 'md' | 'lg';
type SelectTheme = 'light' | 'dark';
type SelectWidth =
  | 'auto'
  | 'full'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';

export interface SelectCattoProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
  variant?: SelectVariant;
  size?: SelectSize;
  theme?: SelectTheme;
  width?: SelectWidth;
  /** i18n labels for translatable strings */
  labels?: SelectLabels;
  /** Static icon to display at the start of the trigger button (e.g., Globe icon) */
  leadingIcon?: React.ReactNode;
  /** Whether to show the selected option's icon in the trigger (default: true) */
  showSelectedIcon?: boolean;
}

const SelectCatto = forwardRef<HTMLDivElement, SelectCattoProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder,
      disabled = false,
      className = '',
      label,
      error,
      variant = 'default',
      size = 'md',
      theme = 'dark',
      width = 'full',
      labels,
      leadingIcon,
      showSelectedIcon = true,
    },
    ref,
  ) => {
    // Merge provided labels with defaults
    const resolvedLabels = {
      ...DEFAULT_SELECT_LABELS,
      ...labels,
    };
    // Use explicit placeholder if provided, otherwise fall back to labels
    const resolvedPlaceholder = placeholder ?? resolvedLabels.placeholder;
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement | null>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
    // Stores the target option index when typeahead opens a closed dropdown
    const pendingFocusIndexRef = useRef<number>(-1);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
      if (options.length === 1 && !value) {
        onChange(options[0].value);
      }
    }, [options, onChange, value]);

    // Clear typeahead buffer when dropdown closes
    useEffect(() => {
      if (!isOpen) {
        clearTypeahead();
        pendingFocusIndexRef.current = -1;
      }
    }, [isOpen]);

    // When dropdown opens via typeahead, focus the matched option after render
    useEffect(() => {
      if (isOpen && pendingFocusIndexRef.current >= 0) {
        const idx = pendingFocusIndexRef.current;
        pendingFocusIndexRef.current = -1;
        // Use rAF to ensure option elements are in the DOM
        requestAnimationFrame(() => {
          const el = optionRefs.current[idx];
          if (el) {
            el.focus();
            scrollOptionIntoContainer(el);
          }
        });
      }
    }, [isOpen]);

    const selectedOption = options.find((option) => option.value === value);

    const getWidthStyle = () => {
      const widthClasses = {
        auto: 'w-auto',
        full: 'w-full',
        xs: 'w-20',
        sm: 'w-32',
        md: 'w-48',
        lg: 'w-64',
        xl: 'w-full md:w-96',
        '2xl': 'md:w-[32rem] w-full',
        '3xl': 'md:w-[48rem] w-full',
        '4xl': 'md:w-[64rem] w-full',
        '5xl': 'md:w-[80rem] w-full',
      };
      return widthClasses[width];
    };

    // Variant styles - uses theme tokens for brand colors
    const variantStyles = {
      light: {
        default:
          'border-theme-border bg-theme-surface hover:border-theme-border-strong',
        primary:
          'border-theme-primary bg-theme-primary-subtle hover:bg-theme-primary-subtle text-theme-primary',
        secondary:
          'border-theme-secondary bg-theme-secondary-subtle hover:bg-theme-secondary-subtle text-theme-secondary',
        outline:
          'border-2 border-theme-border bg-transparent hover:bg-theme-surface-secondary',
        ghost:
          'border-transparent bg-theme-surface-secondary hover:bg-theme-surface-tertiary',
      },
      dark: {
        default:
          'border-theme-border bg-theme-surface hover:border-theme-border-strong',
        primary:
          'border-theme-primary bg-theme-primary-subtle hover:bg-theme-primary-subtle text-theme-primary',
        secondary:
          'border-theme-secondary bg-theme-secondary-subtle hover:bg-theme-secondary-subtle text-theme-secondary',
        outline:
          'border-2 border-theme-border bg-transparent hover:bg-theme-surface-secondary',
        ghost:
          'border-transparent bg-theme-surface-secondary hover:bg-theme-surface-tertiary',
      },
    };

    const sizeStyles = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    };

    const getDropdownItemStyles = (isSelected: boolean) => {
      const baseStyles =
        'px-4 py-2 cursor-pointer flex items-center justify-between';

      // Dropdown item styles - uses theme tokens for brand colors
      const variantSpecificStyles = {
        light: {
          default: isSelected
            ? 'bg-theme-surface-secondary text-theme-text'
            : 'hover:bg-theme-surface-secondary text-theme-text-muted',
          primary: isSelected
            ? 'bg-theme-primary-subtle text-theme-primary'
            : 'hover:bg-theme-surface-secondary text-theme-text-muted',
          secondary: isSelected
            ? 'bg-theme-secondary-subtle text-theme-secondary'
            : 'hover:bg-theme-surface-secondary text-theme-text-muted',
          outline: isSelected
            ? 'bg-theme-surface-secondary text-theme-text'
            : 'hover:bg-theme-surface-secondary text-theme-text-muted',
          ghost: isSelected
            ? 'bg-theme-surface-tertiary text-theme-text'
            : 'hover:bg-theme-surface-secondary text-theme-text-muted',
        },
        dark: {
          default: isSelected
            ? 'bg-theme-surface-secondary text-theme-text'
            : 'hover:bg-theme-surface-secondary text-theme-text-muted',
          primary: isSelected
            ? 'bg-theme-primary-subtle text-theme-primary'
            : 'hover:bg-theme-surface-secondary text-theme-text-muted',
          secondary: isSelected
            ? 'bg-theme-secondary-subtle text-theme-secondary'
            : 'hover:bg-theme-surface-secondary text-theme-text-muted',
          outline: isSelected
            ? 'bg-theme-surface-secondary text-theme-text'
            : 'hover:bg-theme-surface-secondary text-theme-text-muted',
          ghost: isSelected
            ? 'bg-theme-surface-tertiary text-theme-text'
            : 'hover:bg-theme-surface-secondary text-theme-text-muted',
        },
      };

      return `${baseStyles} ${variantSpecificStyles[theme][variant]}`;
    };

    const getLabelStyles = () => {
      const baseStyles = 'block font-medium mb-1';
      const sizeStyle =
        size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';
      return `${baseStyles} ${sizeStyle} text-theme-text`;
    };

    const getPlaceholderStyles = () => {
      return 'text-theme-text-subtle';
    };

    // Generate unique ID for listbox
    const listboxId = `select-listbox-${React.useId()}`;

    // Combine forwarded ref with internal selectRef
    const handleRef = (node: HTMLDivElement | null) => {
      selectRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <div
        className={`relative ${
          isOpen ? 'z-[9999]' : 'z-auto'
        } ${getWidthStyle()} `}
        ref={handleRef}
      >
        {label && <label className={getLabelStyles()}>{label}</label>}
        <div
          className={`relative w-full ${className}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={(event) => {
            const pendingIndex = handleKeyDown(
              event,
              optionRefs,
              onChange,
              setIsOpen,
              options,
              isOpen,
            );
            if (pendingIndex >= 0) {
              pendingFocusIndexRef.current = pendingIndex;
            }
          }}
          role="combobox"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-label={label || resolvedPlaceholder}
        >
          <div
            className={`flex w-full cursor-pointer items-center justify-between rounded-lg transition-colors duration-200 ${
              sizeStyles[size]
            } ${variantStyles[theme][variant]} ${
              disabled ? 'cursor-not-allowed opacity-50' : ''
            } ${error ? 'border-red-500 ring-1 ring-red-500' : ''} ${
              isOpen ? 'ring-2 ring-theme-primary' : ''
            } border text-theme-text `}
          >
            <span className="flex items-center gap-2 truncate">
              {/* Static leading icon (e.g., Globe) */}
              {leadingIcon && (
                <span className="inline-flex shrink-0">{leadingIcon}</span>
              )}
              {/* Selected option's icon */}
              {showSelectedIcon && selectedOption?.icon && (
                <span className="inline-flex shrink-0">
                  {selectedOption.icon}
                </span>
              )}
              {/* Label text */}
              <span
                className={`block truncate ${
                  !selectedOption && options.length !== 1
                    ? getPlaceholderStyles()
                    : ''
                }`}
              >
                {selectedOption
                  ? selectedOption.label
                  : options.length === 1
                    ? options[0].label
                    : resolvedPlaceholder}
              </span>
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                isOpen ? 'rotate-180 transform' : ''
              } text-theme-text-subtle`}
            />
          </div>

          {isOpen && (
            <div
              role="listbox"
              id={listboxId}
              aria-label={label || resolvedPlaceholder}
              className={`absolute z-[9999] mt-1 max-h-60 overflow-auto rounded-lg border shadow-xl
              w-full min-w-max
              max-sm:fixed max-sm:left-2 max-sm:right-2 max-sm:w-auto max-sm:bottom-20
              border-theme-border bg-theme-surface`}
            >
              {options.map((option, index) => (
                <div
                  key={option.value}
                  className={getDropdownItemStyles(option.value === value)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  tabIndex={0}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  onKeyDown={(event) =>
                    handleOptionKeyDown(event, setIsOpen, optionRefs, isOpen)
                  }
                  role="option"
                  aria-selected={option.value === value}
                >
                  <span className="flex items-center gap-2">
                    {option.icon && (
                      <span className="inline-flex shrink-0">
                        {option.icon}
                      </span>
                    )}
                    <span className="block whitespace-nowrap">
                      {option.label}
                    </span>
                  </span>
                  {option.value === value && (
                    <Check className="h-4 w-4 shrink-0 text-theme-text-muted" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

SelectCatto.displayName = 'SelectCatto';

export default SelectCatto;
