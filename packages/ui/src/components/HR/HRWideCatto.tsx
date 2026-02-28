'use client';

import { cn } from '../../utils';

export interface HRWideCattoProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Full-width divider with thicker border
 */
const HRWideCatto: React.FC<HRWideCattoProps> = ({ className }) => {
  return (
    <hr
      className={cn('w-full border-t-2 border-theme-primary my-6', className)}
    />
  );
};

export default HRWideCatto;
