'use client';

import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '../../utils';

export interface ButtonTogglePillCattoProps {
  /** Callback when toggle state changes */
  onToggle: (isLeft: boolean) => void;
  /** Initial toggle state (true = left/dark, false = right/light) */
  initialState?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Pill-shaped toggle button with sun/moon icons
 * Used for theme switching or binary toggles
 */
const ButtonTogglePillCatto: React.FC<ButtonTogglePillCattoProps> = ({
  onToggle,
  initialState = true,
  className,
}) => {
  const [isLeft, setIsLeft] = useState(initialState);

  const handleToggle = () => {
    setIsLeft(!isLeft);
    onToggle(!isLeft);
  };

  return (
    <div
      className={cn(
        'relative flex h-10 w-24 cursor-pointer items-center rounded-full border-2 border-gray-500 bg-gray-200 p-1 dark:border-gray-400 dark:bg-gray-700',
        className,
      )}
      onClick={handleToggle}
      role="switch"
      aria-checked={isLeft}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      {/* Sliding Circle */}
      <div
        className={cn(
          'absolute h-8 w-8 transform rounded-full bg-gray-400 shadow-md transition-transform dark:bg-slate-900',
          isLeft ? 'translate-x-0' : 'translate-x-13',
        )}
      />

      {/* Left Icon (Moon) */}
      <div
        className={cn(
          'z-10 flex-1 text-center',
          isLeft ? 'opacity-100' : 'opacity-50',
        )}
      >
        <div className="h-6 w-6 pl-1">
          <Moon size={22} />
        </div>
      </div>

      {/* Right Icon (Sun) */}
      <div
        className={cn(
          'z-10 flex-1 text-center',
          isLeft ? 'opacity-50' : 'opacity-100',
        )}
      >
        <div className="h-6 w-6 pl-3.5">
          <Sun size={22} />
        </div>
      </div>
    </div>
  );
};

export default ButtonTogglePillCatto;
