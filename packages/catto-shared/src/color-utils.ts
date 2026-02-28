// Pure hex color manipulation utilities for org branding theme derivation.
// Zero external dependencies.

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface DerivedThemeColors {
  base: string;
  hover: string;
  active: string;
  subtle: string;
  onColor: string;
}

/**
 * Parse a hex color string to RGB components.
 * Accepts '#RGB', '#RRGGBB', 'RGB', or 'RRGGBB'.
 */
export function hexToRgb(hex: string): RGB {
  let h = hex.replace(/^#/, '');
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  const num = parseInt(h, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/** Convert RGB components to a '#RRGGBB' hex string. */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((c) => c.toString(16).padStart(2, '0'))
      .join('')
  );
}

/**
 * Adjust brightness of a hex color by a percentage.
 * Positive values lighten, negative values darken.
 * Uses simple linear interpolation toward white (lighten) or black (darken).
 */
export function adjustBrightness(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = percent / 100;

  if (factor >= 0) {
    // Lighten: interpolate toward 255
    return rgbToHex(
      r + (255 - r) * factor,
      g + (255 - g) * factor,
      b + (255 - b) * factor,
    );
  }
  // Darken: interpolate toward 0
  const absFactor = Math.abs(factor);
  return rgbToHex(
    r * (1 - absFactor),
    g * (1 - absFactor),
    b * (1 - absFactor),
  );
}

/**
 * Calculate relative luminance of a hex color (WCAG 2.0 formula).
 * Returns a value between 0 (black) and 1 (white).
 */
export function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Returns '#ffffff' or '#000000' for optimal contrast text on a given background.
 */
export function getContrastColor(hex: string): string {
  return getLuminance(hex) > 0.4 ? '#000000' : '#ffffff';
}

/**
 * Derive a full set of theme color variants from a single base hex color.
 * Used for org branding: given a custom primary/secondary/accent hex,
 * auto-generates hover, active, subtle, and contrast text variants.
 */
export function deriveThemeColors(hex: string): DerivedThemeColors {
  return {
    base: hex,
    hover: adjustBrightness(hex, -10),
    active: adjustBrightness(hex, -20),
    subtle: adjustBrightness(hex, 85),
    onColor: getContrastColor(hex),
  };
}

/** Validate that a string is a valid 6-digit hex color (with #). */
export function isValidHexColor(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}
