// @catto/react-mobile - React hooks for Capacitor mobile apps

// Logger
export { configureMobileLogger, getLogger } from './logger';
export type { CattoMobileLogger } from './logger';

// Hooks
export { useHaptics } from './hooks/useHaptics';
export type { ImpactWeight, NotificationStyle } from './hooks/useHaptics';

export { usePullToRefresh } from './hooks/usePullToRefresh';
export type {
  UsePullToRefreshOptions,
  UsePullToRefreshReturn,
} from './hooks/usePullToRefresh';

export {
  useKeyboardDismiss,
  hideKeyboard,
  showKeyboard,
} from './hooks/useKeyboardDismiss';
export type { UseKeyboardDismissOptions } from './hooks/useKeyboardDismiss';

export { useDeepLinks, parseDeepLink } from './hooks/useDeepLinks';
export type {
  DeepLinkConfig,
  DeepLinkInfo,
  UseDeepLinksOptions,
} from './hooks/useDeepLinks';

export { useNetworkStatus } from './hooks/useNetworkStatus';
export type {
  NetworkState,
  UseNetworkStatusReturn,
} from './hooks/useNetworkStatus';

export { useShare } from './hooks/useShare';
export type { UseShareOptions, UseShareReturn } from './hooks/useShare';

export { useQRScanner } from './hooks/useQRScanner';
export type {
  UseQRScannerOptions,
  UseQRScannerReturn,
} from './hooks/useQRScanner';

export { useGeolocation } from './hooks/useGeolocation';
export type {
  GeolocationState,
  UseGeolocationOptions,
  UseGeolocationReturn,
} from './hooks/useGeolocation';
