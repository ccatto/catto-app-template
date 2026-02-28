// @catto/ui - useBreakpoint Hook
// Returns the current Tailwind CSS breakpoint name based on window width
// SSR-safe: defaults to 'md' during server rendering
'use client';

import { useEffect, useState } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const BREAKPOINTS: { name: Breakpoint; minWidth: number }[] = [
  { name: '2xl', minWidth: 1536 },
  { name: 'xl', minWidth: 1280 },
  { name: 'lg', minWidth: 1024 },
  { name: 'md', minWidth: 768 },
  { name: 'sm', minWidth: 640 },
];

const BREAKPOINT_ORDER: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

/**
 * Returns the current Tailwind CSS breakpoint.
 * SSR-safe: returns 'md' on the server to avoid hydration mismatches
 * (desktop-first assumption for initial render).
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('md');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueries = BREAKPOINTS.map(({ name, minWidth }) => ({
      name,
      mql: window.matchMedia(`(min-width: ${minWidth}px)`),
    }));

    const determine = () => {
      for (const { name, mql } of mediaQueries) {
        if (mql.matches) {
          setBreakpoint(name);
          return;
        }
      }
      setBreakpoint('xs');
    };

    determine();

    const handlers = mediaQueries.map(({ mql }) => {
      const handler = () => determine();
      mql.addEventListener('change', handler);
      return { mql, handler };
    });

    return () => {
      handlers.forEach(({ mql, handler }) =>
        mql.removeEventListener('change', handler),
      );
    };
  }, []);

  return breakpoint;
}

/**
 * Returns true if `current` breakpoint is below `target`.
 * Useful for responsive column visibility checks.
 *
 * @example
 * isBelow('xs', 'md') // true — xs < md
 * isBelow('lg', 'md') // false — lg >= md
 */
export function isBelow(current: Breakpoint, target: Breakpoint): boolean {
  return BREAKPOINT_ORDER.indexOf(current) < BREAKPOINT_ORDER.indexOf(target);
}
