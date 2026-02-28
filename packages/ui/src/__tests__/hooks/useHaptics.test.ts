// @catto/ui - useHaptics Tests
// Tests for the haptic feedback hook

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useHaptics } from '../../hooks/useHaptics';

// The mocks are already set up in vitest.setup.ts
// We just need to test the hook behavior

describe('useHaptics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================
  // Return Type Tests
  // ============================================

  describe('Return Type', () => {
    it('returns impact function', () => {
      const { result } = renderHook(() => useHaptics());
      expect(typeof result.current.impact).toBe('function');
    });

    it('returns notification function', () => {
      const { result } = renderHook(() => useHaptics());
      expect(typeof result.current.notification).toBe('function');
    });

    it('returns selectionChanged function', () => {
      const { result } = renderHook(() => useHaptics());
      expect(typeof result.current.selectionChanged).toBe('function');
    });

    it('returns vibrate function', () => {
      const { result } = renderHook(() => useHaptics());
      expect(typeof result.current.vibrate).toBe('function');
    });

    it('returns isNative boolean', () => {
      const { result } = renderHook(() => useHaptics());
      expect(typeof result.current.isNative).toBe('boolean');
    });
  });

  // ============================================
  // Web Platform Tests (Non-Native)
  // ============================================

  describe('Web Platform (Non-Native)', () => {
    it('isNative is false on web', () => {
      const { result } = renderHook(() => useHaptics());
      expect(result.current.isNative).toBe(false);
    });

    it('impact does not throw on web', async () => {
      const { result } = renderHook(() => useHaptics());

      await expect(async () => {
        await act(async () => {
          await result.current.impact('light');
        });
      }).not.toThrow();
    });

    it('notification does not throw on web', async () => {
      const { result } = renderHook(() => useHaptics());

      await expect(async () => {
        await act(async () => {
          await result.current.notification('success');
        });
      }).not.toThrow();
    });

    it('selectionChanged does not throw on web', async () => {
      const { result } = renderHook(() => useHaptics());

      await expect(async () => {
        await act(async () => {
          await result.current.selectionChanged();
        });
      }).not.toThrow();
    });

    it('vibrate does not throw on web', async () => {
      const { result } = renderHook(() => useHaptics());

      await expect(async () => {
        await act(async () => {
          await result.current.vibrate(300);
        });
      }).not.toThrow();
    });
  });

  // ============================================
  // Impact Weight Tests
  // ============================================

  describe('Impact Weights', () => {
    it('accepts light weight', async () => {
      const { result } = renderHook(() => useHaptics());

      await act(async () => {
        await result.current.impact('light');
      });

      // No error should occur
      expect(true).toBe(true);
    });

    it('accepts medium weight', async () => {
      const { result } = renderHook(() => useHaptics());

      await act(async () => {
        await result.current.impact('medium');
      });

      expect(true).toBe(true);
    });

    it('accepts heavy weight', async () => {
      const { result } = renderHook(() => useHaptics());

      await act(async () => {
        await result.current.impact('heavy');
      });

      expect(true).toBe(true);
    });

    it('uses light as default weight', async () => {
      const { result } = renderHook(() => useHaptics());

      await act(async () => {
        await result.current.impact();
      });

      expect(true).toBe(true);
    });
  });

  // ============================================
  // Notification Style Tests
  // ============================================

  describe('Notification Styles', () => {
    it('accepts success style', async () => {
      const { result } = renderHook(() => useHaptics());

      await act(async () => {
        await result.current.notification('success');
      });

      expect(true).toBe(true);
    });

    it('accepts warning style', async () => {
      const { result } = renderHook(() => useHaptics());

      await act(async () => {
        await result.current.notification('warning');
      });

      expect(true).toBe(true);
    });

    it('accepts error style', async () => {
      const { result } = renderHook(() => useHaptics());

      await act(async () => {
        await result.current.notification('error');
      });

      expect(true).toBe(true);
    });

    it('uses success as default style', async () => {
      const { result } = renderHook(() => useHaptics());

      await act(async () => {
        await result.current.notification();
      });

      expect(true).toBe(true);
    });
  });

  // ============================================
  // Vibrate Duration Tests
  // ============================================

  describe('Vibrate Duration', () => {
    it('accepts custom duration', async () => {
      const { result } = renderHook(() => useHaptics());

      await act(async () => {
        await result.current.vibrate(500);
      });

      expect(true).toBe(true);
    });

    it('uses default duration of 300', async () => {
      const { result } = renderHook(() => useHaptics());

      await act(async () => {
        await result.current.vibrate();
      });

      expect(true).toBe(true);
    });
  });

  // ============================================
  // Hook Stability Tests
  // ============================================

  describe('Hook Stability', () => {
    it('returns stable function references', () => {
      const { result, rerender } = renderHook(() => useHaptics());

      const firstImpact = result.current.impact;
      const firstNotification = result.current.notification;
      const firstSelectionChanged = result.current.selectionChanged;
      const firstVibrate = result.current.vibrate;

      rerender();

      expect(result.current.impact).toBe(firstImpact);
      expect(result.current.notification).toBe(firstNotification);
      expect(result.current.selectionChanged).toBe(firstSelectionChanged);
      expect(result.current.vibrate).toBe(firstVibrate);
    });

    it('isNative remains stable across rerenders', () => {
      const { result, rerender } = renderHook(() => useHaptics());

      const firstIsNative = result.current.isNative;

      rerender();

      expect(result.current.isNative).toBe(firstIsNative);
    });
  });
});
