// @catto/ui - TableCatto
// Full-featured data table with filtering, pagination, selection, and loading states
'use client';

import { ReactNode, useEffect, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useTableInstanceCatto } from '../../hooks/table/useTableInstanceCatto';
import { isBelow, useBreakpoint } from '../../hooks/useBreakpoint';
import '../../types/table-meta';
import { cn } from '../../utils';
import { MobileScrollIndicatorWrapperCatto } from '../MobileScroll';
import { TableSkeletonCatto } from '../Skeleton';
import { TableControlsCatto } from './TableControlsCatto';
import { TableCoreCatto } from './TableCoreCatto';
import { createSelectColumn } from './TableSelectColumnCatto';

export interface TableCattoProps<TData, TValue> {
  /** Column definitions for the table */
  columns: ColumnDef<TData, TValue>[];
  /** Data array to display */
  data: TData[];
  /** Column ID to filter on (required for 'column' mode, ignored for 'global' mode) */
  filterVal?: string;
  /** Placeholder text for the filter input */
  filterText: string;
  /** Filter mode: 'column' filters single column, 'global' searches all columns (default: 'column') */
  filterMode?: 'column' | 'global';
  /** Show skeleton loading state instead of table */
  isLoading?: boolean;
  /** Number of skeleton rows to display (default: 5) */
  skeletonRows?: number;
  /** Callback when a row is clicked - enables clickable rows with cursor pointer */
  onRowClick?: (row: TData) => void;
  /** Show checkbox selection column as first column (default: false) */
  showSelection?: boolean;
  /** Accent color for scroll indicators (default: 'orange') */
  accentColor?: 'orange' | 'blue' | 'default';
  /** Custom empty state title (default: "No matching results found.") */
  emptyTitle?: string;
  /** Custom empty state description (default: "Try adjusting your search or filter criteria.") */
  emptyDescription?: string;
  /** Fully custom empty state component (overrides emptyTitle/emptyDescription) */
  emptyState?: ReactNode;
  /** Column IDs to hide from view (useful for filter-only columns) */
  hiddenColumns?: string[];
  /** Additional CSS classes */
  className?: string;
  /** Show mobile scroll indicator wrapper (default: true) */
  showScrollWrapper?: boolean;
  /** Show scroll tutorial for first-time users (default: true) */
  showTutorial?: boolean;
  /** Number of rows per page (default: 10, set to data.length to show all) */
  pageSize?: number;
  /** Make the table header sticky when scrolling (default: false) */
  stickyHeader?: boolean;
}

export function TableCatto<TData, TValue>({
  columns,
  data,
  filterVal,
  filterText,
  filterMode = 'column',
  isLoading = false,
  skeletonRows = 5,
  onRowClick,
  showSelection = false,
  accentColor = 'orange',
  emptyTitle,
  emptyDescription,
  emptyState,
  hiddenColumns = [],
  className,
  showScrollWrapper = true,
  showTutorial = true,
  pageSize,
  stickyHeader,
}: TableCattoProps<TData, TValue>) {
  const breakpoint = useBreakpoint();

  // Prepend selection column when enabled
  const columnsWithSelection = useMemo(() => {
    if (!showSelection) return columns;
    return [
      createSelectColumn<TData>() as ColumnDef<TData, TValue>,
      ...columns,
    ];
  }, [columns, showSelection]);

  // Convert hiddenColumns array to visibility state object
  const initialColumnVisibility = useMemo(() => {
    return hiddenColumns.reduce(
      (acc, colId) => {
        acc[colId] = false;
        return acc;
      },
      {} as Record<string, boolean>,
    );
  }, [hiddenColumns]);

  const table = useTableInstanceCatto(data, columnsWithSelection, {
    initialColumnVisibility,
    ...(pageSize ? { pageSize } : {}),
  });

  // Responsive column hiding: update visibility when breakpoint changes
  useEffect(() => {
    const responsiveVisibility: Record<string, boolean> = {};

    for (const column of table.getAllColumns()) {
      const meta = column.columnDef.meta;
      if (meta?.responsiveHide) {
        responsiveVisibility[column.id] = !isBelow(
          breakpoint,
          meta.responsiveHide,
        );
      }
    }

    if (Object.keys(responsiveVisibility).length > 0) {
      table.setColumnVisibility((prev) => ({
        ...prev,
        ...responsiveVisibility,
      }));
    }
  }, [breakpoint, table]);

  // Show skeleton loading state
  if (isLoading) {
    return (
      <TableSkeletonCatto
        rows={skeletonRows}
        columns={columns.length}
        showHeader={true}
        showFilter={true}
        showPagination={true}
      />
    );
  }

  const tableContent = (
    <div className="min-w-max">
      <TableControlsCatto
        table={table}
        filterVal={filterVal}
        filterText={filterText}
        filterMode={filterMode}
      />
      <TableCoreCatto
        table={table}
        columnsLength={columnsWithSelection.length}
        onRowClick={onRowClick}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        emptyState={emptyState}
        stickyHeader={stickyHeader}
      />
    </div>
  );

  if (!showScrollWrapper) {
    return (
      <div className={cn('relative w-full', className)}>{tableContent}</div>
    );
  }

  return (
    <MobileScrollIndicatorWrapperCatto
      showScrollButtons
      accentColor={accentColor}
      className={cn('relative w-full', className)}
      showTutorial={showTutorial}
    >
      {tableContent}
    </MobileScrollIndicatorWrapperCatto>
  );
}

export default TableCatto;
