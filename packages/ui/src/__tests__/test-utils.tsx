// @catto/ui Test Utilities
// Custom render function and testing helpers

import type { ReactElement, ReactNode } from 'react';
import { cleanup, render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach } from 'vitest';

// ============================================
// Cleanup
// ============================================

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// ============================================
// Theme Provider Wrapper (Placeholder)
// ============================================

// Note: @catto/ui uses CSS custom properties for theming rather than React context.
// This wrapper is a placeholder for future theme context if needed.
interface WrapperProps {
  children: ReactNode;
}

const AllProviders = ({ children }: WrapperProps) => {
  // Add any providers here (e.g., ThemeProvider, ToastProvider)
  // For now, just return children since theming is CSS-based
  return <>{children}</>;
};

// ============================================
// Custom Render
// ============================================

/**
 * Custom render function that wraps components with necessary providers.
 * Use this instead of @testing-library/react's render.
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllProviders, ...options }),
  };
};

// ============================================
// Test Helpers
// ============================================

/**
 * Creates a user event instance for interaction testing.
 * Useful when you need to configure userEvent options.
 */
export const createUser = (options?: Parameters<typeof userEvent.setup>[0]) => {
  return userEvent.setup(options);
};

/**
 * Waits for a condition to be true.
 * Useful for async operations in tests.
 */
export const waitForCondition = async (
  condition: () => boolean,
  timeout = 1000,
  interval = 50,
): Promise<void> => {
  const startTime = Date.now();
  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Condition not met within timeout');
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
};

/**
 * Mock function that tracks calls and can be used for assertions.
 */
export const createMockFn = <T extends (...args: unknown[]) => unknown>() => {
  return vi.fn<T>();
};

// ============================================
// Re-exports
// ============================================

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Re-export userEvent
export { userEvent };

// Export custom render as default render
export { customRender as render };
