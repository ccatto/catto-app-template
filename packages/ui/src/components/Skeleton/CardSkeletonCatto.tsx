// Card skeleton component for loading states

'use client';

import { cn } from '../../utils';
import SkeletonBaseCatto from './SkeletonBaseCatto';

export type CardSkeletonWidth =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | 'full'
  | 'auto';

export interface CardSkeletonCattoProps {
  /** Show title skeleton */
  showTitle?: boolean;
  /** Show description skeleton */
  showDescription?: boolean;
  /** Number of content line skeletons */
  contentLines?: number;
  /** Show footer skeleton with buttons */
  showFooter?: boolean;
  /** Show icon placeholder */
  showIcon?: boolean;
  /** Card width preset */
  width?: CardSkeletonWidth;
  /** Skeleton variant for different use cases */
  variant?: 'default' | 'compact' | 'detailed';
  /** Additional CSS classes */
  className?: string;
}

const CardSkeletonCatto = ({
  showTitle = true,
  showDescription = true,
  contentLines = 3,
  showFooter = false,
  showIcon = false,
  width = 'full',
  variant = 'default',
  className = '',
}: CardSkeletonCattoProps) => {
  // Width mapping
  const widthClasses: Record<CardSkeletonWidth, string> = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'w-full',
    auto: 'w-auto',
  };

  // Adjust content based on variant
  const adjustedContentLines =
    variant === 'compact' ? Math.min(contentLines, 2) : contentLines;
  const shouldShowDescription = variant === 'compact' ? false : showDescription;

  return (
    <div
      className={cn(
        'rounded-lg border border-theme-secondary bg-theme-surface p-4 shadow-md',
        widthClasses[width],
        width !== 'full' && 'mx-auto',
        className,
      )}
      aria-busy="true"
      aria-live="polite"
    >
      {/* Header section */}
      {(showTitle || shouldShowDescription || showIcon) && (
        <div
          className={cn(
            'flex items-start gap-3',
            (showTitle || shouldShowDescription) &&
              'mb-4 border-b border-theme-border pb-4',
          )}
        >
          {/* Icon placeholder */}
          {showIcon && (
            <SkeletonBaseCatto width={40} height={40} rounded="md" />
          )}

          {/* Title and description */}
          <div className="flex-1 space-y-2">
            {showTitle && <SkeletonBaseCatto width="3/4" height="lg" />}
            {shouldShowDescription && (
              <SkeletonBaseCatto width="full" height="sm" />
            )}
          </div>
        </div>
      )}

      {/* Content lines */}
      {adjustedContentLines > 0 && (
        <div className="space-y-3">
          {Array.from({ length: adjustedContentLines }).map((_, i) => (
            <SkeletonBaseCatto
              key={i}
              width={i === adjustedContentLines - 1 ? '3/4' : 'full'}
              height="sm"
            />
          ))}
        </div>
      )}

      {/* Footer with action buttons */}
      {showFooter && (
        <div className="mt-4 flex justify-end gap-2 border-t border-theme-border pt-4">
          <SkeletonBaseCatto width={80} height="lg" rounded="md" />
          <SkeletonBaseCatto width={80} height="lg" rounded="md" />
        </div>
      )}
    </div>
  );
};

export default CardSkeletonCatto;
