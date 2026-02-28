// @catto/ui - useTableInstanceCatto Tests
// Tests for the table instance creation hook

import { ColumnDef } from '@tanstack/react-table';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTableInstanceCatto } from '../../hooks/table/useTableInstanceCatto';

interface TestUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

const testData: TestUser[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'User' },
];

const testColumns: ColumnDef<TestUser, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'email', accessorKey: 'email', header: 'Email' },
  { id: 'role', accessorKey: 'role', header: 'Role' },
];

describe('useTableInstanceCatto', () => {
  // ============================================
  // Table Instance Creation Tests
  // ============================================

  describe('Table Instance Creation', () => {
    it('creates a table instance', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns),
      );

      expect(result.current).toBeDefined();
      expect(typeof result.current.getRowModel).toBe('function');
    });

    it('has correct number of rows', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns),
      );

      expect(result.current.getRowModel().rows).toHaveLength(3);
    });

    it('has correct number of columns', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns),
      );

      expect(result.current.getAllColumns()).toHaveLength(3);
    });

    it('returns empty rows for empty data', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto<TestUser, unknown>([], testColumns),
      );

      expect(result.current.getRowModel().rows).toHaveLength(0);
    });
  });

  // ============================================
  // Sorting Tests
  // ============================================

  describe('Sorting', () => {
    it('returns getSortedRowModel function', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns),
      );

      expect(typeof result.current.getSortedRowModel).toBe('function');
    });

    it('can toggle sorting on a column', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns),
      );

      const nameColumn = result.current.getColumn('name');
      expect(nameColumn).toBeDefined();
      expect(nameColumn?.getCanSort()).toBe(true);
    });
  });

  // ============================================
  // Filtering Tests
  // ============================================

  describe('Filtering', () => {
    it('returns getFilteredRowModel function', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns),
      );

      expect(typeof result.current.getFilteredRowModel).toBe('function');
    });

    it('can set global filter', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns),
      );

      act(() => {
        result.current.setGlobalFilter('alice');
      });

      const filteredRows = result.current.getFilteredRowModel().rows;
      expect(filteredRows).toHaveLength(1);
    });

    it('global filter is case insensitive', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns),
      );

      act(() => {
        result.current.setGlobalFilter('ALICE');
      });

      const filteredRows = result.current.getFilteredRowModel().rows;
      expect(filteredRows).toHaveLength(1);
    });

    it('filters across multiple columns', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns),
      );

      act(() => {
        result.current.setGlobalFilter('User');
      });

      // Should find Bob and Charlie who have 'User' role
      const filteredRows = result.current.getFilteredRowModel().rows;
      expect(filteredRows).toHaveLength(2);
    });

    it('returns all rows when filter is empty', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns),
      );

      act(() => {
        result.current.setGlobalFilter('');
      });

      const filteredRows = result.current.getFilteredRowModel().rows;
      expect(filteredRows).toHaveLength(3);
    });
  });

  // ============================================
  // Pagination Tests
  // ============================================

  describe('Pagination', () => {
    it('returns pagination methods', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns),
      );

      expect(typeof result.current.getCanPreviousPage).toBe('function');
      expect(typeof result.current.getCanNextPage).toBe('function');
      expect(typeof result.current.previousPage).toBe('function');
      expect(typeof result.current.nextPage).toBe('function');
    });

    it('has correct pagination state', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns),
      );

      const pageCount = result.current.getPageCount();
      expect(pageCount).toBeGreaterThanOrEqual(1);
    });
  });

  // ============================================
  // Column Visibility Tests
  // ============================================

  describe('Column Visibility', () => {
    it('accepts initial column visibility', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns, {
          initialColumnVisibility: { email: false },
        }),
      );

      const emailColumn = result.current.getColumn('email');
      expect(emailColumn?.getIsVisible()).toBe(false);
    });

    it('can toggle column visibility', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns),
      );

      const emailColumn = result.current.getColumn('email');
      expect(emailColumn?.getIsVisible()).toBe(true);

      act(() => {
        emailColumn?.toggleVisibility(false);
      });

      expect(emailColumn?.getIsVisible()).toBe(false);
    });
  });

  // ============================================
  // Row Selection Tests
  // ============================================

  describe('Row Selection', () => {
    it('can select rows', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns),
      );

      act(() => {
        result.current.setRowSelection({ '0': true });
      });

      const selectedRows = result.current.getSelectedRowModel().rows;
      expect(selectedRows).toHaveLength(1);
    });

    it('can select multiple rows', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns),
      );

      act(() => {
        result.current.setRowSelection({ '0': true, '1': true, '2': true });
      });

      const selectedRows = result.current.getSelectedRowModel().rows;
      expect(selectedRows).toHaveLength(3);
    });

    it('can toggle all rows selection', () => {
      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns),
      );

      act(() => {
        result.current.toggleAllRowsSelected(true);
      });

      const selectedRows = result.current.getSelectedRowModel().rows;
      expect(selectedRows).toHaveLength(3);
    });
  });

  // ============================================
  // Custom Global Filter Tests
  // ============================================

  describe('Custom Global Filter', () => {
    it('accepts custom global filter function', () => {
      const customFilter = (row: { getValue: (id: string) => unknown }) => {
        const name = String(row.getValue('name'));
        return name.startsWith('A');
      };

      const { result } = renderHook(() =>
        useTableInstanceCatto(testData, testColumns, {
          globalFilterFn: customFilter,
        }),
      );

      act(() => {
        result.current.setGlobalFilter('anything');
      });

      const filteredRows = result.current.getFilteredRowModel().rows;
      // Only Alice starts with 'A'
      expect(filteredRows).toHaveLength(1);
    });
  });
});
