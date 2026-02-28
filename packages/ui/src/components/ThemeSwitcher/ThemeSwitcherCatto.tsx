'use client';

/**
 * ThemeSwitcherCatto - UI component for switching themes
 *
 * Uses SelectCatto for consistent styling with the rest of the UI.
 * Can be placed in settings pages, headers, or nav menus.
 */
import { useTheme } from '../../context/ThemeProvider';
import { THEME_METADATA, type ThemeName } from '../../themes';
import SelectCatto from '../Select/SelectCatto';

export interface ThemeSwitcherCattoProps {
  /** Label shown above the select */
  label?: string;
  /** Size variant for the select */
  size?: 'sm' | 'md' | 'lg';
  /** Width variant */
  width?: 'auto' | 'full' | 'sm' | 'md' | 'lg';
  /** Additional CSS class */
  className?: string;
}

export default function ThemeSwitcherCatto({
  label = 'Theme',
  size = 'md',
  width = 'md',
  className,
}: ThemeSwitcherCattoProps) {
  const { theme, setTheme, availableThemes } = useTheme();

  const options = availableThemes.map((themeName) => {
    const meta = THEME_METADATA[themeName];
    return {
      value: themeName,
      label: meta?.label || themeName,
      // Could add color dot icons here in the future
    };
  });

  return (
    <SelectCatto
      options={options}
      value={theme}
      onChange={(value) => setTheme(value as ThemeName)}
      label={label}
      size={size}
      width={width}
      className={className}
    />
  );
}
