// @catto/ui - TablePrevNextButtonsCatto
// Table pagination buttons - Previous and Next arrows
'use client';

import { Table as TableType } from '@tanstack/react-table';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '../../utils';

export interface TablePrevNextButtonsCattoProps<TData> {
  /** TanStack table instance */
  table: TableType<TData>;
  /** Additional CSS classes */
  className?: string;
}

export function TablePrevNextButtonsCatto<TData>({
  table,
  className,
}: TablePrevNextButtonsCattoProps<TData>) {
  const canGoPrevious = table.getCanPreviousPage();
  const canGoNext = table.getCanNextPage();

  // If only 1 page (can't go either direction), don't show pagination at all
  if (!canGoPrevious && !canGoNext) {
    return null;
  }

  return (
    <div className={cn('flex h-10 w-full max-w-16 space-x-2', className)}>
      {/* Only show previous button if not on first page */}
      {canGoPrevious && (
        <button
          onClick={() => table.previousPage()}
          className="border-input bg-background hover:bg-accent hover:text-accent-foreground flex h-full w-full items-center justify-center rounded-md border"
        >
          <ArrowLeft className="h-6 w-6 text-theme-secondary" />
        </button>
      )}
      {/* Only show next button if not on last page */}
      {canGoNext && (
        <button
          onClick={() => table.nextPage()}
          className="border-input bg-background hover:bg-accent hover:text-accent-foreground flex h-full w-full items-center justify-center rounded-md border"
        >
          <ArrowRight className="h-6 w-6 text-theme-secondary" />
        </button>
      )}
    </div>
  );
}

export default TablePrevNextButtonsCatto;
