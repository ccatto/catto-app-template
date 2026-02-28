'use client';

import { cn } from '../../utils';

export interface HRSquaresCattoProps {
  /** Number of squares to display */
  count?: number;
  /** Tailwind width/height classes (e.g., 'w-3 h-3') */
  size?: string;
  /** Tailwind gap class (e.g., 'gap-2') */
  gap?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Multiple squares divider element
 */
const HRSquaresCatto: React.FC<HRSquaresCattoProps> = ({
  count = 10,
  size = 'w-3 h-3',
  gap = 'gap-2',
  className,
}) => {
  return (
    <div
      className={cn('flex justify-center items-center my-4', gap, className)}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={cn(size, 'bg-theme-primary rounded-sm')} />
      ))}
    </div>
  );
};

export default HRSquaresCatto;
