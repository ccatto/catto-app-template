'use client';

import { cn } from '../../utils';

export interface HRSubtleCattoProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Subtle/minimal divider with reduced opacity
 */
const HRSubtleCatto: React.FC<HRSubtleCattoProps> = ({ className }) => {
  return (
    <hr
      className={cn(
        'w-32 border-t border-slate-300 dark:border-slate-700 my-2 mx-auto opacity-50',
        className,
      )}
    />
  );
};

export default HRSubtleCatto;
