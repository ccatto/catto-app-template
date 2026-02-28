// @catto/ui - NavLinkGroupCatto Component
// Grouped navigation links with optional section header
'use client';

import React from 'react';
import { cn } from '../../utils';

// ============================================
// Types
// ============================================

export interface NavLinkItem {
  /** Unique key for the item */
  key: string;
  /** Icon to display before label */
  icon?: React.ReactNode;
  /** Label text */
  label: string;
  /** Navigation href (if using links) */
  href?: string;
  /** Click handler (if using buttons) */
  onClick?: () => void;
  /** Whether this item is currently active */
  isActive?: boolean;
}

export interface NavLinkGroupCattoProps {
  /** Optional section title displayed above the links */
  title?: string;
  /** Optional icon displayed before the title */
  titleIcon?: React.ReactNode;
  /** Navigation items in this group */
  items: NavLinkItem[];
  /** Custom Link component (for Next.js Link, etc.) */
  LinkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    children: React.ReactNode;
  }>;
  /** Variant for title styling */
  titleVariant?: 'default' | 'accent';
  /** Additional className for the container */
  className?: string;
  /** Additional className for items */
  itemClassName?: string;
}

/**
 * NavLinkGroupCatto - Grouped navigation links with optional section header
 *
 * Features:
 * - Optional section title with icon
 * - List of nav items with icon + label
 * - Active state highlighting
 * - Support for custom Link component
 * - Theme-aware styling
 *
 * Usage:
 * ```tsx
 * <NavLinkGroupCatto
 *   title="Main"
 *   items={[
 *     { key: 'home', icon: <Home />, label: 'Home', href: '/', isActive: true },
 *     { key: 'about', icon: <Info />, label: 'About', href: '/about' },
 *   ]}
 *   LinkComponent={Link}
 * />
 * ```
 */
const NavLinkGroupCatto: React.FC<NavLinkGroupCattoProps> = ({
  title,
  titleIcon,
  items,
  LinkComponent,
  titleVariant = 'default',
  className,
  itemClassName,
}) => {
  // Render a single nav item
  const renderItem = (item: NavLinkItem) => {
    const itemContent = (
      <>
        {item.icon}
        <span className="text-sm font-medium">{item.label}</span>
      </>
    );

    const baseItemClassName = cn(
      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
      item.isActive
        ? 'bg-theme-secondary-subtle text-theme-secondary'
        : 'text-theme-text-muted hover:bg-theme-surface-secondary',
      itemClassName,
    );

    // If custom Link component provided and href exists, use it
    if (LinkComponent && item.href) {
      return (
        <LinkComponent
          key={item.key}
          href={item.href}
          className={baseItemClassName}
        >
          {itemContent}
        </LinkComponent>
      );
    }

    // If onClick provided, use button
    if (item.onClick) {
      return (
        <button
          key={item.key}
          onClick={item.onClick}
          className={baseItemClassName}
          type="button"
        >
          {itemContent}
        </button>
      );
    }

    // Fallback to anchor tag if href provided
    if (item.href) {
      return (
        <a key={item.key} href={item.href} className={baseItemClassName}>
          {itemContent}
        </a>
      );
    }

    // No navigation, just render as div
    return (
      <div key={item.key} className={baseItemClassName}>
        {itemContent}
      </div>
    );
  };

  return (
    <div className={cn('space-y-1', className)}>
      {/* Section Title */}
      {title && (
        <div
          className={cn(
            'mb-2 flex items-center gap-2 px-3',
            titleVariant === 'accent'
              ? 'text-theme-secondary'
              : 'text-theme-text-subtle',
          )}
        >
          {titleIcon}
          <p className="text-xs font-semibold uppercase tracking-wider">
            {title}
          </p>
        </div>
      )}

      {/* Nav Items */}
      {items.map(renderItem)}
    </div>
  );
};

export default NavLinkGroupCatto;
