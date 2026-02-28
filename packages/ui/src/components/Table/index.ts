// @catto/ui - Table Components barrel export

// Main Table Component
export { TableCatto } from './TableCatto';
export type { TableCattoProps } from './TableCatto';

// Core Table Component (without wrapper)
export { TableCoreCatto } from './TableCoreCatto';
export type { TableCoreCattoProps } from './TableCoreCatto';

// Table Controls (filter + pagination)
export { TableControlsCatto } from './TableControlsCatto';
export type { TableControlsCattoProps } from './TableControlsCatto';

// Pagination Buttons
export { TablePrevNextButtonsCatto } from './TablePrevNextButtonsCatto';
export type { TablePrevNextButtonsCattoProps } from './TablePrevNextButtonsCatto';

// Selection Column
export { createSelectColumn } from './TableSelectColumnCatto';

// Sortable Header
export { SortableHeaderCatto } from './SortableHeaderCatto';
export type { SortableHeaderCattoProps } from './SortableHeaderCatto';

// Table Primitives
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './TablePrimitives';
