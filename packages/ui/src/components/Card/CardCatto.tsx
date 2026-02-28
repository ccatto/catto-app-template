// @catto/ui - CardCatto Component
'use client';

import React, {
  lazy,
  ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { StyleWidth } from '../../types';

const LazyContent = lazy(() =>
  Promise.resolve({
    default: ({ children }: { children: ReactNode }) => <>{children}</>,
  }),
);

// Define padding variants
const paddingVariants = {
  none: '',
  xs: 'p-1',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
} as const;

type Variant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'midnightEmber'
  | 'glass'
  | 'gradient';

const cardVariants = cva('rounded-lg transition-all duration-200', {
  variants: {
    variant: {
      // Default - themed surface with secondary brand border
      default: 'bg-theme-surface text-theme-text border-theme-secondary',
      // Primary variant - subtle primary tint
      primary: 'bg-theme-primary-subtle text-theme-text border-theme-primary',
      // Status variants - fixed colors for consistency
      success:
        'bg-green-900/20 text-green-100 border-green-500 dark:bg-green-900/20 dark:text-green-100',
      warning:
        'bg-yellow-900/20 text-yellow-100 border-yellow-500 dark:bg-yellow-900/20 dark:text-yellow-100',
      danger:
        'bg-red-900/20 text-red-100 border-red-500 dark:bg-red-900/20 dark:text-red-100',
      info: 'bg-blue-900/20 text-blue-100 border-blue-500 dark:bg-blue-900/20 dark:text-blue-100',
      // Special variants
      midnightEmber: '',
      glass:
        'backdrop-blur-xs bg-theme-surface/30 text-theme-text border-theme-border',
      gradient:
        'bg-gradient-to-br from-[var(--catto-theme-primary)] to-[var(--catto-theme-secondary)] text-theme-on-primary border-theme-secondary',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
    padding: paddingVariants,
    elevation: {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    padding: 'none',
    elevation: 'md',
  },
});

type CardVariants = VariantProps<typeof cardVariants>;

export interface CardCattoProps extends CardVariants {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  isLoading?: boolean;
  headerComponent?: ReactNode;
  bodyComponent?: ReactNode;
  loadingComponent?: ReactNode;
  onClick?: () => void;
  interactive?: boolean;
  width?: StyleWidth;
  center?: boolean;
  showBorder?: boolean;
  disabled?: boolean;
  footer?: ReactNode;
  icon?: ReactNode;
  /** Alias for icon - displays in header next to title */
  headerIcon?: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  /** localStorage key for persisting collapsed state (e.g., 'dashboard-matches') */
  storageKey?: string;
  onCollapseChange?: (isCollapsed: boolean) => void;
  animate?: {
    initial?: object;
    animate?: object;
    exit?: object;
  };
  badge?: {
    text: string;
    variant?: Variant;
  };
  headerPadding?: keyof typeof paddingVariants;
  bodyPadding?: keyof typeof paddingVariants;
  /** Adds responsive outer padding wrapper (px-1 md:px-10). Default: true */
  withOuterPadding?: boolean;
}

const CardCatto = React.memo(
  ({
    title,
    description,
    children,
    className = '',
    headerClassName = '',
    bodyClassName = '',
    isLoading = false,
    headerComponent,
    bodyComponent,
    loadingComponent,
    onClick,
    variant = 'default',
    size = 'md',
    padding = 'none',
    elevation = 'md',
    interactive = false,
    width = 'md',
    center = true,
    showBorder = true,
    disabled = false,
    footer,
    icon,
    headerIcon,
    collapsible = false,
    defaultCollapsed = false,
    storageKey,
    onCollapseChange,
    animate,
    badge,
    headerPadding = 'md',
    bodyPadding = 'md',
    withOuterPadding = true,
  }: CardCattoProps) => {
    // Initialize collapsed state from localStorage if storageKey provided
    const [isCollapsed, setIsCollapsed] = useState(() => {
      if (typeof window === 'undefined') return defaultCollapsed;
      if (!collapsible || !storageKey) return defaultCollapsed;
      try {
        const stored = localStorage.getItem(`card-${storageKey}`);
        if (stored !== null) {
          return stored === 'collapsed';
        }
      } catch {
        // localStorage not available
      }
      return defaultCollapsed;
    });

    // Sync state to localStorage when it changes
    useEffect(() => {
      if (!collapsible || !storageKey) return;
      try {
        localStorage.setItem(
          `card-${storageKey}`,
          isCollapsed ? 'collapsed' : 'expanded',
        );
      } catch {
        // localStorage not available
      }
    }, [isCollapsed, collapsible, storageKey]);

    const handleCollapse = useCallback(() => {
      if (collapsible && !disabled) {
        setIsCollapsed((prev) => {
          const newState = !prev;
          onCollapseChange?.(newState);
          return newState;
        });
      }
    }, [collapsible, disabled, onCollapseChange]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (collapsible && !disabled) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCollapse();
          }
        }
      },
      [collapsible, disabled, handleCollapse],
    );

    const widthClasses = {
      xs: 'w-full md:max-w-xs',
      sm: 'w-full md:max-w-sm',
      md: 'w-full md:max-w-md',
      lg: 'w-full md:max-w-lg',
      xl: 'w-full md:max-w-xl',
      '2xl': 'w-full md:max-w-2xl',
      '3xl': 'w-full md:max-w-3xl',
      '4xl': 'w-full md:max-w-4xl',
      '5xl': 'w-full md:max-w-5xl',
      '6xl': 'w-full md:max-w-6xl',
      '7xl': 'w-full md:max-w-7xl',
      full: 'w-full',
      auto: 'w-auto',
    };

    const baseClasses = cardVariants({ variant, size, padding, elevation });

    const defaultLoadingState = (
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-3/4 rounded-sm bg-theme-surface-secondary"></div>
        <div className="space-y-2">
          <div className="h-3 rounded-sm bg-theme-surface-secondary"></div>
          <div className="h-3 w-5/6 rounded-sm bg-theme-surface-secondary"></div>
        </div>
      </div>
    );

    return (
      <div className={withOuterPadding ? 'w-full px-1 md:px-10' : 'w-full'}>
        <div
          role="article"
          onClick={disabled ? undefined : onClick}
          className={`${baseClasses} ${widthClasses[width]} ${
            center ? 'mx-auto' : ''
          } ${onClick && !disabled ? 'cursor-pointer' : ''} ${
            interactive && !disabled ? 'transform hover:-translate-y-1' : ''
          } ${showBorder ? 'border' : ''} ${
            disabled ? 'cursor-not-allowed opacity-60' : ''
          } ${className}`}
          {...(animate && {
            initial: animate.initial,
            animate: animate.animate,
            exit: animate.exit,
          })}
        >
          {badge && (
            <div
              className="absolute -top-2 -right-2"
              role="status"
              aria-label={badge.text}
            >
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  variant === 'default'
                    ? 'bg-gray-600 text-slate-50'
                    : `bg-${badge.variant || variant}-600 text-slate-50`
                }`}
              >
                {badge.text}
              </span>
            </div>
          )}

          {headerComponent ? (
            <div
              className={`${paddingVariants[headerPadding]} ${headerClassName}`}
              role="heading"
              aria-level={2}
            >
              {headerComponent}
            </div>
          ) : (
            (title || description) && (
              <div
                role={collapsible ? 'button' : 'heading'}
                aria-level={collapsible ? undefined : 2}
                aria-expanded={collapsible ? !isCollapsed : undefined}
                tabIndex={collapsible ? 0 : undefined}
                onKeyDown={handleKeyDown}
                className={`${paddingVariants[headerPadding]} ${
                  showBorder ? 'border-b border-theme-border' : ''
                } flex items-center justify-between ${headerClassName} ${
                  collapsible
                    ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-theme-secondary'
                    : ''
                }`}
                onClick={handleCollapse}
              >
                <div className="flex items-center gap-2">
                  {(headerIcon || icon) && (
                    <span className="text-xl" role="img" aria-hidden="true">
                      {headerIcon || icon}
                    </span>
                  )}
                  <div>
                    {title && (
                      <h3 className="text-lg font-semibold text-theme-text">
                        {title}
                      </h3>
                    )}
                    {description && (
                      <p className="mt-1 text-sm font-light text-theme-text-muted">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
                {collapsible && (
                  <button
                    className="rounded-md p-1.5 hover:bg-theme-surface-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-secondary transition-colors"
                    aria-label={
                      isCollapsed ? 'Expand content' : 'Collapse content'
                    }
                  >
                    {isCollapsed ? (
                      <ChevronDown className="h-5 w-5 text-theme-text-muted" />
                    ) : (
                      <ChevronUp className="h-5 w-5 text-theme-text-muted" />
                    )}
                  </button>
                )}
              </div>
            )
          )}

          {/* Collapsible content wrapper with smooth animation */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[5000px] opacity-100'
            }`}
          >
            <div
              className={`${paddingVariants[bodyPadding]} ${bodyClassName}`}
              role="region"
              aria-label="Card content"
            >
              {isLoading ? (
                loadingComponent || defaultLoadingState
              ) : (
                <Suspense fallback={defaultLoadingState}>
                  <LazyContent>{children}</LazyContent>
                </Suspense>
              )}
            </div>

            {bodyComponent && (
              <div
                className={`${paddingVariants[bodyPadding]} ${headerClassName}`}
                role="complementary"
              >
                {bodyComponent}
              </div>
            )}

            {footer && (
              <div
                className={`${paddingVariants[bodyPadding]} ${
                  showBorder ? 'border-t border-theme-border' : ''
                }`}
                role="contentinfo"
              >
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

CardCatto.displayName = 'CardCatto';

export default CardCatto;
