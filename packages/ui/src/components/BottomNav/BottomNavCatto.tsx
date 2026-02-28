// @catto/ui - BottomNavCatto Component
// Mobile bottom navigation bar with hide-on-scroll support
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '../../utils';

// ============================================
// Types
// ============================================

export interface BottomNavItem {
  /** Unique key for the item */
  key: string;
  /** Icon to display */
  icon: React.ReactNode;
  /** Label text below icon */
  label: string;
  /** Navigation href */
  href: string;
  /** Whether this item is currently active */
  isActive?: boolean;
}

export interface BottomNavCattoProps {
  /** Navigation items to display */
  items: BottomNavItem[];
  /** Optional slot for right side content (e.g., hamburger menu) */
  rightSlot?: React.ReactNode;
  /** Hide nav bar when scrolling down, show when scrolling up */
  hideOnScroll?: boolean;
  /** Custom Link component (for Next.js Link, etc.) */
  LinkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    children: React.ReactNode;
  }>;
  /** Callback when an item is clicked (for custom navigation handling) */
  onItemClick?: (item: BottomNavItem) => void;
  /** Additional className for the nav container */
  className?: string;
  /** z-index for the nav bar (default: 40) */
  zIndex?: number;
  /** Accessible label for the nav */
  'aria-label'?: string;
}

/**
 * BottomNavCatto - Mobile bottom navigation bar
 *
 * Features:
 * - Fixed bottom position
 * - Configurable nav items with icon + label
 * - Optional right slot for hamburger menu or other controls
 * - Hide-on-scroll behavior (shows on scroll up, hides on scroll down)
 * - Theme-aware styling
 * - Active state highlighting
 * - Support for custom Link component (Next.js, React Router, etc.)
 *
 * Usage:
 * ```tsx
 * <BottomNavCatto
 *   items={[
 *     { key: 'home', icon: <Home />, label: 'Home', href: '/', isActive: true },
 *     { key: 'search', icon: <Search />, label: 'Search', href: '/search' },
 *   ]}
 *   rightSlot={<AnimatedHamburgerCatto isOpen={isOpen} onClick={toggle} />}
 *   hideOnScroll
 *   LinkComponent={Link}
 * />
 * ```
 */
const BottomNavCatto: React.FC<BottomNavCattoProps> = ({
  items,
  rightSlot,
  hideOnScroll = true,
  LinkComponent,
  onItemClick,
  className,
  zIndex = 40,
  'aria-label': ariaLabel = 'Bottom navigation',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll to show/hide nav
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    requestAnimationFrame(() => {
      // Always show nav when at top of page (includes pull-to-refresh)
      if (currentScrollY <= 10) {
        setIsVisible(true);
      } else {
        // Show when scrolling up, hide when scrolling down
        setIsVisible(currentScrollY <= lastScrollY);
      }
      setLastScrollY(currentScrollY);
    });
  }, [lastScrollY]);

  // Set up scroll listener
  useEffect(() => {
    if (!hideOnScroll) {
      setIsVisible(true);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 10);
    };

    window.addEventListener('scroll', debouncedScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll, hideOnScroll]);

  // Render a nav item
  const renderItem = (item: BottomNavItem) => {
    const itemContent = (
      <>
        {item.icon}
        <span className="mt-1 text-xs">{item.label}</span>
      </>
    );

    const itemClassName = cn(
      'flex flex-col items-center rounded-lg p-2 transition-colors',
      item.isActive ? 'text-theme-secondary' : 'text-theme-text-muted',
      'hover:bg-theme-surface-secondary',
    );

    // If custom Link component provided, use it
    if (LinkComponent) {
      return (
        <LinkComponent
          key={item.key}
          href={item.href}
          className={itemClassName}
        >
          {itemContent}
        </LinkComponent>
      );
    }

    // If onItemClick provided, use button
    if (onItemClick) {
      return (
        <button
          key={item.key}
          onClick={() => onItemClick(item)}
          className={itemClassName}
          type="button"
        >
          {itemContent}
        </button>
      );
    }

    // Fallback to anchor tag
    return (
      <a key={item.key} href={item.href} className={itemClassName}>
        {itemContent}
      </a>
    );
  };

  return (
    <nav
      className={cn(
        'fixed right-0 bottom-0 left-0 transition-transform duration-300',
        isVisible ? 'translate-y-0' : 'translate-y-full',
        'border-t border-theme-border bg-theme-surface px-4 py-2',
        className,
      )}
      style={{ zIndex }}
      aria-label={ariaLabel}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between">
        {/* Nav items */}
        {items.map(renderItem)}

        {/* Right slot (hamburger, etc.) */}
        {rightSlot}
      </div>
    </nav>
  );
};

export default BottomNavCatto;
