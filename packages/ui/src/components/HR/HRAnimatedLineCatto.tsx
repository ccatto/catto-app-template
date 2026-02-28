'use client';

import { cn } from '../../utils';

export interface HRAnimatedLineCattoProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Animated gradient line divider
 *
 * Note: Requires the following Tailwind config for animation:
 * ```ts
 * animation: {
 *   marquee: 'marquee 2s linear infinite',
 * },
 * keyframes: {
 *   marquee: {
 *     '0%': { transform: 'translateX(-100%)' },
 *     '100%': { transform: 'translateX(100%)' },
 *   },
 * },
 * ```
 */
const HRAnimatedLineCatto: React.FC<HRAnimatedLineCattoProps> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        'relative w-48 h-1 mx-auto my-4 bg-slate-300 dark:bg-slate-600 overflow-hidden rounded-full',
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--catto-theme-secondary)] via-[var(--catto-theme-primary)] to-[var(--catto-theme-secondary)] animate-[marquee_2s_linear_infinite]" />
    </div>
  );
};

export default HRAnimatedLineCatto;
