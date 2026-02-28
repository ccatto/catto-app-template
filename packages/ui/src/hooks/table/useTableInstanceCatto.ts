// @catto/ui - useTableInstanceCatto Hook
'use client';

import {
  ColumnDef,
  FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useTableStateCatto } from './useTableStateCatto';

export interface UseTableInstanceCattoOptions<TData> {
  /** Initial column visibility state (e.g., { searchable: false } to hide a column) */
  initialColumnVisibility?: VisibilityState;
  /** Custom global filter function for multi-column search */
  globalFilterFn?: FilterFn<TData>;
  /** Number of rows per page (default: 10, set to data length to show all) */
  pageSize?: number;
}

/**
 * Default global filter function that searches across all string column values
 */
function createDefaultGlobalFilterFn<TData>(): FilterFn<TData> {
  return (row: Row<TData>, _columnId: string, filterValue: unknown) => {
    const search = String(filterValue).toLowerCase();
    if (!search) return true;

    // Search across all visible column values
    const rowValues = row
      .getAllCells()
      .map((cell) => cell.getValue())
      .filter((val) => val != null)
      .map((val) => String(val).toLowerCase())
      .join(' ');

    return rowValues.includes(search);
  };
}

export function useTableInstanceCatto<TData, TValue>(
  data: TData[],
  columns: ColumnDef<TData, TValue>[],
  options?: UseTableInstanceCattoOptions<TData>,
) {
  const tableState = useTableStateCatto({
    initialColumnVisibility: options?.initialColumnVisibility,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...(options?.pageSize
      ? { initialState: { pagination: { pageSize: options.pageSize } } }
      : {}),
    onSortingChange: tableState.setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: tableState.setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: tableState.setColumnVisibility,
    onRowSelectionChange: tableState.setRowSelection,
    onGlobalFilterChange: tableState.setGlobalFilter,
    globalFilterFn:
      options?.globalFilterFn ?? createDefaultGlobalFilterFn<TData>(),
    state: {
      sorting: tableState.sorting,
      columnFilters: tableState.columnFilters,
      columnVisibility: tableState.columnVisibility,
      rowSelection: tableState.rowSelection,
      globalFilter: tableState.globalFilter,
    },
  });

  return table;
}
