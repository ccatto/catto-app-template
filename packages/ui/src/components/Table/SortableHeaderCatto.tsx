// @catto/ui - SortableHeaderCatto Component
// Performance: Memoized to prevent re-renders when other columns change
'use client';

import React, { memo, useCallback } from 'react';
import { Column } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '../../utils';

export interface SortableHeaderCattoProps<TData> {
  column: Column<TData, unknown>;
  title: string;
  enableSorting?: boolean;
}

function SortableHeaderCattoInner<TData>({
  column,
  title,
  enableSorting = true,
}: SortableHeaderCattoProps<TData>) {
  const handleSort = useCallback(() => {
    column.toggleSorting(column.getIsSorted() === 'asc');
  }, [column]);

  return (
    <button
      type="button"
      onClick={handleSort}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'font-semibold transition-colors duration-200',
        // Text color - orange on hover, inherit otherwise
        'text-inherit hover:text-theme-secondary',
        // No background change - stays transparent
        'bg-transparent',
        // Focus ring for accessibility
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-secondary',
      )}
    >
      {title}
      {enableSorting && <ArrowUpDown className="h-4 w-4" />}
    </button>
  );
}

// Memoize with custom comparison for column object
export const SortableHeaderCatto = memo(
  SortableHeaderCattoInner,
) as typeof SortableHeaderCattoInner;

export default SortableHeaderCatto;
