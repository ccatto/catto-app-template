// @catto/ui - useTableStateCatto Tests
// Tests for the table state management hook

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTableStateCatto } from '../../hooks/table/useTableStateCatto';

describe('useTableStateCatto', () => {
  // ============================================
  // Initial State Tests
  // ============================================

  describe('Initial State', () => {
    it('returns empty sorting state by default', () => {
      const { result } = renderHook(() => useTableStateCatto());
      expect(result.current.sorting).toEqual([]);
    });

    it('returns empty column filters by default', () => {
      const { result } = renderHook(() => useTableStateCatto());
      expect(result.current.columnFilters).toEqual([]);
    });

    it('returns empty column visibility by default', () => {
      const { result } = renderHook(() => useTableStateCatto());
      expect(result.current.columnVisibility).toEqual({});
    });

    it('returns empty row selection by default', () => {
      const { result } = renderHook(() => useTableStateCatto());
      expect(result.current.rowSelection).toEqual({});
    });

    it('returns empty global filter by default', () => {
      const { result } = renderHook(() => useTableStateCatto());
      expect(result.current.globalFilter).toBe('');
    });

    it('accepts initial column visibility option', () => {
      const { result } = renderHook(() =>
        useTableStateCatto({ initialColumnVisibility: { email: false } }),
      );
      expect(result.current.columnVisibility).toEqual({ email: false });
    });
  });

  // ============================================
  // Sorting State Tests
  // ============================================

  describe('Sorting State', () => {
    it('updates sorting state', () => {
      const { result } = renderHook(() => useTableStateCatto());

      act(() => {
        result.current.setSorting([{ id: 'name', desc: false }]);
      });

      expect(result.current.sorting).toEqual([{ id: 'name', desc: false }]);
    });

    it('updates sorting with multiple columns', () => {
      const { result } = renderHook(() => useTableStateCatto());

      act(() => {
        result.current.setSorting([
          { id: 'name', desc: false },
          { id: 'email', desc: true },
        ]);
      });

      expect(result.current.sorting).toHaveLength(2);
      expect(result.current.sorting[0]).toEqual({ id: 'name', desc: false });
      expect(result.current.sorting[1]).toEqual({ id: 'email', desc: true });
    });

    it('clears sorting state', () => {
      const { result } = renderHook(() => useTableStateCatto());

      act(() => {
        result.current.setSorting([{ id: 'name', desc: false }]);
      });

      act(() => {
        result.current.setSorting([]);
      });

      expect(result.current.sorting).toEqual([]);
    });
  });

  // ============================================
  // Column Filters State Tests
  // ============================================

  describe('Column Filters State', () => {
    it('updates column filters state', () => {
      const { result } = renderHook(() => useTableStateCatto());

      act(() => {
        result.current.setColumnFilters([{ id: 'name', value: 'John' }]);
      });

      expect(result.current.columnFilters).toEqual([
        { id: 'name', value: 'John' },
      ]);
    });

    it('updates with multiple column filters', () => {
      const { result } = renderHook(() => useTableStateCatto());

      act(() => {
        result.current.setColumnFilters([
          { id: 'name', value: 'John' },
          { id: 'role', value: 'admin' },
        ]);
      });

      expect(result.current.columnFilters).toHaveLength(2);
    });

    it('clears column filters', () => {
      const { result } = renderHook(() => useTableStateCatto());

      act(() => {
        result.current.setColumnFilters([{ id: 'name', value: 'John' }]);
      });

      act(() => {
        result.current.setColumnFilters([]);
      });

      expect(result.current.columnFilters).toEqual([]);
    });
  });

  // ============================================
  // Column Visibility State Tests
  // ============================================

  describe('Column Visibility State', () => {
    it('updates column visibility state', () => {
      const { result } = renderHook(() => useTableStateCatto());

      act(() => {
        result.current.setColumnVisibility({ email: false });
      });

      expect(result.current.columnVisibility).toEqual({ email: false });
    });

    it('hides multiple columns', () => {
      const { result } = renderHook(() => useTableStateCatto());

      act(() => {
        result.current.setColumnVisibility({ email: false, phone: false });
      });

      expect(result.current.columnVisibility).toEqual({
        email: false,
        phone: false,
      });
    });

    it('shows previously hidden columns', () => {
      const { result } = renderHook(() =>
        useTableStateCatto({ initialColumnVisibility: { email: false } }),
      );

      act(() => {
        result.current.setColumnVisibility({ email: true });
      });

      expect(result.current.columnVisibility).toEqual({ email: true });
    });
  });

  // ============================================
  // Row Selection State Tests
  // ============================================

  describe('Row Selection State', () => {
    it('updates row selection state', () => {
      const { result } = renderHook(() => useTableStateCatto());

      act(() => {
        result.current.setRowSelection({ '0': true, '1': true });
      });

      expect(result.current.rowSelection).toEqual({ '0': true, '1': true });
    });

    it('clears row selection', () => {
      const { result } = renderHook(() => useTableStateCatto());

      act(() => {
        result.current.setRowSelection({ '0': true });
      });

      act(() => {
        result.current.setRowSelection({});
      });

      expect(result.current.rowSelection).toEqual({});
    });
  });

  // ============================================
  // Global Filter State Tests
  // ============================================

  describe('Global Filter State', () => {
    it('updates global filter state', () => {
      const { result } = renderHook(() => useTableStateCatto());

      act(() => {
        result.current.setGlobalFilter('search term');
      });

      expect(result.current.globalFilter).toBe('search term');
    });

    it('clears global filter', () => {
      const { result } = renderHook(() => useTableStateCatto());

      act(() => {
        result.current.setGlobalFilter('search');
      });

      act(() => {
        result.current.setGlobalFilter('');
      });

      expect(result.current.globalFilter).toBe('');
    });
  });

  // ============================================
  // Return Type Tests
  // ============================================

  describe('Return Type', () => {
    it('returns all expected properties', () => {
      const { result } = renderHook(() => useTableStateCatto());

      expect(result.current).toHaveProperty('sorting');
      expect(result.current).toHaveProperty('setSorting');
      expect(result.current).toHaveProperty('columnFilters');
      expect(result.current).toHaveProperty('setColumnFilters');
      expect(result.current).toHaveProperty('columnVisibility');
      expect(result.current).toHaveProperty('setColumnVisibility');
      expect(result.current).toHaveProperty('rowSelection');
      expect(result.current).toHaveProperty('setRowSelection');
      expect(result.current).toHaveProperty('globalFilter');
      expect(result.current).toHaveProperty('setGlobalFilter');
    });

    it('setters are functions', () => {
      const { result } = renderHook(() => useTableStateCatto());

      expect(typeof result.current.setSorting).toBe('function');
      expect(typeof result.current.setColumnFilters).toBe('function');
      expect(typeof result.current.setColumnVisibility).toBe('function');
      expect(typeof result.current.setRowSelection).toBe('function');
      expect(typeof result.current.setGlobalFilter).toBe('function');
    });
  });
});
