// @catto/ui - PageLoadingCatto Component
'use client';

import React from 'react';

export interface PageLoadingCattoProps {
  /** Optional message to display below the spinner */
  message?: string;
  /** Minimum height for the container. Defaults to 'screen' (100vh) */
  minHeight?: 'screen' | 'full' | 'auto';
  /** Show Rz logo inside the spinner */
  showLogo?: boolean;
}

/**
 * RzLogoSvg - Inline SVG logo for the loading spinner
 * Uses fallback fonts to avoid external dependencies
 */
const RzLogoSvg: React.FC<{ size: number }> = ({ size }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className="absolute inset-0 m-auto"
  >
    {/* Navy blue gradient background circle */}
    <defs>
      <radialGradient id="rzBgGradient" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#0055FF" />
        <stop offset="25%" stopColor="#0055FF" />
        <stop offset="70%" stopColor="#1F3A5F" />
        <stop offset="100%" stopColor="#0A1628" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#rzBgGradient)" />
    {/* Orange "Rz" text */}
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
 * PageLoadingCatto - Full-page loading spinner with RLeaguez branding
 *
 * Use this component for page-level loading states. It displays the
 * signature orange bouncing/spinning circle that represents RLeaguez.
 *
 * @example
 * // Basic usage
 * if (loading) return <PageLoadingCatto />;
 *
 * @example
 * // With custom message
 * if (loading) return <PageLoadingCatto message="Loading tournament data..." />;
 *
 * @example
 * // With Rz logo inside (larger spinner)
 * if (loading) return <PageLoadingCatto showLogo />;
 *
 * @example
 * // Full featured
 * if (loading) return <PageLoadingCatto showLogo message="Loading..." />;
 *
 * @example
 * // In a container (not full screen)
 * <div className="h-96 relative">
 *   <PageLoadingCatto minHeight="full" />
 * </div>
 */
const PageLoadingCatto: React.FC<PageLoadingCattoProps> = ({
  message,
  minHeight = 'screen',
  showLogo = false,
}) => {
  const heightClass =
    minHeight === 'screen'
      ? 'min-h-screen'
      : minHeight === 'full'
        ? 'min-h-full h-full'
        : 'min-h-full h-full'; // 'auto' - fill parent container

  // When minHeight is 'auto', use transparent bg (assumes it's inside a styled container)
  const bgClass = minHeight === 'auto' ? '' : 'bg-theme-background';

  // Size: larger when showing logo to accommodate it clearly
  const spinnerSize = showLogo ? 'h-24 w-24' : 'h-16 w-16';
  const logoSize = 56; // Inner logo slightly smaller than container

  return (
    <div
      className={`flex ${heightClass} items-center justify-center ${bgClass}`}
    >
      <div className="text-center">
        {/* Orange bouncing spinner */}
        <div
          className={`relative mx-auto mb-4 ${spinnerSize} animate-[bounce_1s_infinite]`}
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
          {showLogo && <RzLogoSvg size={logoSize} />}
        </div>
        {/* Optional message */}
        {message && <p className="text-theme-text-muted">{message}</p>}
      </div>
    </div>
  );
};

export default PageLoadingCatto;
