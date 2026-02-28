// @catto/ui - AvatarCatto Component
// User avatar with image, initials fallback, and status indicator
'use client';

import { useState } from 'react';
import { cn } from '../../utils';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'none';
export type AvatarShape = 'circle' | 'rounded' | 'square';

export interface AvatarCattoProps {
  /** Image source URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** User's name (used for initials fallback) */
  name?: string;
  /** Size of the avatar */
  size?: AvatarSize;
  /** Shape of the avatar */
  shape?: AvatarShape;
  /** Online status indicator */
  status?: AvatarStatus;
  /** Custom fallback content (overrides initials) */
  fallback?: React.ReactNode;
  /** Border ring around avatar */
  ring?: boolean;
  /** Ring color (Tailwind color class) */
  ringColor?: string;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Test ID for testing */
  'data-testid'?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
  '2xl': 'h-20 w-20 text-2xl',
};

const shapeStyles: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-lg',
  square: 'rounded-none',
};

const statusColors: Record<AvatarStatus, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
  none: '',
};

const statusSizeStyles: Record<AvatarSize, string> = {
  xs: 'h-1.5 w-1.5 border',
  sm: 'h-2 w-2 border',
  md: 'h-2.5 w-2.5 border-2',
  lg: 'h-3 w-3 border-2',
  xl: 'h-4 w-4 border-2',
  '2xl': 'h-5 w-5 border-2',
};

/**
 * Get initials from a name string
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate a consistent background color from a name
 */
function getColorFromName(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-teal-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * AvatarCatto - User avatar with image support and initials fallback
 *
 * @example
 * // With image
 * <AvatarCatto src="/user.jpg" alt="John Doe" name="John Doe" />
 *
 * @example
 * // Initials fallback
 * <AvatarCatto name="John Doe" size="lg" />
 *
 * @example
 * // With status indicator
 * <AvatarCatto name="Jane" status="online" />
 *
 * @example
 * // With ring
 * <AvatarCatto src="/user.jpg" ring ringColor="ring-orange-500" />
 */
export default function AvatarCatto({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  status = 'none',
  fallback,
  ring = false,
  ringColor = 'ring-gray-200 dark:ring-gray-700',
  className,
  onClick,
  'data-testid': testId,
}: AvatarCattoProps) {
  const [imageError, setImageError] = useState(false);

  const showImage = src && !imageError;
  const initials = name ? getInitials(name) : '';
  const bgColor = name ? getColorFromName(name) : 'bg-gray-400';

  const isInteractive = !!onClick;
  const Component = isInteractive ? 'button' : 'div';

  return (
    <Component
      data-testid={testId}
      onClick={onClick}
      type={isInteractive ? 'button' : undefined}
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden',
        sizeStyles[size],
        shapeStyles[shape],
        ring && `ring-2 ${ringColor}`,
        isInteractive &&
          'cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        !showImage && bgColor,
        className,
      )}
      aria-label={alt || name}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : fallback ? (
        <span className="text-white">{fallback}</span>
      ) : initials ? (
        <span className="font-medium text-white">{initials}</span>
      ) : (
        // Default user icon
        <svg
          className="h-1/2 w-1/2 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      )}

      {/* Status indicator */}
      {status !== 'none' && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-white dark:border-gray-800',
            statusColors[status],
            statusSizeStyles[size],
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </Component>
  );
}
