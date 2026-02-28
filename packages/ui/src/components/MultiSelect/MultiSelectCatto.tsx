'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

export interface MultiSelectOption {
  /** Unique value for the option */
  value: string;
  /** Display label */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Optional color circle (hex color) */
  color?: string;
  /** Optional secondary text/description */
  description?: string;
}

export interface MultiSelectCattoProps {
  /** Available options */
  options: MultiSelectOption[];
  /** Currently selected values */
  selectedValues: string[];
  /** Callback when selection changes */
  onChange: (values: string[]) => void;
  /** Allow multiple selections (default: true) */
  multiple?: boolean;
  /** Placeholder text when nothing selected */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Error message */
  error?: string;
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Maximum selections allowed */
  maxSelections?: number;
  /** Show Select All / Clear buttons */
  showSelectAll?: boolean;
  /** Enable search input */
  searchable?: boolean;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Message when no options available */
  emptyMessage?: string;
  /** Message when search has no results */
  noResultsMessage?: string;
  /** Component variant */
  variant?: 'default' | 'primary' | 'outline';
  /** Component size */
  size?: 'sm' | 'md' | 'lg';
  /** Component width */
  width?: 'auto' | 'full';
  /** Additional className */
  className?: string;
  /** Custom option renderer */
  renderOption?: (
    option: MultiSelectOption,
    isSelected: boolean,
  ) => React.ReactNode;
  /** Custom chip renderer */
  renderChip?: (
    option: MultiSelectOption,
    onRemove: () => void,
  ) => React.ReactNode;
  /** Start with the dropdown open */
  defaultOpen?: boolean;
}

/**
 * MultiSelectCatto - Generic multi-select dropdown component
 *
 * Features:
 * - Single or multi-select mode
 * - Search/filter functionality
 * - Select All / Clear buttons
 * - Selected items shown as removable chips
 * - Optional color circles for options
 * - Disabled options support
 * - Full dark mode support
 *
 * @example
 * // Multi-select with search
 * <MultiSelectCatto
 *   options={teamOptions}
 *   selectedValues={selectedTeams}
 *   onChange={setSelectedTeams}
 *   searchable
 *   showSelectAll
 *   placeholder="Select teams..."
 * />
 *
 * // Single select mode
 * <MultiSelectCatto
 *   options={options}
 *   selectedValues={selected ? [selected] : []}
 *   onChange={(vals) => setSelected(vals[0])}
 *   multiple={false}
 *   placeholder="Choose one..."
 * />
 */
const MultiSelectCatto = ({
  options,
  selectedValues,
  onChange,
  multiple = true,
  placeholder = 'Select...',
  disabled = false,
  error,
  label,
  helperText,
  isLoading = false,
  maxSelections,
  showSelectAll = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options available',
  noResultsMessage = 'No results found',
  variant = 'default',
  size = 'md',
  width = 'full',
  className = '',
  renderOption,
  renderChip,
  defaultOpen = false,
}: MultiSelectCattoProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    const lowerSearch = searchTerm.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lowerSearch) ||
        opt.description?.toLowerCase().includes(lowerSearch),
    );
  }, [options, searchTerm]);

  // Get selected options objects
  const selectedOptions = useMemo(
    () => options.filter((opt) => selectedValues.includes(opt.value)),
    [options, selectedValues],
  );

  // Count of selectable (non-disabled) options
  const selectableOptions = useMemo(
    () => filteredOptions.filter((opt) => !opt.disabled),
    [filteredOptions],
  );

  // Check if all selectable options are selected
  const allSelected = useMemo(
    () =>
      selectableOptions.length > 0 &&
      selectableOptions.every((opt) => selectedValues.includes(opt.value)),
    [selectableOptions, selectedValues],
  );

  // Toggle single option
  const handleToggle = useCallback(
    (value: string) => {
      if (multiple) {
        if (selectedValues.includes(value)) {
          onChange(selectedValues.filter((v) => v !== value));
        } else {
          if (maxSelections && selectedValues.length >= maxSelections) {
            return; // Don't add if at max
          }
          onChange([...selectedValues, value]);
        }
      } else {
        onChange([value]);
        setIsOpen(false);
        setSearchTerm('');
      }
    },
    [multiple, selectedValues, onChange, maxSelections],
  );

  // Remove from selection (for chips)
  const handleRemove = useCallback(
    (value: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(selectedValues.filter((v) => v !== value));
    },
    [selectedValues, onChange],
  );

  // Select all available options
  const handleSelectAll = useCallback(() => {
    const newValues = new Set(selectedValues);
    selectableOptions.forEach((opt) => {
      if (maxSelections && newValues.size >= maxSelections) return;
      newValues.add(opt.value);
    });
    onChange(Array.from(newValues));
  }, [selectableOptions, selectedValues, onChange, maxSelections]);

  // Clear all selections
  const handleClearAll = useCallback(() => {
    onChange([]);
  }, [onChange]);

  // Size classes
  const sizeClasses = {
    sm: 'min-h-[36px] text-sm',
    md: 'min-h-[42px] text-base',
    lg: 'min-h-[48px] text-lg',
  };

  // Width classes
  const widthClasses = {
    auto: 'w-auto min-w-[200px]',
    full: 'w-full',
  };

  // Variant border classes
  const variantClasses = {
    default: error ? 'border-red-500' : 'border-theme-border',
    primary: error ? 'border-red-500' : 'border-theme-secondary',
    outline: error ? 'border-red-500' : 'border-theme-border-strong',
  };

  // Default option renderer
  const defaultRenderOption = (
    option: MultiSelectOption,
    isSelected: boolean,
  ) => {
    const isDisabledByMax =
      !isSelected &&
      maxSelections !== undefined &&
      selectedValues.length >= maxSelections;
    const isOptionDisabled = option.disabled || isDisabledByMax;

    return (
      <button
        key={option.value}
        type="button"
        onClick={() => !isOptionDisabled && handleToggle(option.value)}
        disabled={isOptionDisabled}
        className={`
          w-full flex items-center gap-3 px-3 py-2 text-left transition-colors
          ${
            isSelected
              ? 'bg-theme-secondary-subtle'
              : 'hover:bg-theme-surface-secondary'
          }
          ${
            isOptionDisabled
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
          }
        `}
      >
        {/* Checkbox indicator */}
        <div
          className={`
          flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
          ${
            isSelected
              ? 'bg-theme-secondary border-theme-secondary'
              : 'border-theme-border'
          }
        `}
        >
          {isSelected && <Check className="w-3 h-3 text-theme-on-secondary" />}
        </div>

        {/* Color circle */}
        {option.color && (
          <div
            className="flex-shrink-0 w-6 h-6 rounded-full border border-theme-border"
            style={{ backgroundColor: option.color }}
          />
        )}

        {/* Label and description */}
        <div className="flex-1 min-w-0">
          <span className="block truncate font-medium text-theme-text">
            {option.label}
          </span>
          {option.description && (
            <span className="block truncate text-xs text-theme-text-muted">
              {option.description}
            </span>
          )}
        </div>
      </button>
    );
  };

  // Default chip renderer
  // NOTE: Uses <span> with role="button" instead of <button> to avoid
  // invalid nested button HTML (chips render inside the trigger button)
  const defaultRenderChip = (
    option: MultiSelectOption,
    onRemove: () => void,
  ) => (
    <span
      key={option.value}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-theme-secondary-subtle text-theme-secondary text-sm"
    >
      {option.color && (
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: option.color }}
        />
      )}
      <span className="truncate max-w-[120px]">{option.label}</span>
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }
        }}
        className="flex-shrink-0 p-0.5 hover:bg-theme-secondary-subtle rounded-full transition-colors cursor-pointer"
      >
        <X className="w-3 h-3" />
      </span>
    </span>
  );

  return (
    <div
      className={`relative ${widthClasses[width]} ${className}`}
      ref={containerRef}
    >
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-theme-text-muted mb-1">
          {label}
          {maxSelections && multiple && (
            <span className="ml-2 text-xs text-theme-text-subtle">
              ({selectedValues.length}/{maxSelections})
            </span>
          )}
        </label>
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          ${widthClasses[width]} flex items-center justify-between ${
            sizeClasses[size]
          } px-3 py-2
          bg-theme-surface border rounded-lg
          ${variantClasses[variant]}
          ${
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer hover:border-theme-border-strong'
          }
          focus:outline-none focus:ring-2 focus:ring-theme-secondary
        `}
      >
        <div className="flex flex-wrap gap-1 flex-1 min-w-0 max-h-24 overflow-y-auto scrollbar-thin">
          {isLoading ? (
            <span className="text-theme-text-subtle">Loading...</span>
          ) : selectedOptions.length > 0 ? (
            multiple ? (
              // Show chips for multi-select
              selectedOptions.map((opt) =>
                renderChip
                  ? renderChip(opt, () =>
                      onChange(selectedValues.filter((v) => v !== opt.value)),
                    )
                  : defaultRenderChip(opt, () =>
                      onChange(selectedValues.filter((v) => v !== opt.value)),
                    ),
              )
            ) : (
              // Show single selected item for single-select
              <span className="flex items-center gap-2 text-theme-text">
                {selectedOptions[0].color && (
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: selectedOptions[0].color }}
                  />
                )}
                {selectedOptions[0].label}
              </span>
            )
          ) : (
            <span className="text-theme-text-subtle">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`flex-shrink-0 w-5 h-5 ml-2 text-theme-text-subtle transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-theme-surface border border-theme-border rounded-lg shadow-lg overflow-hidden">
          {/* Search input */}
          {searchable && (
            <div className="p-2 border-b border-theme-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-text-subtle" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-theme-border bg-theme-surface text-theme-text focus:ring-2 focus:ring-theme-secondary focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Select All / Clear buttons */}
          {showSelectAll && multiple && selectableOptions.length > 0 && (
            <div className="flex items-center justify-between px-3 py-2 border-b border-theme-border bg-theme-surface-secondary">
              <span className="text-xs text-theme-text-muted">
                {selectedValues.length} selected
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  disabled={
                    allSelected ||
                    (maxSelections !== undefined &&
                      selectedValues.length >= maxSelections)
                  }
                  className="text-xs text-theme-secondary hover:text-theme-secondary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Select All
                </button>
                <span className="text-theme-border">|</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={selectedValues.length === 0}
                  className="text-xs text-theme-text-muted hover:text-theme-text disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Options list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-theme-text-muted">
                {options.length === 0 ? emptyMessage : noResultsMessage}
              </div>
            ) : (
              filteredOptions.map((option) =>
                renderOption
                  ? renderOption(option, selectedValues.includes(option.value))
                  : defaultRenderOption(
                      option,
                      selectedValues.includes(option.value),
                    ),
              )
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {/* Helper text */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-theme-text-muted">{helperText}</p>
      )}
    </div>
  );
};

export default MultiSelectCatto;
