/**
 * @catto/ui Theme System
 * ======================
 *
 * Theme registry and type definitions.
 * Import this module to access available themes and types.
 */

// Available themes - add new themes here
export const THEMES = [
  'rleaguez',
  'neon-pulse',
  'royal-crown',
  'corporate-steel',
  'forest-earth',
] as const;

export type ThemeName = (typeof THEMES)[number];

// Theme metadata for UI display
export interface ThemeMetadata {
  name: ThemeName;
  label: string;
  description: string;
  primaryColor: string; // Hex color for preview
  secondaryColor: string; // Hex color for preview
  isDarkDefault?: boolean; // Whether dark mode is the default for this theme
}

export const THEME_METADATA: Record<ThemeName, ThemeMetadata> = {
  rleaguez: {
    name: 'rleaguez',
    label: 'RLeaguez',
    description: 'Default orange & navy blue theme',
    primaryColor: '#1e40af', // Navy blue
    secondaryColor: '#f97316', // Orange
  },
  'neon-pulse': {
    name: 'neon-pulse',
    label: 'Neon Pulse',
    description: 'Futuristic cyan & purple cyberpunk theme',
    primaryColor: '#06b6d4', // Cyan
    secondaryColor: '#8b5cf6', // Violet
    isDarkDefault: true,
  },
  'royal-crown': {
    name: 'royal-crown',
    label: 'Royal Crown',
    description: 'Bold purple & gold regal theme',
    primaryColor: '#7c3aed', // Violet
    secondaryColor: '#d97706', // Amber/Gold
  },
  'corporate-steel': {
    name: 'corporate-steel',
    label: 'Corporate Steel',
    description: 'Professional deep blue & teal business theme',
    primaryColor: '#1e40af', // Deep Blue
    secondaryColor: '#0d9488', // Teal
  },
  'forest-earth': {
    name: 'forest-earth',
    label: 'Forest Earth',
    description: 'Natural green & amber outdoorsy theme',
    primaryColor: '#166534', // Forest Green
    secondaryColor: '#d97706', // Amber
  },
};

/**
 * Get theme metadata by name
 */
export function getThemeMetadata(theme: ThemeName): ThemeMetadata {
  return THEME_METADATA[theme];
}

/**
 * Check if a string is a valid theme name
 */
export function isValidTheme(theme: string): theme is ThemeName {
  return THEMES.includes(theme as ThemeName);
}

/**
 * CSS file paths for each theme (relative to themes directory)
 * Used by build tools to know which files to include
 */
export const THEME_FILES: Record<ThemeName, string> = {
  rleaguez: './rleaguez.css',
  'neon-pulse': './neon-pulse.css',
  'royal-crown': './royal-crown.css',
  'corporate-steel': './corporate-steel.css',
  'forest-earth': './forest-earth.css',
};
