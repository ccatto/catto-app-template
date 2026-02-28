'use client';

import { useCallback, useEffect, useState } from 'react';

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
  isSupported: boolean;
  /** Detected country code (e.g., 'US', 'CA') */
  countryCode: string | null;
  /** Detected state/province code (e.g., 'CA' for California, 'ON' for Ontario) */
  stateCode: string | null;
}

export interface UseGeolocationOptions {
  /** SessionStorage key for caching. Default: 'catto_geolocation' */
  sessionKey?: string;
  /** User-Agent for Nominatim API. Default: 'CattoMobile/1.0' */
  userAgent?: string;
}

export interface UseGeolocationReturn extends GeolocationState {
  /** Manually re-request location */
  refresh: () => void;
}

/**
 * Reverse geocode coordinates to get country and state/province
 * Uses OpenStreetMap Nominatim (free, no API key needed)
 */
async function reverseGeocode(
  lat: number,
  lon: number,
  userAgent: string,
): Promise<{ countryCode: string | null; stateCode: string | null }> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      {
        headers: {
          'User-Agent': userAgent,
        },
      },
    );

    if (!response.ok) {
      return { countryCode: null, stateCode: null };
    }

    const data = await response.json();
    const address = data.address || {};

    const countryCode = address.country_code?.toUpperCase() || null;

    let stateCode: string | null = null;

    if (countryCode === 'US') {
      const isoCode = address['ISO3166-2-lvl4'];
      if (isoCode && isoCode.startsWith('US-')) {
        stateCode = isoCode.replace('US-', '');
      }
    } else if (countryCode === 'CA') {
      const isoCode = address['ISO3166-2-lvl4'];
      if (isoCode && isoCode.startsWith('CA-')) {
        stateCode = isoCode.replace('CA-', '');
      }
    } else {
      const isoCode = address['ISO3166-2-lvl4'] || address['ISO3166-2-lvl6'];
      if (isoCode) {
        const parts = isoCode.split('-');
        if (parts.length > 1) {
          stateCode = parts.slice(1).join('-');
        }
      }
    }

    return { countryCode, stateCode };
  } catch {
    return { countryCode: null, stateCode: null };
  }
}

/**
 * Hook to get the user's geolocation.
 * Caches result in sessionStorage to avoid repeated browser prompts.
 * Works in both web browsers and Capacitor WebView.
 */
export function useGeolocation(
  options: UseGeolocationOptions = {},
): UseGeolocationReturn {
  const { sessionKey = 'catto_geolocation', userAgent = 'CattoMobile/1.0' } =
    options;

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
    isSupported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
    countryCode: null,
    stateCode: null,
  });

  const requestLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Geolocation not supported',
        isSupported: false,
      }));
      return;
    }

    // Check sessionStorage cache first
    try {
      const cached = sessionStorage.getItem(sessionKey);
      if (cached) {
        const { latitude, longitude, countryCode, stateCode } =
          JSON.parse(cached);
        if (typeof latitude === 'number' && typeof longitude === 'number') {
          setState({
            latitude,
            longitude,
            loading: false,
            error: null,
            isSupported: true,
            countryCode: countryCode || null,
            stateCode: stateCode || null,
          });

          if (!countryCode) {
            reverseGeocode(latitude, longitude, userAgent)
              .then(({ countryCode: newCountry, stateCode: newState }) => {
                try {
                  sessionStorage.setItem(
                    sessionKey,
                    JSON.stringify({
                      latitude,
                      longitude,
                      countryCode: newCountry,
                      stateCode: newState,
                    }),
                  );
                } catch {
                  // Ignore storage errors
                }

                setState((prev) => ({
                  ...prev,
                  countryCode: newCountry,
                  stateCode: newState,
                }));
              })
              .catch(() => {
                // Silently fail
              });
          }

          return;
        }
      }
    } catch {
      // Ignore parse errors, proceed to request
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        setState((prev) => ({
          ...prev,
          latitude,
          longitude,
          loading: false,
          error: null,
          isSupported: true,
        }));

        const { countryCode, stateCode } = await reverseGeocode(
          latitude,
          longitude,
          userAgent,
        );

        try {
          sessionStorage.setItem(
            sessionKey,
            JSON.stringify({ latitude, longitude, countryCode, stateCode }),
          );
        } catch {
          // Ignore storage errors
        }

        setState((prev) => ({
          ...prev,
          countryCode,
          stateCode,
        }));
      },
      (err) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
        }));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }, [sessionKey, userAgent]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    ...state,
    refresh: requestLocation,
  };
}

export default useGeolocation;
