import {
  adjustBrightness,
  deriveThemeColors,
  getContrastColor,
  getLuminance,
  hexToRgb,
  isValidHexColor,
  rgbToHex,
} from '../color-utils';

describe('color-utils', () => {
  describe('hexToRgb()', () => {
    it('parses 6-digit hex', () => {
      expect(hexToRgb('#ff8000')).toEqual({ r: 255, g: 128, b: 0 });
    });

    it('parses 3-digit hex', () => {
      expect(hexToRgb('#f80')).toEqual({ r: 255, g: 136, b: 0 });
    });

    it('parses hex without # prefix', () => {
      expect(hexToRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('parses black', () => {
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('parses white', () => {
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    });
  });

  describe('rgbToHex()', () => {
    it('converts RGB to hex', () => {
      expect(rgbToHex(255, 128, 0)).toBe('#ff8000');
    });

    it('converts black', () => {
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
    });

    it('converts white', () => {
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
    });

    it('clamps values above 255', () => {
      expect(rgbToHex(300, 128, 0)).toBe('#ff8000');
    });
  });

  describe('adjustBrightness()', () => {
    it('lightens a color', () => {
      const result = adjustBrightness('#800000', 50);
      const rgb = hexToRgb(result);
      expect(rgb.r).toBeGreaterThan(128);
    });

    it('darkens a color', () => {
      const result = adjustBrightness('#ff8000', -50);
      const rgb = hexToRgb(result);
      expect(rgb.r).toBeLessThan(255);
      expect(rgb.g).toBeLessThan(128);
    });

    it('returns same color at 0%', () => {
      expect(adjustBrightness('#ff8000', 0)).toBe('#ff8000');
    });
  });

  describe('getLuminance()', () => {
    it('returns ~0 for black', () => {
      expect(getLuminance('#000000')).toBeCloseTo(0, 2);
    });

    it('returns ~1 for white', () => {
      expect(getLuminance('#ffffff')).toBeCloseTo(1, 2);
    });

    it('returns mid-range for gray', () => {
      const lum = getLuminance('#808080');
      expect(lum).toBeGreaterThan(0.1);
      expect(lum).toBeLessThan(0.5);
    });
  });

  describe('getContrastColor()', () => {
    it('returns white for dark backgrounds', () => {
      expect(getContrastColor('#000000')).toBe('#ffffff');
      expect(getContrastColor('#1a1a2e')).toBe('#ffffff');
    });

    it('returns black for light backgrounds', () => {
      expect(getContrastColor('#ffffff')).toBe('#000000');
      expect(getContrastColor('#f0f0f0')).toBe('#000000');
    });
  });

  describe('deriveThemeColors()', () => {
    it('returns all expected properties', () => {
      const theme = deriveThemeColors('#ff6600');
      expect(theme).toHaveProperty('base', '#ff6600');
      expect(theme).toHaveProperty('hover');
      expect(theme).toHaveProperty('active');
      expect(theme).toHaveProperty('subtle');
      expect(theme).toHaveProperty('onColor');
    });

    it('hover is darker than base', () => {
      const theme = deriveThemeColors('#ff6600');
      const baseRgb = hexToRgb(theme.base);
      const hoverRgb = hexToRgb(theme.hover);
      // At least one channel should be darker
      expect(hoverRgb.r + hoverRgb.g + hoverRgb.b).toBeLessThan(
        baseRgb.r + baseRgb.g + baseRgb.b,
      );
    });

    it('subtle is lighter than base', () => {
      const theme = deriveThemeColors('#ff6600');
      const baseRgb = hexToRgb(theme.base);
      const subtleRgb = hexToRgb(theme.subtle);
      expect(subtleRgb.r + subtleRgb.g + subtleRgb.b).toBeGreaterThan(
        baseRgb.r + baseRgb.g + baseRgb.b,
      );
    });
  });

  describe('isValidHexColor()', () => {
    it('validates correct 6-digit hex with #', () => {
      expect(isValidHexColor('#ff6600')).toBe(true);
      expect(isValidHexColor('#FF6600')).toBe(true);
      expect(isValidHexColor('#000000')).toBe(true);
    });

    it('rejects invalid formats', () => {
      expect(isValidHexColor('ff6600')).toBe(false); // Missing #
      expect(isValidHexColor('#f60')).toBe(false); // 3-digit
      expect(isValidHexColor('#gggggg')).toBe(false); // Invalid chars
      expect(isValidHexColor('')).toBe(false);
    });
  });
});
