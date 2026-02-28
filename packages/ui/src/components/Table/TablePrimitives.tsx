// @catto/ui - Table Primitives
// Base table components for building data tables
// Performance: Row-related components use React.memo to prevent unnecessary re-renders
'use client';

import * as React from 'react';
import { cn } from '../../utils';

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'bg-muted/50 border-t font-medium last:[&>tr]:border-b-0',
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

// Memoized for performance - rows are rendered frequently
const TableRow = React.memo(
  React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
  >(({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
        className,
      )}
      {...props}
    />
  )),
);
TableRow.displayName = 'TableRow';

// Memoized for performance - headers are rendered per column
const TableHead = React.memo(
  React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
  >(({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'text-muted-foreground h-10 px-2 py-2 md:h-12 md:px-4 md:py-3 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  )),
);
TableHead.displayName = 'TableHead';

// Memoized for performance - cells are the most frequently rendered
const TableCell = React.memo(
  React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
  >(({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'px-2 py-3 md:px-4 md:py-4 align-middle [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  )),
);
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('text-muted-foreground mt-4 text-sm', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
