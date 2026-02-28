/**
 * useShare - Native share sheet hook for iOS/Android
 *
 * Opens the native share dialog to share content.
 * Falls back to Web Share API on web if available, or copies to clipboard.
 *
 * Usage:
 *   const { share, canShare } = useShare();
 *
 *   await share({
 *     title: 'My App',
 *     text: 'Check this out!',
 *     url: 'https://example.com',
 *   });
 */
import { useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Share, ShareOptions, ShareResult } from '@capacitor/share';
import { getLogger } from '../logger';

export interface UseShareOptions {
  /** Title for the share dialog */
  title?: string;
  /** Text/description to share */
  text?: string;
  /** URL to share */
  url?: string;
  /** Dialog title (Android only) */
  dialogTitle?: string;
}

export interface UseShareReturn {
  /** Share content using native share sheet */
  share: (options: UseShareOptions) => Promise<ShareResult | null>;
  /** Whether sharing is available on this platform */
  canShare: boolean;
  /** Whether we're on a native platform */
  isNative: boolean;
}

export function useShare(): UseShareReturn {
  const isNative = Capacitor.isNativePlatform();

  const webShareAvailable =
    typeof navigator !== 'undefined' && !!navigator.share;
  const canShare = isNative || webShareAvailable;

  const share = useCallback(
    async (options: UseShareOptions): Promise<ShareResult | null> => {
      const { title, text, url, dialogTitle } = options;

      getLogger().info('[Share] Sharing content:', { title, url, isNative });

      if (isNative) {
        try {
          const shareOptions: ShareOptions = {
            title,
            text,
            url,
            dialogTitle: dialogTitle || 'Share',
          };

          const result = await Share.share(shareOptions);
          getLogger().info('[Share] Share completed:', {
            activityType: result.activityType,
          });
          return result;
        } catch (error) {
          getLogger().info('[Share] Share cancelled or failed:', {
            error: error instanceof Error ? error.message : String(error),
          });
          return null;
        }
      }

      if (webShareAvailable) {
        try {
          await navigator.share({
            title,
            text,
            url,
          });
          getLogger().info('[Share] Web share completed');
          return { activityType: 'web-share' };
        } catch (error) {
          getLogger().info('[Share] Web share cancelled or failed:', {
            error: error instanceof Error ? error.message : String(error),
          });
          return null;
        }
      }

      if (url && typeof navigator !== 'undefined' && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(url);
          getLogger().info('[Share] Copied URL to clipboard');
          return { activityType: 'clipboard' };
        } catch (error) {
          getLogger().error('[Share] Failed to copy to clipboard:', {
            error: error instanceof Error ? error.message : String(error),
          });
          return null;
        }
      }

      getLogger().warn('[Share] No share method available');
      return null;
    },
    [isNative, webShareAvailable],
  );

  return {
    share,
    canShare,
    isNative,
  };
}

export default useShare;
