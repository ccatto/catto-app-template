// @catto/ui - ProductCardCatto Component
// Product display card for e-commerce and catalog displays
'use client';

import { useState } from 'react';
import { cn } from '../../utils';
import BadgeCatto from '../Badge/BadgeCatto';

export interface ProductCardCattoProps {
  /** Product name */
  name: string;
  /** Product description */
  description?: string;
  /** Product image URL */
  image?: string;
  /** Product price */
  price: number;
  /** Original price (for showing discounts) */
  originalPrice?: number;
  /** Currency symbol */
  currency?: string;
  /** Badge text (e.g., "Sale", "New", "Sold Out") */
  badge?: string;
  /** Badge variant */
  badgeVariant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  /** Product rating (0-5) */
  rating?: number;
  /** Number of reviews */
  reviewCount?: number;
  /** Whether product is in stock */
  inStock?: boolean;
  /** Category or brand text */
  category?: string;
  /** Primary action button text */
  actionText?: string;
  /** Primary action click handler */
  onActionClick?: () => void;
  /** Card click handler (for navigation) */
  onClick?: () => void;
  /** Whether to show wishlist button */
  showWishlist?: boolean;
  /** Whether item is in wishlist */
  isWishlisted?: boolean;
  /** Wishlist toggle handler */
  onWishlistToggle?: () => void;
  /** Loading state */
  loading?: boolean;
  /** Card orientation */
  orientation?: 'vertical' | 'horizontal';
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing */
  'data-testid'?: string;
}

/**
 * ProductCardCatto - Product display card for catalogs and e-commerce
 *
 * @example
 * // Basic product card
 * <ProductCardCatto
 *   name="Premium Headphones"
 *   description="High-quality wireless headphones"
 *   image="/headphones.jpg"
 *   price={199.99}
 *   rating={4.5}
 *   reviewCount={128}
 * />
 *
 * @example
 * // On sale with badge
 * <ProductCardCatto
 *   name="Running Shoes"
 *   price={79.99}
 *   originalPrice={99.99}
 *   badge="20% Off"
 *   badgeVariant="error"
 * />
 */
export default function ProductCardCatto({
  name,
  description,
  image,
  price,
  originalPrice,
  currency = '$',
  badge,
  badgeVariant = 'default',
  rating,
  reviewCount,
  inStock = true,
  category,
  actionText = 'Add to Cart',
  onActionClick,
  onClick,
  showWishlist = false,
  isWishlisted = false,
  onWishlistToggle,
  loading = false,
  orientation = 'vertical',
  className,
  'data-testid': testId,
}: ProductCardCattoProps) {
  const [imageError, setImageError] = useState(false);
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      data-testid={testId}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        'group relative overflow-hidden rounded-xl bg-theme-surface',
        'border border-theme-border',
        'transition-all duration-200',
        onClick &&
          'cursor-pointer hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600',
        isHorizontal ? 'flex flex-row' : 'flex flex-col',
        className,
      )}
    >
      {/* Image Container */}
      <div
        className={cn(
          'relative overflow-hidden bg-gray-100 dark:bg-gray-700',
          isHorizontal ? 'w-40 shrink-0' : 'aspect-square w-full',
        )}
      >
        {image && !imageError ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <div className="absolute left-2 top-2">
            <BadgeCatto variant={badgeVariant} size="sm">
              {badge}
            </BadgeCatto>
          </div>
        )}

        {/* Wishlist Button */}
        {showWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onWishlistToggle?.();
            }}
            className={cn(
              'absolute right-2 top-2 rounded-full p-2 transition-colors',
              'bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800',
              'focus:outline-none focus:ring-2 focus:ring-theme-secondary',
            )}
            aria-label={
              isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
            }
          >
            <svg
              className={cn(
                'h-5 w-5 transition-colors',
                isWishlisted
                  ? 'fill-red-500 text-red-500'
                  : 'fill-none text-gray-600 dark:text-gray-400',
              )}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
            <span className="rounded-full bg-slate-50 px-3 py-1 text-sm font-medium text-slate-900">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          'flex flex-1 flex-col p-4',
          isHorizontal && 'justify-center',
        )}
      >
        {/* Category */}
        {category && (
          <span className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {category}
          </span>
        )}

        {/* Name */}
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
          {name}
        </h3>

        {/* Description */}
        {description && !isHorizontal && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        )}

        {/* Rating */}
        {rating !== undefined && (
          <div className="mt-2 flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={cn(
                    'h-4 w-4',
                    star <= Math.round(rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600',
                  )}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {reviewCount !== undefined && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {currency}
            {price.toFixed(2)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                {currency}
                {originalPrice.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>

        {/* Action Button */}
        {onActionClick && !isHorizontal && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onActionClick();
            }}
            disabled={!inStock || loading}
            className={cn(
              'mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-secondary',
              inStock
                ? 'bg-theme-secondary text-theme-on-secondary hover:bg-theme-secondary-hover'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400',
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Adding...
              </span>
            ) : inStock ? (
              actionText
            ) : (
              'Out of Stock'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
