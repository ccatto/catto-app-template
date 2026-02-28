// @catto/ui - LinkCatto Component
'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import type { LinkProps } from 'next/link';
import { Loader2 } from 'lucide-react';
import type { FontSizeType, FontWeightType, StyleWidth } from '../../types';
import { cn } from '../../utils';

type LinkVariantType =
  | 'default'
  | 'subtle'
  | 'button'
  | 'outline'
  | 'outline2'
  | 'outlineOrange'
  | 'underline'
  | 'ghost'
  | 'ghostTextSlate'
  | 'link'
  | 'card'
  | 'simple'
  | 'orange'
  | 'simpleOrange'
  | 'orangeBig'
  | 'inlineText'
  | 'muted'
  | 'custom';

type LinkSizeType = 'sm' | 'md' | 'lg' | 'icon';

export interface LinkCattoProps extends Omit<LinkProps, 'href'> {
  href: string;
  className?: string;
  children: React.ReactNode;
  variant?: LinkVariantType;
  size?: LinkSizeType;
  width?: StyleWidth;
  customSize?: string;
  fontSize?: FontSizeType;
  fontWeight?: FontWeightType;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  'aria-label'?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  tooltip?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  isActive?: boolean;
}

const LinkCatto = forwardRef<HTMLAnchorElement, LinkCattoProps>(
  (
    {
      href,
      className,
      children,
      variant = 'default',
      size = 'md',
      width,
      customSize,
      fontSize,
      fontWeight,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled = false,
      tooltip,
      isActive = false,
      onClick,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const sizeVariants: Record<LinkSizeType, string> = {
      sm: 'px-3 py-1.5 gap-2',
      md: 'px-4 py-2 gap-2.5',
      lg: 'px-6 py-3 gap-3',
      icon: 'p-2',
    };

    const defaultStyles: Record<
      LinkSizeType,
      { fontSize: string; fontWeight: string }
    > = {
      sm: { fontSize: 'text-sm', fontWeight: 'font-normal' },
      md: { fontSize: 'text-base', fontWeight: 'font-normal' },
      lg: { fontSize: 'text-lg', fontWeight: 'font-normal' },
      icon: { fontSize: 'text-base', fontWeight: 'font-normal' },
    };

    const variants: Record<LinkVariantType, string> = {
      // Primary link
      default: cn(
        'text-theme-primary hover:text-theme-primary-hover',
        'focus:ring-theme-primary',
        isActive && !fontWeight && 'font-semibold',
      ),
      // Neutral subtle link
      subtle: cn(
        'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50',
        'focus:ring-theme-primary',
      ),
      // Button-style link
      button: cn(
        'px-4 py-2 rounded-md bg-theme-primary text-theme-on-primary hover:bg-theme-primary-hover',
        'focus:ring-theme-primary',
        disabled && 'opacity-50 cursor-not-allowed',
      ),
      // Outline link - primary
      outline: cn(
        'rounded-md border border-theme-primary text-theme-primary hover:bg-theme-primary-subtle',
        'focus:ring-theme-primary',
      ),
      outline2: cn(
        'rounded-md border-2 border-theme-primary text-theme-primary hover:bg-theme-primary-subtle',
        'focus:ring-theme-primary',
      ),
      // Orange outline link - secondary (RLeaguez accent)
      outlineOrange: cn(
        'rounded-md border border-theme-secondary text-theme-secondary hover:bg-theme-secondary-subtle',
        'focus:ring-theme-secondary',
      ),
      // Neutral underline
      underline: cn(
        'border-b-2 border-transparent hover:border-current',
        'focus:ring-theme-primary',
      ),
      // Ghost links
      ghost: cn(
        'text-theme-text-muted hover:bg-theme-surface-secondary rounded-md',
        'focus:ring-theme-primary',
      ),
      ghostTextSlate: cn(
        'text-theme-text hover:bg-theme-primary-subtle rounded-md',
        'hover:text-theme-secondary hover:bg-theme-secondary-subtle rounded-full',
        'focus:ring-theme-secondary',
      ),
      // Text link
      link: cn(
        'text-theme-primary hover:underline',
        'focus:ring-theme-primary',
      ),
      // Card link
      card: cn(
        'block rounded-lg border border-theme-border p-4 hover:border-theme-primary hover:shadow-md transition-all',
        'focus:ring-theme-primary',
      ),
      // Simple links
      simple: cn(
        'ml-1 text-theme-primary hover:underline',
        'focus:ring-theme-primary',
      ),
      simpleOrange: cn(
        'transition-colors duration-300 hover:text-theme-secondary',
        'focus:ring-theme-secondary',
      ),
      // Secondary/accent links
      orange: cn(
        'transition-colors duration-300 text-theme-secondary hover:text-theme-secondary-hover underline',
        'focus:ring-theme-secondary',
      ),
      orangeBig: cn(
        'transform transition-colors duration-300 hover:scale-150 hover:text-theme-secondary',
        'focus:ring-theme-secondary',
      ),
      // Inline text
      inlineText: cn(
        'text-theme-primary hover:text-theme-primary-hover',
        'focus:ring-theme-primary',
      ),
      // Muted links - subtle default, primary hover, secondary active (no focus ring)
      muted: cn(
        'text-theme-text-subtle',
        'hover:text-theme-primary',
        'active:text-theme-secondary',
        'focus:ring-0 focus:ring-offset-0',
      ),
      // Fully custom - no colors
      custom: cn('focus:ring-theme-secondary'),
    };

    const getTypographyClasses = () => {
      const fontSizeClass = fontSize
        ? `text-${fontSize}`
        : defaultStyles[size].fontSize;
      const fontWeightClass = fontWeight
        ? `font-${fontWeight}`
        : defaultStyles[size].fontWeight;
      return `${fontSizeClass} ${fontWeightClass}`;
    };

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled || isLoading) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    const content = (
      <>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && (
          <span className="inline-flex">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="inline-flex">{rightIcon}</span>
        )}
      </>
    );

    const linkClasses = cn(
      baseStyles,
      variants[variant],
      variant !== 'inlineText' && sizeVariants[size],
      getTypographyClasses(),
      width,
      customSize,
      (disabled || isLoading) && 'pointer-events-none opacity-50',
      className,
    );

    return (
      <Link
        ref={ref}
        href={href}
        className={linkClasses}
        aria-label={
          ariaLabel ||
          (typeof children === 'string' ? (children as string) : undefined)
        }
        aria-disabled={disabled || isLoading}
        aria-busy={isLoading}
        onClick={handleClick}
        title={tooltip}
        {...props}
      >
        {content}
      </Link>
    );
  },
);

LinkCatto.displayName = 'LinkCatto';

export default LinkCatto;
