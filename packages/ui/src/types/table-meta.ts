// @catto/ui - TanStack Table Column Meta Type Augmentation
// Extends ColumnMeta to support responsive column hiding
import type { RowData } from '@tanstack/react-table';
import type { Breakpoint } from '../hooks/useBreakpoint';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /**
     * Hide this column when the viewport is below the specified breakpoint.
     * Example: 'md' means hide below 768px (mobile phones)
     *
     * @example
     * { meta: { responsiveHide: 'md' } } // Hidden on xs and sm, visible on md+
     */
    responsiveHide?: Breakpoint;
  }
}
