// @catto/ui - InlineLoadingCatto Component
'use client';

import React from 'react';

export interface InlineLoadingCattoProps {
  /** Optional message to display next to the spinner */
  message?: string;
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Padding around the component */
  padding?: 'sm' | 'md' | 'lg' | 'none';
  /** Layout direction */
  layout?: 'horizontal' | 'vertical';
  /** Show Rz logo inside the spinner (requires size lg) */
  showLogo?: boolean;
}

/**
 * RzLogoSvg - Inline SVG logo for the loading spinner
 */
const RzLogoSvg: React.FC<{ size: number }> = ({ size }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className="absolute inset-0 m-auto"
  >
    <defs>
      <radialGradient id="rzBgGradientInline" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#0055FF" />
        <stop offset="25%" stopColor="#0055FF" />
        <stop offset="70%" stopColor="#1F3A5F" />
        <stop offset="100%" stopColor="#0A1628" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#rzBgGradientInline)" />
    <text
      x="32"
      y="44"
      fontFamily="'Arial Black', 'Helvetica Neue', sans-serif"
      fontSize="36"
      fontWeight="900"
      textAnchor="middle"
      fill="#FF8C00"
    >
      Rz
    </text>
  </svg>
);

/**
 * InlineLoadingCatto - Inline loading spinner for tables, sections, and containers
 *
 * Use this component for loading states within a container (not full-page).
 * For full-page loading, use PageLoadingCatto instead.
 *
 * @example
 * // Basic usage in a table
 * if (loading) return <InlineLoadingCatto message="Loading data..." />;
 *
 * @example
 * // Small spinner without message
 * <InlineLoadingCatto size="sm" />
 *
 * @example
 * // Large spinner with vertical layout
 * <InlineLoadingCatto size="lg" layout="vertical" message="Loading..." />
 */
const InlineLoadingCatto: React.FC<InlineLoadingCattoProps> = ({
  message,
  size = 'md',
  padding = 'md',
  layout = 'horizontal',
  showLogo = false,
}) => {
  // When showing logo, use larger size
  const effectiveSize = showLogo ? 'lg' : size;

  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  // Logo sizes based on spinner size
  const logoSizes = {
    sm: 16,
    md: 28,
    lg: 40,
  };

  const paddingClasses = {
    none: '',
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12',
  };

  const layoutClasses =
    layout === 'horizontal' ? 'flex-row space-x-3' : 'flex-col space-y-3';

  return (
    <div
      className={`flex ${layoutClasses} items-center justify-center ${paddingClasses[padding]}`}
    >
      {/* Orange spinning circle with optional Rz logo */}
      <div
        className={`relative ${sizeClasses[effectiveSize]} animate-[bounce_1s_infinite]`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full animate-spin text-theme-secondary"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0"
          viewBox="0 0 16 16"
        >
          <path d="M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 4c2.209 0 4 1.791 4 4s-1.791 4-4 4-4-1.791-4-4 1.791-4 4-4zM12.773 12.773c-1.275 1.275-2.97 1.977-4.773 1.977s-3.498-0.702-4.773-1.977-1.977-2.97-1.977-4.773c0-1.803 0.702-3.498 1.977-4.773l1.061 1.061c0 0 0 0 0 0-2.047 2.047-2.047 5.378 0 7.425 0.992 0.992 2.31 1.538 3.712 1.538s2.721-0.546 3.712-1.538c2.047-2.047 2.047-5.378 0-7.425l1.061-1.061c1.275 1.275 1.977 2.97 1.977 4.773s-0.702 3.498-1.977 4.773z"></path>
        </svg>
        {/* Rz Logo (centered, static - only bounces with container) */}
        {showLogo && <RzLogoSvg size={logoSizes[effectiveSize]} />}
      </div>
      {/* Optional message */}
      {message && <p className="text-theme-text-muted">{message}</p>}
    </div>
  );
};

export default InlineLoadingCatto;
