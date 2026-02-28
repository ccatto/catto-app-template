'use client';

import { cn } from '../../utils';

export interface HRHypnoCattoProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Spinning hypnotic circle divider element
 */
const HRHypnoCatto: React.FC<HRHypnoCattoProps> = ({ className }) => {
  return (
    <div className={cn('relative w-12 h-12 mx-auto my-6', className)}>
      <div className="absolute inset-0 rounded-full border-4 border-theme-primary border-t-theme-secondary animate-spin" />
    </div>
  );
};

export default HRHypnoCatto;
