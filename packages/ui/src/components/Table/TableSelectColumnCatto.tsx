// @catto/ui - TableSelectColumnCatto
// Creates a checkbox selection column for TableCatto
// Gmail-style row selection - hidden by default, shown when showSelection={true}
'use client';

import { ColumnDef } from '@tanstack/react-table';
import CheckboxCatto from '../Checkbox/CheckboxCatto';

/**
 * Creates a checkbox selection column for use with TableCatto
 * Place as the first column in your columns array when selection is needed
 *
 * @example
 * const columns = [
 *   createSelectColumn<MyDataType>(),
 *   // ... other columns
 * ];
 */
export function createSelectColumn<T>(): ColumnDef<T, unknown> {
  return {
    id: 'select',
    header: ({ table }) => (
      <div
        className="flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <CheckboxCatto
          id="select-all"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(checked) => table.toggleAllPageRowsSelected(checked)}
          checkboxSize="md"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div
        className="flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <CheckboxCatto
          id={`select-${row.id}`}
          checked={row.getIsSelected()}
          onChange={(checked) => row.toggleSelected(checked)}
          checkboxSize="md"
        />
      </div>
    ),
    size: 40,
    enableSorting: false,
    enableHiding: false,
  };
}

export default createSelectColumn;
