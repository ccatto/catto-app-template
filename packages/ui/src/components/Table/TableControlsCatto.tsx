// @catto/ui - TableControlsCatto
// Filter input and pagination controls for TableCatto
'use client';

import { Table as TableType } from '@tanstack/react-table';
import { cn } from '../../utils';
import InputCatto from '../Input/InputCatto';
import { TablePrevNextButtonsCatto } from './TablePrevNextButtonsCatto';

export interface TableControlsCattoProps<TData> {
  /** TanStack table instance */
  table: TableType<TData>;
  /** Column ID to filter on (required for 'column' mode) */
  filterVal?: string;
  /** Placeholder text for the filter input */
  filterText: string;
  /** Filter mode: 'column' or 'global' (default: 'column') */
  filterMode?: 'column' | 'global';
  /** Additional CSS classes */
  className?: string;
}

export function TableControlsCatto<TData>({
  table,
  filterVal,
  filterText,
  filterMode = 'column',
  className,
}: TableControlsCattoProps<TData>) {
  const isGlobalMode = filterMode === 'global';

  // Safely convert filterText to a primitive string
  // Handles next-intl translation objects that may return [object Object] in template literals
  const safeFilterText =
    typeof filterText === 'string'
      ? filterText
      : typeof filterText === 'object' && filterText !== null
        ? (filterText as { toString?: () => string }).toString?.() ===
          '[object Object]'
          ? ''
          : String(filterText)
        : String(filterText || '');

  // Get current filter value based on mode
  // Ensure we always return a string (safeguard against corrupted object values)
  const rawFilterValue = isGlobalMode
    ? table.getState().globalFilter
    : table.getColumn(filterVal ?? '')?.getFilterValue();
  const filterValue = typeof rawFilterValue === 'string' ? rawFilterValue : '';

  // Handle filter change based on mode
  // NOTE: Second parameter required for InputCatto to pass (value, event) instead of just (event)
  // InputCatto uses function.length to detect the calling convention
  const handleFilterChange = (value: string, _event?: unknown) => {
    if (isGlobalMode) {
      table.setGlobalFilter(value);
    } else if (filterVal) {
      table.getColumn(filterVal)?.setFilterValue(value);
    }
  };

  return (
    <div className={cn('flex justify-between', className)}>
      {/* Filter Input Textbox */}
      <div className="flex flex-1 items-center py-2 pl-1 md:py-4">
        <InputCatto
          placeholder={`Filter by ${safeFilterText}`}
          value={filterValue}
          onChange={handleFilterChange}
          className="max-w-[200px] md:max-w-sm"
        />
      </div>
      <div className="ml-auto flex w-28 items-center justify-end">
        <TablePrevNextButtonsCatto table={table} />
      </div>
    </div>
  );
}

export default TableControlsCatto;
