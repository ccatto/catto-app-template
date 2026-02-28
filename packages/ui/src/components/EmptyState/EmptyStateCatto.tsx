// @catto/ui - EmptyStateCatto Component
'use client';

import React, { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  AlertCircle,
  Calendar,
  Inbox,
  MapPin,
  Search,
  Trophy,
  UserPlus,
  Users,
} from 'lucide-react';
import { cn } from '../../utils';
import ButtonCatto from '../Button/ButtonCatto';
import LinkCatto from '../Link/LinkCatto';

// Variant styles using cva for consistency with CardCatto
// Using explicit Tailwind colors (dark-mode-first approach)
const emptyStateVariants = cva(
  'flex flex-col items-center justify-center text-center p-8 rounded-lg',
  {
    variants: {
      variant: {
        // Default - uses secondary (RLeaguez accent color)
        default:
          'bg-gradient-to-br from-theme-secondary-subtle to-slate-100 dark:to-slate-800 border border-theme-secondary',
        // Neutral no results
        noResults:
          'bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-700',
        // Fixed error state (status color)
        error:
          'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50',
        // Transparent subtle
        subtle: 'bg-transparent',
        // Primary - uses primary (RLeaguez primary color)
        primary:
          'bg-gradient-to-br from-theme-primary-subtle to-slate-100 dark:to-slate-800 border border-theme-primary',
      },
      size: {
        sm: 'p-4 gap-2',
        md: 'p-6 gap-3',
        lg: 'p-8 gap-4',
        xl: 'p-12 gap-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'lg',
    },
  },
);

// Icon variants with explicit Tailwind colors
const iconVariants = cva('flex items-center justify-center rounded-full mb-2', {
  variants: {
    variant: {
      // Default - uses secondary (RLeaguez accent)
      default: 'bg-theme-secondary-subtle text-theme-secondary',
      // Neutral
      noResults:
        'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400',
      // Fixed error state
      error: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      // Neutral subtle
      subtle:
        'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
      // Primary - uses primary
      primary: 'bg-theme-primary-subtle text-theme-primary',
    },
    size: {
      sm: 'w-10 h-10',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-20 h-20',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'lg',
  },
});

// Title variants with explicit Tailwind colors
const titleVariants = cva('font-semibold', {
  variants: {
    variant: {
      default: 'text-theme-text',
      noResults: 'text-slate-600 dark:text-slate-400',
      error: 'text-red-800 dark:text-red-200',
      subtle: 'text-slate-600 dark:text-slate-400',
      primary: 'text-theme-primary',
    },
    size: {
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-xl',
      xl: 'text-2xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'lg',
  },
});

// Description variants with explicit Tailwind colors
const descriptionVariants = cva('max-w-md font-light', {
  variants: {
    variant: {
      default: 'text-theme-text-muted',
      noResults: 'text-slate-500 dark:text-slate-400',
      error: 'text-red-600 dark:text-red-300',
      subtle: 'text-slate-500 dark:text-slate-400',
      primary: 'text-theme-primary',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'lg',
  },
});

const presetIcons = {
  teams: Users,
  players: UserPlus,
  tournaments: Trophy,
  venues: MapPin,
  matches: Calendar,
  members: Users,
  leagues: Trophy,
  search: Search,
  error: AlertCircle,
  default: Inbox,
} as const;

type PresetIcon = keyof typeof presetIcons;
type EmptyStateVariants = VariantProps<typeof emptyStateVariants>;

export interface EmptyStateCattoProps extends EmptyStateVariants {
  title: string;
  description?: string;
  icon?: ReactNode;
  iconType?: PresetIcon;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: 'primary' | 'catto' | 'funOrange' | 'outline';
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  className?: string;
  children?: ReactNode;
}

const EmptyStateCatto = React.memo(
  ({
    title,
    description,
    icon,
    iconType = 'default',
    action,
    secondaryAction,
    variant = 'default',
    size = 'lg',
    className,
    children,
  }: EmptyStateCattoProps) => {
    const IconComponent = presetIcons[iconType];
    const iconSizeMap = { sm: 20, md: 24, lg: 32, xl: 40 };
    const iconSize = iconSizeMap[size || 'lg'];

    return (
      <div className={cn(emptyStateVariants({ variant, size }), className)}>
        <div className={iconVariants({ variant, size })}>
          {icon || <IconComponent size={iconSize} strokeWidth={1.5} />}
        </div>

        <h3 className={titleVariants({ variant, size })}>{title}</h3>

        {description && (
          <p className={descriptionVariants({ variant, size })}>
            {description}
          </p>
        )}

        {children}

        {(action || secondaryAction) && (
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
            {action && (
              <>
                {action.href ? (
                  <LinkCatto
                    href={action.href}
                    variant="button"
                    size="md"
                    className="bg-theme-secondary hover:bg-theme-secondary-hover text-theme-on-secondary"
                  >
                    {action.label}
                  </LinkCatto>
                ) : (
                  <ButtonCatto
                    onClick={action.onClick}
                    variant={action.variant || 'pill'}
                    size="medium"
                    width="auto"
                  >
                    {action.label}
                  </ButtonCatto>
                )}
              </>
            )}
            {secondaryAction && (
              <LinkCatto
                href={secondaryAction.href}
                variant="underline"
                size="sm"
              >
                {secondaryAction.label}
              </LinkCatto>
            )}
          </div>
        )}
      </div>
    );
  },
);

EmptyStateCatto.displayName = 'EmptyStateCatto';

export default EmptyStateCatto;
