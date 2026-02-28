'use client';

import { cn } from '../../utils';

export interface HRDividerCattoProps {
  /** Tailwind width class (e.g., 'w-48', 'w-full') */
  width?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Basic dashed divider line
 */
const HRDividerCatto: React.FC<HRDividerCattoProps> = ({
  width = 'w-48',
  className = '',
}) => {
  return (
    <hr
      className={cn(
        width,
        'border-t border-dashed border-slate-500 dark:border-slate-600 my-2 mx-auto',
        className,
      )}
    />
  );
};

export default HRDividerCatto;
