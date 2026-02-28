// Geolocation utilities for distance calculation

/**
 * Calculate distance between two coordinates in kilometers using the Haversine formula.
 */
export function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert kilometers to miles
 */
export function kmToMiles(km: number): number {
  return km * 0.621371;
}

/**
 * Format distance for display.
 * Shows miles for US/UK users, km for everyone else.
 * @param km - Distance in kilometers
 * @param useMiles - Whether to display in miles (default: true for US)
 */
export function formatDistance(km: number, useMiles = true): string {
  if (useMiles) {
    const miles = kmToMiles(km);
    if (miles < 0.1) return '< 0.1 mi';
    if (miles < 10) return `${miles.toFixed(1)} mi`;
    return `${Math.round(miles)} mi`;
  }
  if (km < 0.1) return '< 100m';
  if (km < 1) return `${Math.round(km * 1000)}m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
