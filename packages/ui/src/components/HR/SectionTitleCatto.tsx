'use client';

import { cn } from '../../utils';

export interface SectionTitleCattoProps {
  /** Main title text */
  title: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * Section title with optional subtitle
 *
 * Note: The subtitle uses fade-in animation which requires:
 * ```ts
 * animation: {
 *   'fade-in': 'fadeIn 1s ease-in-out',
 * },
 * keyframes: {
 *   fadeIn: {
 *     from: { opacity: 0 },
 *     to: { opacity: 1 },
 *   },
 * },
 * ```
 */
const SectionTitleCatto: React.FC<SectionTitleCattoProps> = ({
  title,
  subtitle,
  className,
}) => {
  return (
    <div className={cn('text-center my-6', className)}>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 animate-fade-in">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitleCatto;
