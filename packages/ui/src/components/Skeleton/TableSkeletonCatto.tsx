// Table skeleton component for loading states

'use client';

import { cn } from '../../utils';
import SkeletonBaseCatto from './SkeletonBaseCatto';

export interface TableSkeletonCattoProps {
  /** Number of skeleton rows to display */
  rows?: number;
  /** Number of columns to display */
  columns?: number;
  /** Show header row skeleton */
  showHeader?: boolean;
  /** Show filter input skeleton */
  showFilter?: boolean;
  /** Show pagination skeleton */
  showPagination?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const TableSkeletonCatto = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  showFilter = true,
  showPagination = true,
  className = '',
}: TableSkeletonCattoProps) => {
  return (
    <div
      className={cn('w-full', className)}
      aria-busy="true"
      aria-live="polite"
    >
      {/* Filter skeleton */}
      {showFilter && (
        <div className="mb-4 flex items-center gap-4">
          <SkeletonBaseCatto width={200} height="lg" rounded="md" />
        </div>
      )}

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
        {/* Header row */}
        {showHeader && (
          <div className="flex gap-4 bg-catto-table-header p-3">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={`header-${i}`} className="flex-1">
                <SkeletonBaseCatto
                  width="full"
                  height="sm"
                  className="bg-gray-300/50 dark:bg-gray-600/50"
                />
              </div>
            ))}
          </div>
        )}

        {/* Data rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={cn(
              'flex gap-4 border-t border-gray-200 p-3 dark:border-gray-700',
              rowIndex % 2 === 0
                ? 'bg-catto-table-row'
                : 'bg-catto-table-row-odd',
            )}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1">
                <SkeletonBaseCatto
                  width={colIndex === 0 ? '3/4' : 'full'}
                  height="sm"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      {showPagination && (
        <div className="mt-4 flex items-center justify-between">
          <SkeletonBaseCatto width={120} height="sm" rounded="md" />
          <div className="flex gap-2">
            <SkeletonBaseCatto width={32} height="lg" rounded="md" />
            <SkeletonBaseCatto width={32} height="lg" rounded="md" />
            <SkeletonBaseCatto width={32} height="lg" rounded="md" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableSkeletonCatto;
