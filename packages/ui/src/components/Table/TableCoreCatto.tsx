// @catto/ui - TableCoreCatto
// Core table rendering component with alternating row colors
'use client';

import { ReactNode } from 'react';
import { flexRender, Table as TableType } from '@tanstack/react-table';
import { cn } from '../../utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './TablePrimitives';

export interface TableCoreCattoProps<TData> {
  /** TanStack table instance */
  table: TableType<TData>;
  /** Total number of columns (for empty state colspan) */
  columnsLength: number;
  /** Callback when a row is clicked - enables clickable rows with cursor pointer */
  onRowClick?: (row: TData) => void;
  /** Custom empty state title */
  emptyTitle?: string;
  /** Custom empty state description */
  emptyDescription?: string;
  /** Fully custom empty state component */
  emptyState?: ReactNode;
  /** Additional CSS classes for the container */
  className?: string;
  /** Header background class (default uses catto-table-header CSS variable) */
  headerClassName?: string;
  /** Row background class for even rows */
  rowClassName?: string;
  /** Row background class for odd rows */
  rowOddClassName?: string;
  /** Row hover class */
  rowHoverClassName?: string;
  /** Make the table header sticky when scrolling (default: false) */
  stickyHeader?: boolean;
}

export function TableCoreCatto<TData>({
  table,
  columnsLength,
  onRowClick,
  emptyTitle,
  emptyDescription,
  emptyState,
  className,
  // Light + dark mode colors - Navy blue header with alternating rows
  headerClassName = 'bg-theme-primary-subtle text-theme-primary',
  rowClassName = 'bg-theme-surface',
  rowOddClassName = 'bg-theme-surface-secondary',
  rowHoverClassName = 'hover:bg-theme-primary-subtle',
  stickyHeader = false,
}: TableCoreCattoProps<TData>) {
  return (
    <div
      className={cn(
        'rounded-md border border-theme-border overflow-hidden',
        className,
      )}
    >
      <Table className="border-theme-border rounded-md">
        <TableHeader
          className={cn(
            headerClassName,
            'rounded-t-md',
            stickyHeader && 'sticky top-0 z-10',
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-theme-border hover:bg-transparent"
            >
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    'text-theme-primary font-semibold',
                    index === 0 && 'rounded-tl-md',
                    index === headerGroup.headers.length - 1 && 'rounded-tr-md',
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className={cn(
                  index % 2 === 0 ? rowClassName : rowOddClassName,
                  'text-theme-text border-theme-border',
                  rowHoverClassName,
                  onRowClick && 'cursor-pointer',
                )}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columnsLength} className="h-24 text-center">
                {emptyState ? (
                  emptyState
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1 py-4 text-theme-text-subtle">
                    <span className="text-sm">
                      {emptyTitle || 'No matching results found.'}
                    </span>
                    <span className="text-xs text-theme-text-subtle">
                      {emptyDescription ||
                        'Try adjusting your search or filter criteria.'}
                    </span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default TableCoreCatto;
