// @catto/ui - DrawerCatto Component
// Generic slide-in drawer with Portal support
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { DEFAULT_DRAWER_LABELS, DrawerLabels } from '../../i18n/defaults';
import { cn } from '../../utils';

// ============================================
// Types
// ============================================

export type DrawerSide = 'left' | 'right';
export type DrawerWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerCattoProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Callback when the drawer should close */
  onClose: () => void;
  /** Which side the drawer slides in from */
  side?: DrawerSide;
  /** Width of the drawer */
  width?: DrawerWidth;
  /** Custom width class (overrides width prop) */
  customWidth?: string;
  /** Custom height class (overrides default h-full) - useful for mobile drawers that stop above nav */
  customHeight?: string;
  /** Drawer content */
  children: React.ReactNode;
  /** Optional header title */
  title?: string;
  /** Optional header content (replaces default header if provided) */
  header?: React.ReactNode;
  /** Show close button in header */
  showCloseButton?: boolean;
  /** Close button variant - 'default' uses slate colors, 'danger' uses red */
  closeButtonVariant?: 'default' | 'danger';
  /** Show dark overlay behind drawer */
  overlay?: boolean;
  /** Custom overlay className (e.g., 'bottom-20' for partial overlay) */
  overlayClassName?: string;
  /** Close when clicking overlay */
  closeOnOverlayClick?: boolean;
  /** Close when pressing Escape key */
  closeOnEscape?: boolean;
  /** Prevent body scroll when open */
  preventScroll?: boolean;
  /** Render via Portal to document.body */
  usePortal?: boolean;
  /** Additional className for the drawer container */
  className?: string;
  /** Additional className for the content area */
  contentClassName?: string;
  /** z-index for the drawer (default: 50) */
  zIndex?: number;
  /** Accessible label for the drawer */
  'aria-label'?: string;
  /** i18n labels for internationalization */
  labels?: DrawerLabels;
}

// Width configurations
const widthConfig: Record<DrawerWidth, string> = {
  sm: 'w-64',
  md: 'w-80',
  lg: 'w-96',
  xl: 'w-[28rem]',
  full: 'w-full',
};

/**
 * DrawerCatto - Generic slide-in drawer component
 *
 * Features:
 * - Slides in from left or right
 * - Optional dark overlay with click-to-close
 * - ESC key support
 * - Body scroll lock when open
 * - Portal rendering to escape z-index stacking
 * - Theme-aware styling
 * - Configurable width
 *
 * Usage:
 * ```tsx
 * <DrawerCatto
 *   isOpen={isDrawerOpen}
 *   onClose={() => setIsDrawerOpen(false)}
 *   side="left"
 *   title="Navigation"
 * >
 *   <nav>...</nav>
 * </DrawerCatto>
 * ```
 */
const DrawerCatto: React.FC<DrawerCattoProps> = ({
  isOpen,
  onClose,
  side = 'left',
  width = 'md',
  customWidth,
  customHeight,
  children,
  title,
  header,
  showCloseButton = true,
  closeButtonVariant = 'default',
  overlay = true,
  overlayClassName,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventScroll = true,
  usePortal = true,
  className,
  contentClassName,
  zIndex = 50,
  'aria-label': ariaLabel,
  labels = {},
}) => {
  // Merge with defaults
  const mergedLabels = { ...DEFAULT_DRAWER_LABELS, ...labels };

  const [mounted, setMounted] = useState(false);

  // Track client-side mount for Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (!preventScroll) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, preventScroll]);

  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [closeOnEscape, onClose],
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleEscape]);

  // Handle overlay click
  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  // Width class
  const drawerWidth = customWidth || widthConfig[width];

  // Slide direction classes
  const slideClasses = {
    left: {
      base: 'left-0',
      closed: '-translate-x-full',
      open: 'translate-x-0',
    },
    right: {
      base: 'right-0',
      closed: 'translate-x-full',
      open: 'translate-x-0',
    },
  };

  const slideConfig = slideClasses[side];

  // Height/position class - default to top-0 h-full unless custom provided
  // customHeight can be used for special cases like "top-0 bottom-20" for drawers that don't extend to bottom
  const drawerHeight = customHeight || 'top-0 h-full';

  // Drawer content
  const drawerContent = (
    <>
      {/* Overlay */}
      {overlay && isOpen && (
        <div
          className={cn(
            'fixed inset-0 bg-black/50 transition-opacity duration-300',
            isOpen ? 'opacity-100' : 'opacity-0',
            overlayClassName,
          )}
          style={{ zIndex: zIndex - 1 }}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed transform shadow-xl transition-transform duration-300 ease-in-out',
          'bg-theme-surface',
          slideConfig.base,
          drawerWidth,
          drawerHeight,
          isOpen ? slideConfig.open : slideConfig.closed,
          className,
        )}
        style={{ zIndex }}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title || 'Drawer'}
      >
        {/* Header */}
        {(title || header || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-theme-border p-4">
            {header || (
              <h2 className="text-lg font-semibold text-theme-secondary">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'rounded-lg p-2 transition-all duration-200',
                  closeButtonVariant === 'danger'
                    ? [
                        // Base: Red icon
                        'text-red-500 dark:text-red-500',
                        // Hover: Lighter red bg, darker icon
                        'hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-600 dark:hover:text-red-400',
                        // Active/Click: Even more prominent
                        'active:bg-red-200 dark:active:bg-red-800/50 active:text-red-700 dark:active:text-red-300 active:scale-95',
                        // Focus ring in red
                        'focus:outline-none focus:ring-2 focus:ring-red-500/50',
                      ]
                    : [
                        'text-theme-text-subtle',
                        'hover:bg-theme-surface-secondary hover:text-theme-text',
                        'active:bg-theme-surface-tertiary active:scale-95',
                        'focus:outline-none focus:ring-2 focus:ring-theme-primary',
                      ],
                )}
                aria-label={mergedLabels.closeButton}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div
          className={cn(
            'h-[calc(100%-4rem)] overflow-y-auto',
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </>
  );

  // Use Portal or render inline
  if (usePortal) {
    // Only render portal after client-side mount
    if (!mounted) {
      return null;
    }
    return createPortal(drawerContent, document.body);
  }

  return drawerContent;
};

export default DrawerCatto;
