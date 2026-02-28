'use client';

import { cn } from '../../utils';

export interface HRSquareCattoProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Single square divider element
 */
const HRSquareCatto: React.FC<HRSquareCattoProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'w-3 h-3 bg-theme-primary mx-auto my-4 rounded-sm',
        className,
      )}
    />
  );
};

export default HRSquareCatto;
