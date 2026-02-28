// @catto/ui - PageHeaderCatto Component
'use client';

import React, { ReactNode } from 'react';
import type { StyleWidth } from '../../types';

/**
 * Width classes mapping - responsive max-width constraints
 */
const widthClasses: Record<StyleWidth, string> = {
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

/**
 * Padding size options
 */
type PaddingSize = 'none' | 'sm' | 'md' | 'lg' | 'xl';

const paddingClasses: Record<PaddingSize, string> = {
  none: '',
  sm: 'py-2',
  md: 'py-4',
  lg: 'py-6',
  xl: 'py-8',
};

/**
 * Title size options
 */
type TitleSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

const titleSizeClasses: Record<TitleSize, string> = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
  '2xl': 'text-4xl',
  '3xl': 'text-5xl',
};

/**
 * Layout options for title/subtitle arrangement
 */
type Layout = 'stacked' | 'inline';

export interface PageHeaderCattoProps {
  /** The main page title (required) */
  title: string;
  /** Optional subtitle or description */
  subtitle?: string | ReactNode;
  /** Icon to display before the title */
  icon?: ReactNode;
  /** Action button or element to display on the right side */
  action?: ReactNode;
  /** Width constraint for the header container */
  width?: StyleWidth;
  /** Center the header within its container */
  center?: boolean;
  /** Vertical padding size */
  padding?: PaddingSize;
  /** Title text size */
  titleSize?: TitleSize;
  /** Layout for title/subtitle: 'stacked' (mobile) or 'inline' (side by side) */
  layout?: Layout;
  /** Additional class names for the container */
  className?: string;
  /** Additional class names for the title */
  titleClassName?: string;
  /** Additional class names for the subtitle */
  subtitleClassName?: string;
  /** Adds responsive outer horizontal padding (px-1 md:px-10). Default: true */
  withOuterPadding?: boolean;
  /** Heading level for the title element (h1-h6). Default: 1 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * PageHeaderCatto - A reusable page header component for mobile-first layouts
 *
 * Features:
 * - Responsive layout (stacked on mobile, inline on desktop)
 * - Configurable title size, padding, and width
 * - Optional icon and action elements
 * - Dark mode support
 * - Semantic heading level support
 *
 * @example
 * ```tsx
 * <PageHeaderCatto
 *   title="Venuez"
 *   subtitle="Browse 6003 venuez across 3 countries"
 *   width="7xl"
 *   titleSize="xl"
 * />
 * ```
 */
const PageHeaderCatto = React.memo(
  ({
    title,
    subtitle,
    icon,
    action,
    width = '7xl',
    center = true,
    padding = 'lg',
    titleSize = 'xl',
    layout = 'inline',
    className = '',
    titleClassName = '',
    subtitleClassName = '',
    withOuterPadding = true,
    headingLevel = 1,
  }: PageHeaderCattoProps) => {
    // Dynamically create heading element
    const HeadingTag: React.ElementType = `h${headingLevel}`;

    // Build container classes
    const containerClasses = [
      widthClasses[width],
      center ? 'mx-auto' : '',
      paddingClasses[padding],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Build layout classes based on layout prop
    const layoutClasses =
      layout === 'inline'
        ? 'flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'
        : 'flex flex-col gap-1';

    // Title classes
    const titleClasses = [
      titleSizeClasses[titleSize],
      'font-bold text-theme-text',
      titleClassName,
    ]
      .filter(Boolean)
      .join(' ');

    // Subtitle classes
    const subtitleClasses = ['text-theme-text-muted', subtitleClassName]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={withOuterPadding ? 'w-full px-1 md:px-10' : 'w-full'}>
        <div className={containerClasses}>
          <div className={layoutClasses}>
            {/* Title section with optional icon */}
            <div className="flex items-center gap-2">
              {icon && (
                <span className="text-theme-secondary" aria-hidden="true">
                  {icon}
                </span>
              )}
              <HeadingTag className={titleClasses}>{title}</HeadingTag>
            </div>

            {/* Subtitle */}
            {subtitle && (
              <div className={subtitleClasses}>
                {typeof subtitle === 'string' ? <p>{subtitle}</p> : subtitle}
              </div>
            )}
          </div>

          {/* Action element */}
          {action && (
            <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">{action}</div>
          )}
        </div>
      </div>
    );
  },
);

PageHeaderCatto.displayName = 'PageHeaderCatto';

export default PageHeaderCatto;
