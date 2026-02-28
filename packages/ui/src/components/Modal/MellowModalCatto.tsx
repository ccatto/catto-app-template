// @catto/ui - MellowModalCatto Component
'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { LucideIcon, X } from 'lucide-react';
import { DEFAULT_MODAL_LABELS, type ModalLabels } from '../../i18n/defaults';
import LoadingCircleOrangeFancyCatto from '../Loading/LoadingCircleOrangeFancyCatto';

interface Theme {
  background: string;
  border: string;
  title: string;
  content: string;
  closeButton: string;
  overlay: string;
}

export type MellowModalThemeType =
  | 'primary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'neutral'
  | 'midnightEmber'
  | 'branded';

export type MellowModalSizeType = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export type MellowModalPosition = 'center' | 'top' | 'bottom';

const THEMES: Record<MellowModalThemeType, Theme> = {
  // Primary - uses theme primary color
  primary: {
    background: 'bg-theme-primary-subtle',
    border: 'border-theme-primary',
    title: 'text-theme-primary',
    content: 'text-theme-text',
    closeButton: 'hover:bg-theme-primary-subtle',
    overlay: 'bg-black/20 dark:bg-black/40',
  },
  // Status: danger - fixed red (consistent across themes)
  danger: {
    background: 'bg-red-50 dark:bg-gray-800',
    border: 'border-red-200 dark:border-red-700',
    title: 'text-red-800 dark:text-red-200',
    content: 'text-red-700 dark:text-red-300',
    closeButton: 'hover:bg-red-100 dark:hover:bg-red-900/50',
    overlay: 'bg-red-900/10 dark:bg-red-900/40',
  },
  // Status: success - fixed green (consistent across themes)
  success: {
    background: 'bg-green-50 dark:bg-gray-800',
    border: 'border-green-200 dark:border-green-700',
    title: 'text-green-800 dark:text-green-200',
    content: 'text-green-700 dark:text-green-300',
    closeButton: 'hover:bg-green-100 dark:hover:bg-green-900/50',
    overlay: 'bg-green-900/10 dark:bg-green-900/40',
  },
  // Status: warning - fixed yellow (consistent across themes)
  warning: {
    background: 'bg-yellow-50 dark:bg-gray-800',
    border: 'border-yellow-200 dark:border-yellow-600 border-8',
    title: 'text-yellow-800 dark:text-yellow-200',
    content: 'text-yellow-700 dark:text-yellow-300',
    closeButton: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/50',
    overlay: 'bg-yellow-900/30 dark:bg-yellow-900/40',
  },
  // Neutral - surface colors
  neutral: {
    background: 'bg-theme-surface',
    border: 'border-theme-border',
    title: 'text-theme-text',
    content: 'text-theme-text-muted',
    closeButton: 'hover:bg-theme-surface-secondary',
    overlay: 'bg-gray-900/30',
  },
  // Special: midnightEmber - fixed styling
  midnightEmber: {
    overlay: `
    bg-blue-900/20 dark:bg-blue-900/40
  `,
    border: `
    border-blue-700 dark:border-orange-600
  `,
    background: `
    bg-blue-900 dark:bg-blue-950
  `,
    content: `
    text-orange-100 dark:text-orange-50
  `,
    title: `
    text-orange-200 dark:text-orange-100
  `,
    closeButton: `
    text-blue-400 dark:text-orange-400
    hover:text-blue-300 dark:hover:text-orange-300
    transition-colors duration-200 ease-in-out
  `,
  },
  // Branded - uses theme secondary/accent color
  branded: {
    background: 'bg-theme-surface',
    border: 'border-theme-secondary',
    title: 'text-theme-text',
    content: 'text-theme-text-muted',
    closeButton: 'hover:bg-theme-secondary-subtle',
    overlay: 'bg-gray-900/30',
  },
};

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
} as const;

// Focus ring colors per theme - explicit classes for Tailwind scanner
const FOCUS_RING_CLASSES: Record<MellowModalThemeType, string> = {
  primary: 'focus:ring-theme-primary',
  danger: 'focus:ring-red-500',
  success: 'focus:ring-green-500',
  warning: 'focus:ring-yellow-500',
  neutral: 'focus:ring-theme-border-strong',
  midnightEmber: 'focus:ring-theme-secondary',
  branded: 'focus:ring-theme-secondary',
} as const;

// Fallback loading component
const LoadingFallback: React.FC<{ theme: MellowModalThemeType }> = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <LoadingCircleOrangeFancyCatto />
    </div>
  );
};

interface IMellowModalContentCattoProps {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  icon?: LucideIcon;
  iconSize?: number;
  theme: MellowModalThemeType;
}

const MellowModalContentCatto: React.FC<IMellowModalContentCattoProps> = ({
  title,
  children,
  footer,
  icon: Icon,
  iconSize = 24,
  theme = 'midnightEmber',
}) => {
  const currentTheme = THEMES[theme];

  return (
    <div className="flex items-start gap-4">
      {Icon && (
        <div className={`shrink-0 ${currentTheme.content}`}>
          <Icon
            size={iconSize}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      )}

      <div className="min-w-0 flex-1">
        {title && (
          <div className="mb-4">
            <h2
              id="modal-title"
              className={`text-lg font-semibold ${currentTheme.title} line-clamp-2`}
            >
              {title}
            </h2>
          </div>
        )}

        <div className={`${currentTheme.content} prose prose-sm max-w-none`}>
          {children}
        </div>

        {footer && (
          <div className="mt-6 border-t border-theme-border pt-4">{footer}</div>
        )}
      </div>
    </div>
  );
};

export interface MellowModalCattoProps {
  /** Controls whether the modal is visible */
  isOpen: boolean;
  /** Callback when the modal should close */
  onClose: () => void;
  /** Modal title - can be string or React node */
  title?: string | React.ReactNode;
  /** Modal content */
  children: React.ReactNode;
  /** Optional footer content (e.g., action buttons) */
  footer?: React.ReactNode;
  /** Color theme for the modal */
  theme?: MellowModalThemeType;
  /** Size of the modal */
  size?: MellowModalSizeType;
  /** Auto-close after specified seconds */
  autoCloseTime?: number;
  /** Additional CSS classes */
  className?: string;
  /** Optional Lucide icon to display */
  icon?: LucideIcon;
  /** Size of the icon */
  iconSize?: number;
  /** Vertical position of the modal */
  position?: MellowModalPosition;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Whether pressing Escape closes the modal */
  closeOnEscape?: boolean;
  /** Whether clicking outside closes the modal */
  closeOnOutsideClick?: boolean;
  /** Whether to prevent body scroll when open */
  preventScroll?: boolean;
  /** Callback when close animation completes */
  onAnimationComplete?: () => void;
  /** Custom suspense fallback component */
  suspenseFallback?: React.ReactNode;
  /** i18n labels for translatable strings */
  labels?: ModalLabels;
  /** Whether modal content should scroll when it exceeds max height (default: false) */
  scrollable?: boolean;
}

const MellowModalCatto: React.FC<MellowModalCattoProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  theme = 'primary',
  size = 'md',
  autoCloseTime,
  className = '',
  icon,
  iconSize = 24,
  position = 'center',
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  preventScroll = true,
  onAnimationComplete,
  suspenseFallback,
  labels,
  scrollable = false,
}) => {
  // Merge provided labels with defaults
  const resolvedLabels = {
    ...DEFAULT_MODAL_LABELS,
    ...labels,
  };
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentTheme = THEMES[theme];
  const sizeClass = SIZES[size];

  useEffect(() => {
    if (!closeOnEscape) {
      return;
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  useEffect(() => {
    if (!preventScroll) {
      return;
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, preventScroll]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        onAnimationComplete?.();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onAnimationComplete]);

  useEffect(() => {
    if (autoCloseTime && isOpen) {
      const timer = setTimeout(() => onClose(), autoCloseTime * 1000);
      return () => clearTimeout(timer);
    }
  }, [autoCloseTime, isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnOutsideClick && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnOutsideClick, onClose],
  );

  if (!shouldRender) {
    return null;
  }

  const positionClasses = {
    center: 'items-center',
    top: 'items-start pt-16',
    bottom: 'items-end pb-16',
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center p-4 transition-all duration-300 ${
        positionClasses[position]
      } ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-opacity-60 fixed inset-0 bg-slate-900 transition-opacity duration-300 ${
          currentTheme.overlay
        } ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      />

      <div
        className={`relative w-full ${sizeClass} ${currentTheme.background} ${
          currentTheme.border
        } rounded-lg border p-6 shadow-2xl shadow-gray-700 transition-all duration-300 ${
          isAnimating
            ? 'translate-y-0 scale-100 opacity-100'
            : position === 'bottom'
              ? 'translate-y-4'
              : position === 'top'
                ? '-translate-y-4'
                : 'translate-y-4'
        } scale-95 opacity-0 ${
          scrollable ? 'max-h-[85vh] overflow-y-auto' : ''
        } ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 rounded-full p-1 ${currentTheme.closeButton} transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden ${FOCUS_RING_CLASSES[theme]}`}
            aria-label={resolvedLabels.closeButton}
          >
            <X className={`h-5 w-5 ${currentTheme.content}`} />
          </button>
        )}

        <Suspense
          fallback={suspenseFallback || <LoadingFallback theme={theme} />}
        >
          <MellowModalContentCatto
            title={title}
            icon={icon}
            iconSize={iconSize}
            theme={theme}
            footer={footer}
          >
            {children}
          </MellowModalContentCatto>
        </Suspense>
      </div>
    </div>
  );
};

export default MellowModalCatto;
