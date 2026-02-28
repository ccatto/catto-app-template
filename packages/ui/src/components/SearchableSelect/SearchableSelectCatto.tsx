'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Plus } from 'lucide-react';
import type { SelectOption } from '../../types';
import { cn } from '../../utils';

export type SearchableSelectSize = 'small' | 'medium' | 'large';
export type SearchableSelectWidth =
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
export type SearchableSelectVariant =
  | 'outlined'
  | 'filled'
  | 'minimal'
  | 'primary';
export type SearchableSelectTheme =
  | 'light'
  | 'sunset'
  | 'ocean'
  | 'forest'
  | 'dusk';

export interface SearchableSelectCattoProps {
  /** Array of options to select from */
  options: SelectOption[];
  /** Currently selected value */
  value: string;
  /** Callback when selection changes */
  onChange: (value: string) => void;
  /** Callback when creating a new option */
  onCreateNew?: (searchText: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Text shown for create new option */
  createNewText?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Size variant */
  size?: SearchableSelectSize;
  /** Color theme */
  theme?: SearchableSelectTheme;
  /** Width variant */
  width?: SearchableSelectWidth;
  /** Style variant */
  variant?: SearchableSelectVariant;
  /** Whether to allow creating new options */
  allowCreate?: boolean;
  /** Text shown when no options match search */
  noResultsText?: string;
}

// Theme classes for the component
const themeClasses: Record<SearchableSelectTheme, string> = {
  light: `
    bg-theme-surface
    border-theme-border
    text-theme-text
  `,
  sunset: `
    bg-theme-secondary-subtle
    border-theme-secondary
    text-theme-secondary
  `,
  ocean: `
    bg-theme-primary-subtle
    border-theme-primary
    text-theme-primary
  `,
  forest: `
    bg-green-50 dark:bg-green-900/30
    border-green-200 dark:border-green-700
    text-green-900 dark:text-green-100
  `,
  dusk: `
    bg-theme-surface
    border-theme-border
    text-theme-text
  `,
};

const SearchableSelectCatto = forwardRef<
  HTMLDivElement,
  SearchableSelectCattoProps
>(
  (
    {
      options,
      value,
      onChange,
      onCreateNew,
      placeholder = 'Search or select an option',
      createNewText = 'Create new',
      disabled = false,
      className = '',
      label,
      error,
      size = 'medium',
      theme = 'sunset',
      width = 'full',
      variant = 'outlined',
      allowCreate = false,
      noResultsText = 'No options found',
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredOptions, setFilteredOptions] =
      useState<SelectOption[]>(options);
    const internalContainerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Combine forwarded ref with internal ref
    const handleContainerRef = (node: HTMLDivElement | null) => {
      internalContainerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    // Size variations
    const sizeClasses = {
      small: 'h-8 text-sm',
      medium: 'h-10 text-base',
      large: 'h-12 text-lg',
    };

    const inputPaddingClasses = {
      small: 'px-2 py-1',
      medium: 'px-3 py-2',
      large: 'px-4 py-3',
    };

    // Width styles
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

    // Variant styles
    const variantClasses = {
      outlined: 'border',
      filled: 'border-0 border-b-2',
      minimal: 'border-0',
      primary:
        'border-2 border-theme-primary bg-theme-primary-subtle text-theme-primary hover:bg-theme-primary-subtle',
    };

    // Selected option from options
    const selectedOption = options.find((option) => option.value === value);

    // Update filtered options when search text or options change
    useEffect(() => {
      if (!searchText) {
        setFilteredOptions(options);
      } else {
        const filtered = options.filter((option) =>
          option.label.toLowerCase().includes(searchText.toLowerCase()),
        );
        setFilteredOptions(filtered);
      }
    }, [searchText, options]);

    // Reset search text when the dropdown is closed
    useEffect(() => {
      if (!isOpen) {
        setSearchText('');
      }
    }, [isOpen]);

    // Focus input when dropdown opens
    useEffect(() => {
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpen]);

    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          internalContainerRef.current &&
          !internalContainerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle key navigation within dropdown
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        event.preventDefault();
      } else if (event.key === 'ArrowDown' && isOpen) {
        event.preventDefault();
        const firstOption = optionRefs.current[0];
        firstOption?.focus();
      }
    };

    const handleOptionKeyDown = (
      event: React.KeyboardEvent<HTMLDivElement>,
      index: number,
    ) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextOption = optionRefs.current[index + 1];
        if (nextOption) {
          nextOption.focus();
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (index === 0) {
          inputRef.current?.focus();
        } else {
          const prevOption = optionRefs.current[index - 1];
          if (prevOption) {
            prevOption.focus();
          }
        }
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (index < filteredOptions.length) {
          onChange(filteredOptions[index].value);
          setIsOpen(false);
        } else if (allowCreate && onCreateNew && searchText) {
          onCreateNew(searchText);
          setIsOpen(false);
        }
      } else if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    // Get display label for the input field
    const getDisplayValue = () => {
      if (searchText && isOpen) {
        return searchText;
      }
      return selectedOption ? selectedOption.label : '';
    };

    // Handle click on the container
    const handleContainerClick = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen && inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
      if (!isOpen) {
        setIsOpen(true);
      }
    };

    // Get option classes
    const getOptionClasses = (isSelected: boolean) =>
      cn(
        inputPaddingClasses[size],
        'flex items-center justify-between cursor-pointer',
        isSelected
          ? 'bg-theme-primary-subtle text-theme-primary'
          : 'hover:bg-theme-surface-secondary text-theme-text',
      );

    return (
      <div
        className={cn('relative', widthClasses[width], className)}
        ref={handleContainerRef}
      >
        {label && (
          <label
            className={cn(
              'block font-medium mb-1 text-theme-text',
              size === 'small'
                ? 'text-sm'
                : size === 'large'
                  ? 'text-lg'
                  : 'text-base',
            )}
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            'flex items-center rounded-md transition-all duration-200',
            'focus-within:outline-none focus-within:ring-2',
            variantClasses[variant],
            sizeClasses[size],
            variant !== 'primary' && themeClasses[theme],
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            error && 'border-red-500 ring-1 ring-red-500',
            isOpen && 'ring-2 ring-theme-primary',
          )}
          onClick={handleContainerClick}
        >
          <input
            ref={inputRef}
            type="text"
            className={cn(
              'w-full bg-transparent outline-none',
              inputPaddingClasses[size],
              disabled && 'cursor-not-allowed',
              'placeholder-theme-text-subtle',
            )}
            placeholder={placeholder}
            value={getDisplayValue()}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            autoComplete="off"
            onClick={(e) => {
              e.stopPropagation();
              if (!isOpen) {
                setIsOpen(true);
              }
            }}
          />
          <ChevronDown
            className={cn(
              'h-4 w-4 ml-2 mr-3 transition-transform duration-200',
              'text-theme-text-muted',
              isOpen && 'rotate-180 transform',
            )}
          />
        </div>

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

        {isOpen && (
          <div
            className={cn(
              'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border shadow-lg',
              'bg-theme-surface border-theme-border',
            )}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  className={getOptionClasses(option.value === value)}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => handleOptionKeyDown(e, index)}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <span>{option.label}</span>
                  {option.value === value && (
                    <Check className="h-4 w-4 text-theme-primary" />
                  )}
                </div>
              ))
            ) : (
              <div
                className={cn(
                  inputPaddingClasses[size],
                  'text-theme-text-muted italic',
                )}
              >
                {noResultsText}
              </div>
            )}

            {allowCreate &&
              searchText &&
              filteredOptions.length === 0 &&
              onCreateNew && (
                <div
                  className={cn(
                    inputPaddingClasses[size],
                    'flex items-center cursor-pointer',
                    'text-theme-primary',
                    'hover:bg-theme-primary-subtle',
                  )}
                  onClick={() => {
                    onCreateNew(searchText);
                    setIsOpen(false);
                  }}
                  ref={(el) => {
                    optionRefs.current[filteredOptions.length] = el;
                  }}
                  tabIndex={0}
                  onKeyDown={(e) =>
                    handleOptionKeyDown(e, filteredOptions.length)
                  }
                  role="option"
                  aria-selected={false}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span>{`${createNewText}: "${searchText}"`}</span>
                </div>
              )}
          </div>
        )}
      </div>
    );
  },
);

SearchableSelectCatto.displayName = 'SearchableSelectCatto';

export default SearchableSelectCatto;
