'use client';

import { cn } from '../../utils';

export interface HRPulseDividerCattoProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Pulsing divider with orange color
 */
const HRPulseDividerCatto: React.FC<HRPulseDividerCattoProps> = ({
  className,
}) => {
  return (
    <hr
      className={cn(
        'w-48 border-t border-dashed border-theme-secondary my-4 mx-auto animate-pulse',
        className,
      )}
    />
  );
};

export default HRPulseDividerCatto;
