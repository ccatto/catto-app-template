'use client';

import { cn } from '../../utils';

export interface HRTriangleCattoProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Triangle-decorated divider element
 */
const HRTriangleCatto: React.FC<HRTriangleCattoProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'w-0 h-0 mx-auto my-4 border-l-4 border-r-4 border-b-8 border-transparent border-b-theme-primary',
        className,
      )}
    />
  );
};

export default HRTriangleCatto;
