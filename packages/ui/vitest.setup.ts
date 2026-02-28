// @catto/ui Vitest Setup
// Mocks for browser APIs and optional dependencies

import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);

// ============================================
// Browser API Mocks
// ============================================

// Mock matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver for components that observe size changes
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

// Mock IntersectionObserver for lazy loading components
class MockIntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}
window.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock scrollTo for scroll-related components
window.scrollTo = vi.fn();

// Mock requestAnimationFrame for animations
window.requestAnimationFrame = vi.fn((callback) => {
  callback(0);
  return 0;
});
window.cancelAnimationFrame = vi.fn();

// ============================================
// Capacitor Mocks (Optional Peer Dependency)
// ============================================

// Mock @capacitor/haptics for ButtonCatto haptic feedback
vi.mock('@capacitor/haptics', () => ({
  Haptics: {
    impact: vi.fn().mockResolvedValue(undefined),
    notification: vi.fn().mockResolvedValue(undefined),
    selectionStart: vi.fn().mockResolvedValue(undefined),
    selectionChanged: vi.fn().mockResolvedValue(undefined),
    selectionEnd: vi.fn().mockResolvedValue(undefined),
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

// Mock @capacitor/core for platform detection
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn().mockReturnValue(false),
    getPlatform: vi.fn().mockReturnValue('web'),
    isPluginAvailable: vi.fn().mockReturnValue(false),
  },
}));

// ============================================
// Next.js Mocks
// ============================================

// Mock next/navigation for LinkCatto and navigation components
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => {
    const React = require('react');
    return React.createElement('a', { href, ...props }, children);
  },
}));

// ============================================
// Utility Helpers
// ============================================

// Suppress console errors during tests (optional - enable if needed)
// beforeAll(() => {
//   vi.spyOn(console, 'error').mockImplementation(() => {});
// });
// afterAll(() => {
//   vi.restoreAllMocks();
// });
