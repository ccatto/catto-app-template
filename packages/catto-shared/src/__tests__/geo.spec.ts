import { formatDistance, getDistanceKm, kmToMiles } from '../geo';

describe('geo', () => {
  describe('getDistanceKm()', () => {
    it('calculates known distance (NYC to LA ~3940 km)', () => {
      // NYC: 40.7128, -74.0060 | LA: 34.0522, -118.2437
      const distance = getDistanceKm(40.7128, -74.006, 34.0522, -118.2437);
      expect(distance).toBeGreaterThan(3900);
      expect(distance).toBeLessThan(4000);
    });

    it('returns 0 for same point', () => {
      const distance = getDistanceKm(40.7128, -74.006, 40.7128, -74.006);
      expect(distance).toBe(0);
    });

    it('calculates short distances accurately', () => {
      // ~1 km apart in Manhattan
      const distance = getDistanceKm(40.748, -73.9857, 40.7578, -73.9857);
      expect(distance).toBeGreaterThan(0.5);
      expect(distance).toBeLessThan(2);
    });
  });

  describe('kmToMiles()', () => {
    it('converts correctly (1 km = 0.621371 mi)', () => {
      expect(kmToMiles(1)).toBeCloseTo(0.621371, 4);
    });

    it('converts 0 km to 0 miles', () => {
      expect(kmToMiles(0)).toBe(0);
    });

    it('converts 10 km correctly', () => {
      expect(kmToMiles(10)).toBeCloseTo(6.21371, 3);
    });
  });

  describe('formatDistance()', () => {
    it('returns miles format by default', () => {
      expect(formatDistance(10)).toContain('mi');
    });

    it('returns km format when useMiles=false', () => {
      expect(formatDistance(10, false)).toContain('km');
    });

    it('handles very small distances in miles', () => {
      expect(formatDistance(0.01)).toBe('< 0.1 mi');
    });

    it('handles very small distances in km', () => {
      expect(formatDistance(0.01, false)).toBe('< 100m');
    });

    it('formats medium distance in miles with 1 decimal', () => {
      // 5 km = ~3.1 mi
      const result = formatDistance(5);
      expect(result).toMatch(/\d+\.\d mi/);
    });

    it('formats large distance in miles as integer', () => {
      // 50 km = ~31 mi
      const result = formatDistance(50);
      expect(result).toMatch(/^\d+ mi$/);
    });
  });
});
