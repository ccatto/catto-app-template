// @catto/react-contact — reCAPTCHA v3 hook

import { useCallback, useEffect, useState } from 'react';
import { getLogger } from '../logger';
import type { UseRecaptchaReturn } from '../types';

// Extend window for reCAPTCHA
declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}

/**
 * React hook for reCAPTCHA v3 integration.
 *
 * - Loads the reCAPTCHA script dynamically when siteKey is provided
 * - Returns a no-op when siteKey is undefined (fully opt-in)
 * - Cleans up reCAPTCHA badge on unmount
 *
 * @param siteKey - reCAPTCHA v3 site key (omit to disable)
 * @param action - reCAPTCHA action name (default: 'contact_form')
 */
export function useRecaptcha(
  siteKey?: string,
  action: string = 'contact_form',
): UseRecaptchaReturn {
  const [ready, setReady] = useState(false);
  const log = getLogger();

  useEffect(() => {
    if (!siteKey) return;

    // Check if already loaded
    if (window.grecaptcha) {
      setReady(true);
      log.debug('reCAPTCHA already loaded');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.onload = () => {
      setReady(true);
      log.info('reCAPTCHA script loaded');
    };
    script.onerror = () => {
      log.error('Failed to load reCAPTCHA script');
    };
    document.head.appendChild(script);

    return () => {
      // Clean up reCAPTCHA badge on unmount
      const badge = document.querySelector('.grecaptcha-badge');
      if (badge) badge.remove();
    };
  }, [siteKey, log]);

  const executeRecaptcha = useCallback(async (): Promise<
    string | undefined
  > => {
    if (!siteKey || !ready || !window.grecaptcha) return undefined;

    try {
      const token = await window.grecaptcha.execute(siteKey, { action });
      log.debug('reCAPTCHA token obtained', { action });
      return token;
    } catch (err) {
      log.error('reCAPTCHA execution failed', {
        error: err instanceof Error ? err.message : String(err),
      });
      return undefined;
    }
  }, [siteKey, ready, action, log]);

  return { ready: siteKey ? ready : true, executeRecaptcha };
}
