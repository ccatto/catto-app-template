// @catto/react-mobile - Vitest setup with Capacitor mocks

import '@testing-library/jest-dom';

// ── Mock Capacitor core ──
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn(() => false),
    getPlatform: vi.fn(() => 'web'),
  },
}));

// ── Mock Capacitor Haptics ──
vi.mock('@capacitor/haptics', () => ({
  Haptics: {
    impact: vi.fn(),
    notification: vi.fn(),
    selectionChanged: vi.fn(),
    vibrate: vi.fn(),
  },
  ImpactStyle: {
    Light: 'LIGHT',
    Medium: 'MEDIUM',
    Heavy: 'HEAVY',
  },
  NotificationType: {
    Success: 'SUCCESS',
    Warning: 'WARNING',
    Error: 'ERROR',
  },
}));

// ── Mock Capacitor Keyboard ──
vi.mock('@capacitor/keyboard', () => ({
  Keyboard: {
    setResizeMode: vi.fn(),
    setScroll: vi.fn(),
    hide: vi.fn(),
    show: vi.fn(),
    addListener: vi.fn(() => Promise.resolve({ remove: vi.fn() })),
  },
  KeyboardResize: {
    Body: 'body',
    Ionic: 'ionic',
    Native: 'native',
    None: 'none',
  },
}));

// ── Mock Capacitor Network ──
vi.mock('@capacitor/network', () => ({
  Network: {
    getStatus: vi.fn(() =>
      Promise.resolve({ connected: true, connectionType: 'wifi' }),
    ),
    addListener: vi.fn(() => Promise.resolve({ remove: vi.fn() })),
  },
}));

// ── Mock Capacitor Share ──
vi.mock('@capacitor/share', () => ({
  Share: {
    share: vi.fn(() => Promise.resolve({ activityType: 'mock' })),
  },
}));

// ── Mock Capacitor App ──
vi.mock('@capacitor/app', () => ({
  App: {
    addListener: vi.fn(() => Promise.resolve({ remove: vi.fn() })),
    getLaunchUrl: vi.fn(() => Promise.resolve(null)),
  },
}));

// ── Mock @capacitor-mlkit/barcode-scanning ──
vi.mock('@capacitor-mlkit/barcode-scanning', () => ({
  BarcodeScanner: {
    checkPermissions: vi.fn(() => Promise.resolve({ camera: 'granted' })),
    requestPermissions: vi.fn(() => Promise.resolve({ camera: 'granted' })),
    scan: vi.fn(() => Promise.resolve({ barcodes: [] })),
  },
  BarcodeFormat: {
    QrCode: 'QR_CODE',
  },
}));

// ── Browser API mocks ──
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock);
