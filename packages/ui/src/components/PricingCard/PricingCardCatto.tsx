// @catto/ui - PricingCardCatto Component
// Pricing tier card for subscription/plan displays
'use client';

import { cn } from '../../utils';
import BadgeCatto from '../Badge/BadgeCatto';

export interface PricingFeature {
  /** Feature text */
  text: string;
  /** Whether feature is included in this tier */
  included?: boolean;
  /** Optional tooltip/info text */
  info?: string;
}

export type PricingVariant = 'default' | 'featured' | 'enterprise';

export interface PricingCardCattoProps {
  /** Plan name (e.g., "Basic", "Pro", "Enterprise") */
  name: string;
  /** Short description of the plan */
  description?: string;
  /** Price amount (number or string for "Custom") */
  price: number | string;
  /** Price currency symbol */
  currency?: string;
  /** Billing period (e.g., "month", "year") */
  period?: string;
  /** List of features included in this plan */
  features: PricingFeature[];
  /** Call-to-action button text */
  ctaText?: string;
  /** Call-to-action click handler */
  onCtaClick?: () => void;
  /** Whether CTA button is disabled */
  ctaDisabled?: boolean;
  /** Loading state for CTA button */
  ctaLoading?: boolean;
  /** Badge text (e.g., "Most Popular", "Best Value") */
  badge?: string;
  /** Visual variant */
  variant?: PricingVariant;
  /** Highlight this card (adds border/shadow) */
  highlighted?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing */
  'data-testid'?: string;
}

const variantStyles: Record<PricingVariant, string> = {
  default: 'bg-theme-surface border border-theme-border',
  featured: 'bg-theme-surface border-2 border-theme-secondary',
  enterprise:
    'bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white border border-gray-700',
};

const ctaVariantStyles: Record<PricingVariant, string> = {
  default:
    'bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900',
  featured:
    'bg-theme-secondary hover:bg-theme-secondary-hover text-theme-on-secondary',
  enterprise:
    'bg-white hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-100 text-gray-900',
};

/**
 * PricingCardCatto - Pricing tier card for subscription displays
 *
 * @example
 * // Basic pricing card
 * <PricingCardCatto
 *   name="Pro"
 *   price={29}
 *   period="month"
 *   features={[
 *     { text: "Unlimited projects", included: true },
 *     { text: "Priority support", included: true },
 *     { text: "Custom domain", included: false },
 *   ]}
 *   ctaText="Get Started"
 *   onCtaClick={() => console.log("clicked")}
 * />
 *
 * @example
 * // Featured/highlighted card
 * <PricingCardCatto
 *   name="Business"
 *   price={99}
 *   badge="Most Popular"
 *   variant="featured"
 *   highlighted
 *   {...props}
 * />
 */
export default function PricingCardCatto({
  name,
  description,
  price,
  currency = '$',
  period = 'month',
  features,
  ctaText = 'Get Started',
  onCtaClick,
  ctaDisabled = false,
  ctaLoading = false,
  badge,
  variant = 'default',
  highlighted = false,
  className,
  'data-testid': testId,
}: PricingCardCattoProps) {
  const isCustomPrice = typeof price === 'string';
  const isEnterprise = variant === 'enterprise';

  return (
    <div
      data-testid={testId}
      className={cn(
        'relative flex flex-col rounded-2xl p-6 transition-shadow',
        variantStyles[variant],
        highlighted && 'shadow-xl ring-1 ring-gray-900/10 dark:ring-white/10',
        className,
      )}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <BadgeCatto
            variant={variant === 'featured' ? 'warning' : 'primary'}
            size="sm"
            rounded
          >
            {badge}
          </BadgeCatto>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3
          className={cn(
            'text-xl font-semibold',
            isEnterprise ? 'text-white' : 'text-theme-text',
          )}
        >
          {name}
        </h3>
        {description && (
          <p
            className={cn(
              'mt-1 text-sm',
              isEnterprise ? 'text-gray-300' : 'text-theme-text-muted',
            )}
          >
            {description}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="mb-6">
        {isCustomPrice ? (
          <span
            className={cn(
              'text-4xl font-bold',
              isEnterprise ? 'text-white' : 'text-theme-text',
            )}
          >
            {price}
          </span>
        ) : (
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                'text-lg font-medium',
                isEnterprise ? 'text-gray-300' : 'text-theme-text-muted',
              )}
            >
              {currency}
            </span>
            <span
              className={cn(
                'text-4xl font-bold tracking-tight',
                isEnterprise ? 'text-white' : 'text-theme-text',
              )}
            >
              {price}
            </span>
            <span
              className={cn(
                'text-sm',
                isEnterprise ? 'text-gray-300' : 'text-theme-text-muted',
              )}
            >
              /{period}
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="mb-8 flex-1 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {feature.included !== false ? (
              <svg
                className={cn(
                  'h-5 w-5 shrink-0',
                  isEnterprise ? 'text-green-400' : 'text-green-500',
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className={cn(
                  'h-5 w-5 shrink-0',
                  isEnterprise ? 'text-gray-500' : 'text-theme-border',
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span
              className={cn(
                'text-sm',
                feature.included === false
                  ? isEnterprise
                    ? 'text-gray-500'
                    : 'text-theme-text-subtle'
                  : isEnterprise
                    ? 'text-gray-200'
                    : 'text-theme-text',
              )}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        type="button"
        onClick={onCtaClick}
        disabled={ctaDisabled || ctaLoading}
        className={cn(
          'w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          ctaVariantStyles[variant],
        )}
      >
        {ctaLoading ? (
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
            Processing...
          </span>
        ) : (
          ctaText
        )}
      </button>
    </div>
  );
}
