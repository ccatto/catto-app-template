// @catto/react-push - Vitest setup with Capacitor mocks

import '@testing-library/jest-dom';

// ── Mock Capacitor core ──
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn(() => false),
    getPlatform: vi.fn(() => 'web'),
  },
}));

// ── Mock Capacitor Push Notifications ──
vi.mock('@capacitor/push-notifications', () => ({
  PushNotifications: {
    checkPermissions: vi.fn(() => Promise.resolve({ receive: 'prompt' })),
    requestPermissions: vi.fn(() => Promise.resolve({ receive: 'granted' })),
    register: vi.fn(() => Promise.resolve()),
    addListener: vi.fn(() => Promise.resolve({ remove: vi.fn() })),
    removeAllListeners: vi.fn(() => Promise.resolve()),
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
