// @catto/ui - CartItemCatto Component
// Cart line item display with quantity and actions
'use client';

import { useState } from 'react';
import { cn } from '../../utils';
import QuantitySelectorCatto from '../QuantitySelector/QuantitySelectorCatto';

export interface CartItemCattoProps {
  /** Product name */
  name: string;
  /** Product image URL */
  image?: string;
  /** Unit price */
  price: number;
  /** Current quantity */
  quantity: number;
  /** Currency symbol */
  currency?: string;
  /** Product variant/option (e.g., "Size: Large, Color: Blue") */
  variant?: string;
  /** Whether item is in stock */
  inStock?: boolean;
  /** Maximum quantity allowed */
  maxQuantity?: number;
  /** Called when quantity changes */
  onQuantityChange?: (quantity: number) => void;
  /** Called when remove button is clicked */
  onRemove?: () => void;
  /** Called when save for later is clicked */
  onSaveForLater?: () => void;
  /** Show save for later button */
  showSaveForLater?: boolean;
  /** Loading state (for async operations) */
  loading?: boolean;
  /** Compact mode (smaller image, less padding) */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing */
  'data-testid'?: string;
}

/**
 * CartItemCatto - Cart line item with image, quantity selector, and actions
 *
 * @example
 * // Basic usage
 * <CartItemCatto
 *   name="Premium Headphones"
 *   image="/headphones.jpg"
 *   price={199.99}
 *   quantity={1}
 *   onQuantityChange={setQty}
 *   onRemove={handleRemove}
 * />
 *
 * @example
 * // With variant and save for later
 * <CartItemCatto
 *   name="T-Shirt"
 *   price={29.99}
 *   quantity={2}
 *   variant="Size: M, Color: Navy"
 *   showSaveForLater
 *   onSaveForLater={handleSave}
 * />
 */
export default function CartItemCatto({
  name,
  image,
  price,
  quantity,
  currency = '$',
  variant,
  inStock = true,
  maxQuantity = 99,
  onQuantityChange,
  onRemove,
  onSaveForLater,
  showSaveForLater = false,
  loading = false,
  compact = false,
  className,
  'data-testid': testId,
}: CartItemCattoProps) {
  const [imageError, setImageError] = useState(false);
  const lineTotal = price * quantity;

  return (
    <div
      data-testid={testId}
      className={cn(
        'flex gap-4 border-b border-gray-200 dark:border-gray-700',
        compact ? 'py-3' : 'py-4',
        loading && 'opacity-60 pointer-events-none',
        className,
      )}
    >
      {/* Product Image */}
      <div
        className={cn(
          'shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800',
          compact ? 'h-16 w-16' : 'h-24 w-24',
        )}
      >
        {image && !imageError ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-8 w-8 text-gray-400"
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
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div className="flex-1">
            <h3
              className={cn(
                'font-medium text-gray-900 dark:text-white',
                compact ? 'text-sm' : 'text-base',
              )}
            >
              {name}
            </h3>

            {variant && (
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                {variant}
              </p>
            )}

            {!inStock && (
              <p className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">
                Out of stock
              </p>
            )}
          </div>

          {/* Unit Price (shown on larger screens or compact mode) */}
          <div className={cn('text-right', !compact && 'hidden sm:block')}>
            <p
              className={cn(
                'font-medium text-gray-900 dark:text-white',
                compact ? 'text-sm' : 'text-base',
              )}
            >
              {currency}
              {price.toFixed(2)}
            </p>
            {quantity > 1 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">each</p>
            )}
          </div>
        </div>

        {/* Bottom Row: Quantity, Actions, Line Total */}
        <div
          className={cn(
            'flex items-end justify-between',
            compact ? 'mt-2' : 'mt-3',
          )}
        >
          {/* Quantity Selector & Actions */}
          <div className="flex items-center gap-3">
            {onQuantityChange && inStock && (
              <QuantitySelectorCatto
                value={quantity}
                onChange={onQuantityChange}
                min={1}
                max={maxQuantity}
                size={compact ? 'sm' : 'md'}
                disabled={loading}
              />
            )}

            <div className="flex items-center gap-2">
              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  disabled={loading}
                  className={cn(
                    'text-sm font-medium text-red-600 hover:text-red-700',
                    'dark:text-red-400 dark:hover:text-red-300',
                    'focus:outline-none focus:underline',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                  )}
                >
                  Remove
                </button>
              )}

              {showSaveForLater && onSaveForLater && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <button
                    type="button"
                    onClick={onSaveForLater}
                    disabled={loading}
                    className={cn(
                      'text-sm font-medium text-blue-600 hover:text-blue-700',
                      'dark:text-blue-400 dark:hover:text-blue-300',
                      'focus:outline-none focus:underline',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                    )}
                  >
                    Save for later
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Line Total */}
          <div className="text-right">
            <p
              className={cn(
                'font-semibold text-gray-900 dark:text-white',
                compact ? 'text-base' : 'text-lg',
              )}
            >
              {currency}
              {lineTotal.toFixed(2)}
            </p>
            {quantity > 1 && !compact && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {quantity} x {currency}
                {price.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
