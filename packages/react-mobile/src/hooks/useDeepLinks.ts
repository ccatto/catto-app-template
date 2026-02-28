/**
 * useDeepLinks - Deep link handling hook for iOS/Android
 *
 * Handles custom URL scheme links and universal/app links.
 * Uses Capacitor App plugin to listen for URL opens.
 *
 * Usage:
 *   useDeepLinks({
 *     onDeepLink: (path) => router.push(path),
 *     config: { scheme: 'myapp', domains: ['myapp.com'] },
 *   });
 */
import { useEffect, useRef } from 'react';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { getLogger } from '../logger';

export interface DeepLinkConfig {
  /** Custom URL scheme (e.g., 'myapp'). Default: 'app' */
  scheme?: string;
  /** Associated domains for universal links (e.g., ['myapp.com']). Default: [] */
  domains?: string[];
}

export interface UseDeepLinksOptions {
  /** Callback when a deep link is received */
  onDeepLink?: (path: string, url: string) => void;
  /** Deep link configuration */
  config?: DeepLinkConfig;
}

export interface DeepLinkInfo {
  /** The full URL that was opened */
  url: string;
  /** The path portion (e.g., /org/my-league) */
  path: string;
  /** URL search params if any */
  params: URLSearchParams;
}

/**
 * Parse a deep link URL into its components
 */
export function parseDeepLink(
  url: string,
  config: DeepLinkConfig = {},
): DeepLinkInfo {
  const { scheme = 'app', domains = [] } = config;

  // Handle custom scheme (e.g., myapp://path)
  const schemeRegex = new RegExp(`^${scheme}:\\/\\/`);
  let urlWithoutScheme = url.replace(schemeRegex, '');

  // Handle universal links (e.g., https://www.myapp.com/path)
  for (const domain of domains) {
    const domainRegex = new RegExp(
      `^https?:\\/\\/(www\\.)?${domain.replace('.', '\\.')}`,
    );
    urlWithoutScheme = urlWithoutScheme.replace(domainRegex, '');
  }

  // Extract path and query string
  const [pathPart, queryPart] = urlWithoutScheme.split('?');

  // Ensure path starts with /
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;

  // Parse query params
  const params = new URLSearchParams(queryPart || '');

  return {
    url,
    path,
    params,
  };
}

export function useDeepLinks(options: UseDeepLinksOptions = {}): void {
  const { onDeepLink, config } = options;
  const isNative = Capacitor.isNativePlatform();
  const listenerRegistered = useRef(false);

  useEffect(() => {
    if (!isNative || listenerRegistered.current) return;
    listenerRegistered.current = true;

    // Listen for app URL open events (deep links)
    const urlOpenListener = App.addListener(
      'appUrlOpen',
      (event: URLOpenListenerEvent) => {
        getLogger().info('[DeepLinks] App URL opened:', { url: event.url });

        const { path, url } = parseDeepLink(event.url, config);

        getLogger().info('[DeepLinks] Parsed deep link:', {
          path,
          originalUrl: url,
        });

        if (onDeepLink) {
          onDeepLink(path, url);
        }
      },
    );

    // Check if app was launched with a URL
    App.getLaunchUrl().then((launchUrl) => {
      if (launchUrl?.url) {
        getLogger().info('[DeepLinks] App launched with URL:', {
          url: launchUrl.url,
        });

        const { path, url } = parseDeepLink(launchUrl.url, config);

        if (onDeepLink) {
          onDeepLink(path, url);
        }
      }
    });

    return () => {
      urlOpenListener.then((listener) => listener.remove());
    };
  }, [isNative, onDeepLink, config]);
}

export default useDeepLinks;
