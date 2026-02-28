'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ButtonCatto from '../Button/ButtonCatto';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  /** Optional icon to display before label */
  icon?: React.ReactNode;
  /** Disable this tab */
  disabled?: boolean;
}

export interface TabsCattoProps {
  /** Array of tab items */
  tabs: TabItem[];
  /** ID of the default active tab (used for uncontrolled mode) */
  defaultTab?: string;
  /** Controlled active tab ID - if provided, component is controlled and parent manages state */
  activeTab?: string;
  /** Visual style variant */
  variant?: 'default' | 'underline' | 'pills' | 'bordered';
  /** Font size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  /** Whether tabs should stretch to fill container width */
  fullWidth?: boolean;
  /** Callback when active tab changes (legacy, kept for backwards compatibility) */
  onChange?: (tabId: string) => void;
  /** Callback when tab changes - preferred for controlled mode */
  onTabChange?: (tabId: string) => void;
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for the tab buttons container */
  tabsClassName?: string;
  /** Additional CSS classes for the content area */
  contentClassName?: string;
  /** Alignment of tabs */
  align?: 'left' | 'center' | 'right';
  /** Enable horizontal scrolling when tabs overflow (recommended for mobile) */
  scrollable?: boolean;
  /** Show scroll indicator chevrons when content overflows */
  showScrollIndicators?: boolean;
  /** Tailwind `from-*` class for scroll gradient blending.
   *  Defaults to 'from-theme-background' (page bg).
   *  Use 'from-theme-surface' when inside a CardCatto. */
  scrollGradientFrom?: string;
}

/**
 * TabsCatto - A flexible tabs component for navigation between content sections
 *
 * Features:
 * - Multiple visual variants (default, underline, pills, bordered)
 * - Configurable font sizes (sm, md, lg, xl, 2xl, 3xl) for accessibility
 * - Full dark/light mode support
 * - Optional icons
 * - Disabled state support
 * - Flexible alignment and width options
 * - Mobile-friendly scrollable mode with indicators
 */
const TabsCatto: React.FC<TabsCattoProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  onChange,
  onTabChange,
  className = '',
  tabsClassName = '',
  contentClassName = '',
  align = 'left',
  scrollable = false,
  showScrollIndicators = true,
  scrollGradientFrom = 'from-theme-background',
}) => {
  // Determine if controlled mode (parent manages state)
  const isControlled = controlledActiveTab !== undefined;

  // Internal state for uncontrolled mode
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id,
  );

  // Use controlled value if provided, otherwise use internal state
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Scroll a tab into view
  const scrollTabIntoView = useCallback(
    (tabId: string) => {
      if (!scrollable) return;

      const container = scrollContainerRef.current;
      const tabElement = tabRefs.current.get(tabId);

      if (container && tabElement) {
        const containerRect = container.getBoundingClientRect();
        const tabRect = tabElement.getBoundingClientRect();

        // Check if tab is fully visible
        const isFullyVisible =
          tabRect.left >= containerRect.left &&
          tabRect.right <= containerRect.right;

        if (!isFullyVisible) {
          // Scroll to center the tab in view
          const scrollLeft =
            tabElement.offsetLeft -
            container.clientWidth / 2 +
            tabElement.clientWidth / 2;
          container.scrollTo({
            left: Math.max(0, scrollLeft),
            behavior: 'smooth',
          });
        }
      }
    },
    [scrollable],
  );

  const handleTabClick = (tabId: string) => {
    // Only update internal state in uncontrolled mode
    if (!isControlled) {
      setInternalActiveTab(tabId);
    }
    // Call both callbacks for flexibility
    onChange?.(tabId);
    onTabChange?.(tabId);
    // Scroll the clicked tab into view
    scrollTabIntoView(tabId);
  };

  // Check scroll position to show/hide indicators
  const checkScroll = useCallback(() => {
    const element = scrollContainerRef.current;
    if (element && scrollable) {
      const hasHorizontalScroll = element.scrollWidth > element.clientWidth;
      const isAtStart = element.scrollLeft <= 1;
      const isAtEnd =
        element.scrollLeft + element.clientWidth >= element.scrollWidth - 1;

      setShowLeftIndicator(hasHorizontalScroll && !isAtStart);
      setShowRightIndicator(hasHorizontalScroll && !isAtEnd);
    }
  }, [scrollable]);

  // Setup scroll detection and initial scroll position
  useEffect(() => {
    if (!scrollable) return;

    const element = scrollContainerRef.current;
    if (!element) return;

    // Reset scroll to start (far left) on mount
    element.scrollLeft = 0;

    // Initial check after a brief delay to ensure layout is complete
    const initialCheckTimeout = setTimeout(() => {
      checkScroll();
    }, 50);

    // Watch for size changes
    const resizeObserver = new ResizeObserver(() => {
      checkScroll();
    });

    resizeObserver.observe(element);
    element.addEventListener('scroll', checkScroll);

    return () => {
      clearTimeout(initialCheckTimeout);
      resizeObserver.disconnect();
      element.removeEventListener('scroll', checkScroll);
    };
  }, [scrollable, checkScroll, tabs.length]);

  // Detect desktop viewport for centering (only when scrollable)
  useEffect(() => {
    if (!scrollable) return;
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [scrollable]);

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
    xl: 'px-6 py-3 text-xl',
    '2xl': 'px-7 py-3.5 text-2xl',
    '3xl': 'px-8 py-4 text-3xl',
  };

  // Get styles for each variant
  const getTabStyles = (isActive: boolean, isDisabled: boolean) => {
    const base = `${sizeClasses[size]} font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-theme-secondary focus:ring-offset-2 dark:focus:ring-offset-gray-900 whitespace-nowrap`;

    if (isDisabled) {
      return `${base} cursor-not-allowed opacity-50 text-gray-400 dark:text-gray-600`;
    }

    switch (variant) {
      case 'underline':
        return `${base} border-b-2 ${
          isActive
            ? 'text-theme-secondary border-theme-secondary'
            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
        }`;

      case 'pills':
        return `${base} rounded-full ${
          isActive
            ? 'bg-theme-secondary text-theme-on-secondary'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`;

      case 'bordered':
        return `${base} border-2 rounded-lg ${
          isActive
            ? 'border-theme-secondary bg-theme-secondary-subtle text-theme-secondary'
            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-800'
        }`;

      default: // 'default'
        return `${base} rounded-t-lg border-b-2 ${
          isActive
            ? 'bg-theme-surface text-theme-secondary border-theme-secondary'
            : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800'
        }`;
    }
  };

  // Container alignment classes
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  // Tab container border based on variant
  const containerBorderClass =
    variant === 'underline'
      ? 'border-b border-gray-200 dark:border-gray-700'
      : variant === 'bordered' || variant === 'pills'
        ? 'gap-2'
        : 'gap-1';

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  // Render tab buttons
  const renderTabs = () => (
    <>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => {
            if (el) {
              tabRefs.current.set(tab.id, el);
            } else {
              tabRefs.current.delete(tab.id);
            }
          }}
          onClick={() => !tab.disabled && handleTabClick(tab.id)}
          className={`${getTabStyles(activeTab === tab.id, !!tab.disabled)} ${
            fullWidth ? 'flex-1' : ''
          } flex items-center justify-center gap-2 flex-shrink-0`}
          aria-selected={activeTab === tab.id}
          aria-disabled={tab.disabled}
          role="tab"
          tabIndex={tab.disabled ? -1 : 0}
        >
          {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </>
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Headers */}
      {scrollable ? (
        <div className="relative">
          {/* Left scroll indicator - gradient fade */}
          {showScrollIndicators && showLeftIndicator && (
            <div
              className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r ${scrollGradientFrom} to-transparent z-10 flex items-center pl-1 pointer-events-none`}
            >
              <ButtonCatto
                variant="pillOutline"
                size="small"
                width="fit"
                onClick={() => {
                  scrollContainerRef.current?.scrollBy({
                    left: -150,
                    behavior: 'smooth',
                  });
                }}
                className="p-1.5 min-w-0 pointer-events-auto"
                aria-label="Scroll tabs left"
              >
                <ChevronLeft className="h-4 w-4" />
              </ButtonCatto>
            </div>
          )}

          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            className={`flex ${containerBorderClass} ${tabsClassName} overflow-x-auto scrollbar-hide`}
            role="tablist"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div
              className="flex min-w-max"
              style={{
                // Center tabs on desktop when they fit, scroll from left when they overflow
                ...(isDesktop &&
                  !showLeftIndicator &&
                  !showRightIndicator && {
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }),
              }}
            >
              {renderTabs()}
            </div>
          </div>

          {/* Right scroll indicator - gradient fade */}
          {showScrollIndicators && showRightIndicator && (
            <div
              className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l ${scrollGradientFrom} to-transparent z-10 flex items-center justify-end pr-1 pointer-events-none`}
            >
              <ButtonCatto
                variant="pillOutline"
                size="small"
                width="fit"
                onClick={() => {
                  scrollContainerRef.current?.scrollBy({
                    left: 150,
                    behavior: 'smooth',
                  });
                }}
                className="p-1.5 min-w-0 pointer-events-auto"
                aria-label="Scroll tabs right"
              >
                <ChevronRight className="h-4 w-4" />
              </ButtonCatto>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`flex ${alignClasses[align]} ${containerBorderClass} ${tabsClassName}`}
          role="tablist"
        >
          {renderTabs()}
        </div>
      )}

      {/* Tab Content */}
      <div className={`mt-4 ${contentClassName}`} role="tabpanel">
        {activeContent}
      </div>
    </div>
  );
};

export default TabsCatto;
