// @catto/ui - useTableStateCatto Hook
'use client';

import { useState } from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

export interface UseTableStateCattoOptions {
  /** Initial column visibility state (e.g., { searchable: false } to hide a column) */
  initialColumnVisibility?: VisibilityState;
}

export function useTableStateCatto(options?: UseTableStateCattoOptions) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    options?.initialColumnVisibility ?? {},
  );
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  return {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    globalFilter,
    setGlobalFilter,
  };
}
