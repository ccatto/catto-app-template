// @catto/ui - MobileScrollIndicatorWrapperCatto
// Horizontal scroll wrapper with gradient indicators and navigation buttons
'use client';

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils';
import ButtonCatto from '../Button/ButtonCatto';

export interface MobileScrollIndicatorWrapperCattoProps {
  /** Content to be scrollable */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Show gradient overlays at scroll edges (default: true) */
  showGradients?: boolean;
  /** Show chevron icons at edges (default: true) */
  showChevrons?: boolean;
  /** Light mode gradient color class (default: 'from-gray-100') */
  gradientColor?: string;
  /** Dark mode gradient color class (default: 'dark:from-gray-900') */
  gradientColorDark?: string;
  /** Width of gradient overlay (default: 'w-12') */
  gradientWidth?: string;
  /** Show scroll navigation buttons (default: false) */
  showScrollButtons?: boolean;
  /** Show first-time tutorial hint (default: false) */
  showTutorial?: boolean;
  /** Scroll amount in pixels per button click (default: 200) */
  scrollAmount?: number;
  /** Enable keyboard arrow navigation (default: true) */
  keyboardControls?: boolean;
  /** Accent color theme (default: 'orange') */
  accentColor?: 'orange' | 'blue' | 'default';
}

const MobileScrollIndicatorWrapperCatto = ({
  children,
  className = '',
  showGradients = true,
  showChevrons = true,
  gradientColor = 'from-gray-100',
  gradientColorDark = 'dark:from-gray-900',
  gradientWidth = 'w-12',
  showScrollButtons = false,
  showTutorial = false,
  scrollAmount = 200,
  keyboardControls = true,
  accentColor = 'orange',
  ...props
}: MobileScrollIndicatorWrapperCattoProps) => {
  const [showRightIndicator, setShowRightIndicator] = useState<boolean>(false);
  const [showLeftIndicator, setShowLeftIndicator] = useState<boolean>(false);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('has-seen-scroll-tutorial') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (showTutorial) {
      if (typeof window !== 'undefined' && !hasSeenTutorial) {
        localStorage.setItem('has-seen-scroll-tutorial', 'true');
        setHasSeenTutorial(true);
      }
    }
  }, [showTutorial, hasSeenTutorial]);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Dynamic accent color classes
  const getAccentClasses = () => {
    switch (accentColor) {
      case 'orange':
        return {
          button:
            'hover:bg-theme-secondary-subtle active:bg-theme-secondary-subtle',
          icon: 'text-theme-secondary',
          gradient: 'from-slate-50 dark:from-slate-800',
        };
      case 'blue':
        return {
          button:
            'hover:bg-theme-primary-subtle active:bg-theme-primary-subtle',
          icon: 'text-theme-primary',
          gradient: 'from-slate-50 dark:from-slate-800',
        };
      default:
        return {
          button:
            'hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600',
          icon: 'text-gray-600 dark:text-gray-400',
          gradient: `${gradientColor} ${gradientColorDark}`,
        };
    }
  };

  const accentClasses = getAccentClasses();

  const checkScroll = useCallback(() => {
    const element = scrollContainerRef.current;
    if (element) {
      const hasHorizontalScroll = element.scrollWidth > element.clientWidth;
      const isAtStart = element.scrollLeft <= 0;
      const isAtEnd =
        element.scrollLeft + element.clientWidth >= element.scrollWidth - 1;

      setShowRightIndicator(hasHorizontalScroll && !isAtEnd);
      setShowLeftIndicator(hasHorizontalScroll && !isAtStart);
    }
  }, []);

  const scroll = useCallback(
    (direction: 'left' | 'right') => {
      const element = scrollContainerRef.current;
      if (element) {
        setIsScrolling(true);
        const scrollValue = direction === 'left' ? -scrollAmount : scrollAmount;
        element.scrollBy({
          left: scrollValue,
          behavior: 'smooth',
        });
        setTimeout(() => setIsScrolling(false), 300);
      }
    },
    [scrollAmount],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!keyboardControls) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        scroll('left');
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        scroll('right');
        e.preventDefault();
      }
    },
    [keyboardControls, scroll],
  );

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver(() => {
      checkScroll();
    });

    observer.observe(element);
    element.addEventListener('scroll', checkScroll);
    if (keyboardControls) {
      window.addEventListener('keydown', handleKeyDown);
    }

    checkScroll();

    return () => {
      observer.disconnect();
      element.removeEventListener('scroll', checkScroll);
      if (keyboardControls) {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [keyboardControls, handleKeyDown, checkScroll]);

  return (
    <div className={cn('relative', className)} {...props} role="region">
      {/* Left gradient and button */}
      {(showGradients || showScrollButtons) && showLeftIndicator && (
        <div
          className={cn(
            'absolute top-0 bottom-0 left-0 bg-linear-to-r animate-fadeIn z-10 flex items-center to-transparent',
            gradientWidth,
            accentClasses.gradient,
          )}
        >
          {showScrollButtons && (
            <ButtonCatto
              variant="pillOutline"
              size="small"
              width="fit"
              onClick={() => scroll('left')}
              className={cn(
                'p-1.5 min-w-0 ml-1',
                isScrolling && 'animate-shrink',
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </ButtonCatto>
          )}
          {showChevrons && !showScrollButtons && (
            <ChevronLeft
              className={cn('h-5 w-5 ml-1 animate-bounce', accentClasses.icon)}
            />
          )}
        </div>
      )}

      {/* Right gradient and button */}
      {(showGradients || showScrollButtons) && showRightIndicator && (
        <div
          className={cn(
            'absolute top-0 right-0 bottom-0 bg-linear-to-l animate-fadeIn z-10 flex items-center justify-end to-transparent',
            gradientWidth,
            accentClasses.gradient,
          )}
        >
          {showScrollButtons && (
            <ButtonCatto
              variant="pillOutline"
              size="small"
              width="fit"
              onClick={() => scroll('right')}
              className={cn(
                'p-1.5 min-w-0 mr-1',
                isScrolling && 'animate-shrink',
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </ButtonCatto>
          )}
          {showChevrons && !showScrollButtons && (
            <ChevronRight
              className={cn(
                'h-5 w-5 mr-1',
                accentClasses.icon,
                showTutorial && !hasSeenTutorial
                  ? 'animate-bounce-highlight'
                  : 'animate-bounce',
              )}
            />
          )}
          {showTutorial && !hasSeenTutorial && (
            <div className="absolute right-0 -bottom-6 text-sm text-theme-text-muted">
              Use arrows to scroll through content
            </div>
          )}
        </div>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-gray-600 overflow-x-auto"
        onScroll={checkScroll}
        tabIndex={0}
        role="scrollbox"
        aria-orientation="horizontal"
      >
        {children}
      </div>
    </div>
  );
};

export default MobileScrollIndicatorWrapperCatto;
