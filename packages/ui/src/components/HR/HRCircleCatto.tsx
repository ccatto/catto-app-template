'use client';

import { cn } from '../../utils';

export interface HRCircleCattoProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Circle-decorated divider element
 */
const HRCircleCatto: React.FC<HRCircleCattoProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'w-3 h-3 bg-theme-secondary rounded-full mx-auto my-4',
        className,
      )}
    />
  );
};

export default HRCircleCatto;
