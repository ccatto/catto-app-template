'use client';

import { cn } from '../../utils';

export interface HRPartyPulseCattoProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Party/pulse animated divider with color cycling
 *
 * Note: Requires the following Tailwind config for animation:
 * ```ts
 * animation: {
 *   partyPulse: 'partyPulse 1.5s ease-in-out infinite',
 * },
 * keyframes: {
 *   partyPulse: {
 *     '0%': { borderColor: '#f97316' },   // orange-500
 *     '25%': { borderColor: '#2563eb' },  // blue-600
 *     '50%': { borderColor: '#9333ea' },  // purple-600
 *     '75%': { borderColor: '#10b981' },  // emerald-500
 *     '100%': { borderColor: '#f97316' },
 *   },
 * },
 * ```
 */
const HRPartyPulseCatto: React.FC<HRPartyPulseCattoProps> = ({ className }) => {
  return (
    <hr
      className={cn(
        'w-64 border-t-4 border-dashed border-transparent my-6 mx-auto animate-[partyPulse_1.5s_ease-in-out_infinite]',
        className,
      )}
    />
  );
};

export default HRPartyPulseCatto;
