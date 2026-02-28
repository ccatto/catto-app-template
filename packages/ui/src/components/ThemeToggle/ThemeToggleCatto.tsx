'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import ButtonTogglePillCatto from '../ButtonTogglePill/ButtonTogglePillCatto';

export interface ThemeToggleCattoProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Theme toggle component using next-themes
 * Renders a pill toggle that switches between dark and light modes
 *
 * Note: Requires next-themes to be installed and configured in the app
 */
const ThemeToggleCatto: React.FC<ThemeToggleCattoProps> = ({ className }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  const toggleTheme = (isLeft: boolean) => {
    setTheme(isLeft ? 'dark' : 'light');
  };

  // Pass current theme state to button (dark = left/true, light = right/false)
  const isDarkMode = theme === 'dark';

  return (
    <ButtonTogglePillCatto
      onToggle={toggleTheme}
      initialState={isDarkMode}
      className={className}
    />
  );
};

export default ThemeToggleCatto;
