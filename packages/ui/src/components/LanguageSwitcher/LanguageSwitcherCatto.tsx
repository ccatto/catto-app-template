// @catto/ui - LanguageSwitcherCatto Component
// Headless/presentational language switcher - i18n logic stays in the app
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../utils';

// ============================================
// Types
// ============================================

export interface LanguageOption {
  /** Unique identifier for the language (e.g., 'en', 'es') */
  value: string;
  /** Display name (e.g., 'English', 'Español') */
  label: string;
  /** Optional flag emoji or icon (e.g., '🇺🇸') */
  flag?: string;
}

export type LanguageSwitcherVariant = 'dropdown' | 'buttons' | 'compact';
export type LanguageSwitcherSize = 'sm' | 'md' | 'lg';

export interface LanguageSwitcherCattoProps {
  /** Available languages to choose from */
  languages: LanguageOption[];
  /** Currently selected language value */
  currentLanguage: string;
  /** Callback when language is changed */
  onChange: (languageValue: string) => void;
  /** Display variant */
  variant?: LanguageSwitcherVariant;
  /** Size of the switcher */
  size?: LanguageSwitcherSize;
  /** Show flag icons/emojis */
  showFlags?: boolean;
  /** Additional className for the container */
  className?: string;
  /** Custom leading icon for dropdown variant (overrides spinning globe) */
  leadingIcon?: React.ReactNode;
  /** Accessible label for the switcher */
  'aria-label'?: string;
}

// ============================================
// Sub-components
// ============================================

/**
 * SpinningEarthGlobe - Cycles through 🌍 🌎 🌏 to simulate Earth rotation
 */
const SpinningEarthGlobe = ({ size = 24 }: { size?: number }) => {
  const [globeIndex, setGlobeIndex] = useState(0);
  const globes = ['🌍', '🌎', '🌏'];

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobeIndex((prev) => (prev + 1) % 3);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="inline-block animate-pulse"
      style={{ fontSize: size, lineHeight: 1 }}
      role="img"
      aria-label="Rotating Earth"
    >
      {globes[globeIndex]}
    </span>
  );
};

// Size configurations
const sizeConfig = {
  sm: {
    trigger: 'px-2 py-1.5 text-sm gap-1.5',
    flag: 'text-lg',
    icon: 'h-3 w-3',
    globe: 20,
    option: 'px-3 py-2 text-sm gap-2',
  },
  md: {
    trigger: 'px-3 py-2 text-base gap-2',
    flag: 'text-xl',
    icon: 'h-4 w-4',
    globe: 24,
    option: 'px-4 py-2.5 text-base gap-2.5',
  },
  lg: {
    trigger: 'px-4 py-2.5 text-lg gap-2.5',
    flag: 'text-2xl',
    icon: 'h-5 w-5',
    globe: 32,
    option: 'px-4 py-3 text-lg gap-3',
  },
};

// ============================================
// Main Component
// ============================================

/**
 * LanguageSwitcherCatto - Headless language switcher component
 *
 * Provides the UI for switching languages. The actual i18n routing/logic
 * should be handled by the parent application via the `onChange` callback.
 *
 * Three variants:
 * - dropdown: Full dropdown with optional spinning globe
 * - buttons: Inline buttons for each language
 * - compact: Minimal dropdown trigger
 */
const LanguageSwitcherCatto: React.FC<LanguageSwitcherCattoProps> = ({
  languages,
  currentLanguage,
  onChange,
  variant = 'dropdown',
  size = 'md',
  showFlags = true,
  className = '',
  leadingIcon,
  'aria-label': ariaLabel = 'Select language',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sizes = sizeConfig[size];

  // Get current language details
  const currentLang = languages.find((l) => l.value === currentLanguage);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  // ============================================
  // Buttons Variant
  // ============================================
  if (variant === 'buttons') {
    return (
      <div
        className={cn(
          'flex flex-wrap items-center justify-center gap-2',
          className,
        )}
        role="radiogroup"
        aria-label={ariaLabel}
      >
        {languages.map((lang) => {
          const isSelected = lang.value === currentLanguage;
          return (
            <button
              key={lang.value}
              onClick={() => onChange(lang.value)}
              className={cn(
                'rounded-lg font-medium transition-colors',
                // Smaller on mobile, normal on larger screens
                'px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm gap-1.5',
                isSelected
                  ? 'bg-theme-secondary text-theme-on-secondary'
                  : 'bg-theme-surface-secondary text-theme-text hover:bg-theme-surface-secondary/80',
              )}
              role="radio"
              aria-checked={isSelected}
            >
              {showFlags && lang.flag && (
                <span className="text-base sm:text-lg">{lang.flag}</span>
              )}
              {lang.label}
            </button>
          );
        })}
      </div>
    );
  }

  // ============================================
  // Dropdown / Compact Variants
  // ============================================
  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex items-center justify-between rounded-lg border-2 transition-colors',
          'border-theme-border bg-theme-surface hover:bg-theme-surface-secondary',
          sizes.trigger,
          isOpen && 'ring-2 ring-theme-primary',
          variant === 'compact' ? 'min-w-0' : 'w-full',
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
      >
        <span className="flex items-center gap-2 truncate">
          {/* Leading icon - spinning globe or custom */}
          {variant === 'dropdown' && (
            <span className="shrink-0">
              {leadingIcon || <SpinningEarthGlobe size={sizes.globe} />}
            </span>
          )}
          {/* Flag */}
          {showFlags && currentLang?.flag && (
            <span className={cn('leading-none', sizes.flag)}>
              {currentLang.flag}
            </span>
          )}
          {/* Label */}
          <span className="text-theme-text truncate">{currentLang?.label}</span>
        </span>
        <ChevronDown
          className={cn(
            'shrink-0 text-theme-text-subtle transition-transform duration-200',
            sizes.icon,
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={cn(
            'absolute z-[1000] mt-1 overflow-hidden rounded-lg border shadow-lg',
            'border-theme-border bg-theme-surface',
            variant === 'compact'
              ? 'right-0 min-w-max'
              : 'left-0 right-0 w-full',
          )}
        >
          {languages.map((lang) => {
            const isSelected = lang.value === currentLanguage;
            return (
              <button
                key={lang.value}
                onClick={() => {
                  onChange(lang.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between text-left transition-colors',
                  sizes.option,
                  isSelected
                    ? 'bg-theme-surface-secondary text-theme-text'
                    : 'text-theme-text-muted hover:bg-theme-surface-secondary',
                )}
                role="option"
                aria-selected={isSelected}
              >
                <span className="flex items-center gap-2">
                  {showFlags && lang.flag && (
                    <span className={cn('leading-none', sizes.flag)}>
                      {lang.flag}
                    </span>
                  )}
                  <span>{lang.label}</span>
                </span>
                {isSelected && (
                  <Check
                    className={cn(
                      'shrink-0 text-theme-text-subtle',
                      sizes.icon,
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcherCatto;

// Also export the SpinningEarthGlobe for use in custom implementations
export { SpinningEarthGlobe };
