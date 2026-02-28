// @catto/ui - TableCatto Tests
// Comprehensive test suite for TableCatto and subcomponents
import { ColumnDef } from '@tanstack/react-table';
import { describe, expect, it, vi } from 'vitest';
import { SortableHeaderCatto } from '../../components/Table/SortableHeaderCatto';
import { TableCatto } from '../../components/Table/TableCatto';
import { TableControlsCatto } from '../../components/Table/TableControlsCatto';
import { TableCoreCatto } from '../../components/Table/TableCoreCatto';
import { useTableInstanceCatto } from '../../hooks/table/useTableInstanceCatto';
import { fireEvent, render, screen, within } from '../test-utils';

// ============================================
// Test Data & Helpers
// ============================================

interface TestUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

const testData: TestUser[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'Editor',
  },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Admin' },
  { id: 5, name: 'Eve Wilson', email: 'eve@example.com', role: 'User' },
];

const testColumns: ColumnDef<TestUser, unknown>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: 'Role',
  },
];

// Helper component to test hooks
function TableWithHook({
  data,
  columns,
  onRowClick,
}: {
  data: TestUser[];
  columns: ColumnDef<TestUser, unknown>[];
  onRowClick?: (row: TestUser) => void;
}) {
  const table = useTableInstanceCatto(data, columns);
  return (
    <TableCoreCatto
      table={table}
      columnsLength={columns.length}
      onRowClick={onRowClick}
    />
  );
}

function ControlsWithHook({
  data,
  columns,
  filterVal,
  filterText,
  filterMode = 'column',
}: {
  data: TestUser[];
  columns: ColumnDef<TestUser, unknown>[];
  filterVal?: string;
  filterText: string;
  filterMode?: 'column' | 'global';
}) {
  const table = useTableInstanceCatto(data, columns);
  return (
    <TableControlsCatto
      table={table}
      filterVal={filterVal}
      filterText={filterText}
      filterMode={filterMode}
    />
  );
}

// ============================================
// TableCatto Tests
// ============================================

describe('TableCatto', () => {
  describe('rendering', () => {
    it('renders the table with data', () => {
      render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
        />,
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    });

    it('renders column headers', () => {
      render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
        />,
      );

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
    });

    it('renders all data rows', () => {
      render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
        />,
      );

      testData.forEach((user) => {
        expect(screen.getByText(user.name)).toBeInTheDocument();
      });
    });

    it('renders empty state when no data', () => {
      render(
        <TableCatto
          columns={testColumns}
          data={[]}
          filterText="name"
          filterVal="name"
        />,
      );

      expect(
        screen.getByText('No matching results found.'),
      ).toBeInTheDocument();
    });

    it('renders custom empty state title', () => {
      render(
        <TableCatto
          columns={testColumns}
          data={[]}
          filterText="name"
          filterVal="name"
          emptyTitle="No users found"
        />,
      );

      expect(screen.getByText('No users found')).toBeInTheDocument();
    });

    it('renders custom empty state description', () => {
      render(
        <TableCatto
          columns={testColumns}
          data={[]}
          filterText="name"
          filterVal="name"
          emptyDescription="Add some users to get started."
        />,
      );

      expect(
        screen.getByText('Add some users to get started.'),
      ).toBeInTheDocument();
    });

    it('renders custom empty state component', () => {
      render(
        <TableCatto
          columns={testColumns}
          data={[]}
          filterText="name"
          filterVal="name"
          emptyState={<div data-testid="custom-empty">Custom empty</div>}
        />,
      );

      expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
          className="my-custom-class"
        />,
      );

      expect(container.querySelector('.my-custom-class')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('shows skeleton when isLoading is true', () => {
      render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
          isLoading={true}
        />,
      );

      // Skeleton should be visible, table data should not
      expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument();
    });

    it('respects skeletonRows prop', () => {
      const { container } = render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
          isLoading={true}
          skeletonRows={3}
        />,
      );

      // Should have skeleton rows (animated divs)
      const skeletonRows = container.querySelectorAll('[class*="animate"]');
      expect(skeletonRows.length).toBeGreaterThan(0);
    });
  });

  describe('selection', () => {
    it('shows selection column when showSelection is true', () => {
      const { container } = render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
          showSelection={true}
        />,
      );

      // Should have more columns (3 data columns + 1 select column = 4)
      const headerCells = container.querySelectorAll('th');
      expect(headerCells.length).toBe(testColumns.length + 1);
    });

    it('does not show selection column by default', () => {
      const { container } = render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
        />,
      );

      // Should have exactly 3 columns (no select column)
      const headerCells = container.querySelectorAll('th');
      expect(headerCells.length).toBe(testColumns.length);
    });
  });

  describe('row click', () => {
    it('calls onRowClick when row is clicked', () => {
      const handleRowClick = vi.fn();
      render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
          onRowClick={handleRowClick}
        />,
      );

      const firstRow = screen.getByText('Alice Johnson').closest('tr');
      fireEvent.click(firstRow!);

      expect(handleRowClick).toHaveBeenCalledWith(testData[0]);
    });

    it('applies cursor pointer when onRowClick is provided', () => {
      render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
          onRowClick={vi.fn()}
        />,
      );

      const firstRow = screen.getByText('Alice Johnson').closest('tr');
      expect(firstRow).toHaveClass('cursor-pointer');
    });
  });

  describe('hidden columns', () => {
    it('hides columns specified in hiddenColumns', () => {
      render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
          hiddenColumns={['email']}
        />,
      );

      // Email column header should not be visible
      expect(screen.queryByText('alice@example.com')).not.toBeInTheDocument();
    });
  });

  describe('scroll wrapper', () => {
    it('shows scroll wrapper by default', () => {
      const { container } = render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
        />,
      );

      // MobileScrollIndicatorWrapperCatto should be present
      expect(
        container.querySelector('[class*="overflow"]'),
      ).toBeInTheDocument();
    });

    it('hides scroll wrapper when showScrollWrapper is false', () => {
      render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
          showScrollWrapper={false}
        />,
      );

      // Table should still render
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });
});

// ============================================
// TableCoreCatto Tests
// ============================================

describe('TableCoreCatto', () => {
  describe('rendering', () => {
    it('renders table element', () => {
      render(<TableWithHook data={testData} columns={testColumns} />);
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('renders header row', () => {
      render(<TableWithHook data={testData} columns={testColumns} />);
      const headerCells = screen.getAllByRole('columnheader');
      expect(headerCells).toHaveLength(testColumns.length);
    });

    it('renders data rows', () => {
      render(<TableWithHook data={testData} columns={testColumns} />);
      const rows = screen.getAllByRole('row');
      // Header row + data rows
      expect(rows).toHaveLength(testData.length + 1);
    });

    it('renders cell content', () => {
      render(<TableWithHook data={testData} columns={testColumns} />);

      // Check that all names and emails are present (roles may have duplicates)
      testData.forEach((user) => {
        expect(screen.getByText(user.name)).toBeInTheDocument();
        expect(screen.getByText(user.email)).toBeInTheDocument();
      });

      // Check that role values exist (using getAllByText for duplicates)
      expect(screen.getAllByText('Admin')).toHaveLength(2);
      expect(screen.getAllByText('User')).toHaveLength(2);
      expect(screen.getByText('Editor')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('shows default empty message when no data', () => {
      render(<TableWithHook data={[]} columns={testColumns} />);
      expect(
        screen.getByText('No matching results found.'),
      ).toBeInTheDocument();
    });

    it('shows default empty description', () => {
      render(<TableWithHook data={[]} columns={testColumns} />);
      expect(
        screen.getByText('Try adjusting your search or filter criteria.'),
      ).toBeInTheDocument();
    });
  });

  describe('row interactions', () => {
    it('calls onRowClick with row data when clicked', () => {
      const handleClick = vi.fn();
      render(
        <TableWithHook
          data={testData}
          columns={testColumns}
          onRowClick={handleClick}
        />,
      );

      const row = screen.getByText('Bob Smith').closest('tr');
      fireEvent.click(row!);

      expect(handleClick).toHaveBeenCalledWith(testData[1]);
    });

    it('does not throw when clicking without onRowClick', () => {
      render(<TableWithHook data={testData} columns={testColumns} />);

      const row = screen.getByText('Bob Smith').closest('tr');
      expect(() => fireEvent.click(row!)).not.toThrow();
    });
  });

  describe('styling', () => {
    it('applies alternating row colors', () => {
      render(<TableWithHook data={testData} columns={testColumns} />);

      const rows = screen.getAllByRole('row').slice(1); // Skip header
      expect(rows[0]).toHaveClass('bg-catto-table-row');
      expect(rows[1]).toHaveClass('bg-catto-table-row-odd');
    });

    it('applies header styling', () => {
      const { container } = render(
        <TableWithHook data={testData} columns={testColumns} />,
      );

      const header = container.querySelector('thead');
      expect(header).toHaveClass('bg-catto-table-header');
    });
  });
});

// ============================================
// TableControlsCatto Tests
// ============================================

describe('TableControlsCatto', () => {
  describe('filter input', () => {
    it('renders filter input', () => {
      render(
        <ControlsWithHook
          data={testData}
          columns={testColumns}
          filterVal="name"
          filterText="name"
        />,
      );

      expect(screen.getByPlaceholderText('Filter by name')).toBeInTheDocument();
    });

    it('shows correct placeholder text', () => {
      render(
        <ControlsWithHook
          data={testData}
          columns={testColumns}
          filterVal="email"
          filterText="email address"
        />,
      );

      expect(
        screen.getByPlaceholderText('Filter by email address'),
      ).toBeInTheDocument();
    });

    it('updates filter value on input', async () => {
      const { user } = render(
        <ControlsWithHook
          data={testData}
          columns={testColumns}
          filterVal="name"
          filterText="name"
        />,
      );

      const input = screen.getByPlaceholderText('Filter by name');
      await user.type(input, 'Alice');

      expect(input).toHaveValue('Alice');
    });
  });

  describe('pagination controls', () => {
    it('renders pagination container', () => {
      const { container } = render(
        <ControlsWithHook
          data={testData}
          columns={testColumns}
          filterVal="name"
          filterText="name"
        />,
      );

      // Should have pagination container
      const paginationContainer = container.querySelector('.ml-auto');
      expect(paginationContainer).toBeInTheDocument();
    });
  });

  describe('filter modes', () => {
    it('uses column filter mode by default', () => {
      render(
        <ControlsWithHook
          data={testData}
          columns={testColumns}
          filterVal="name"
          filterText="name"
          filterMode="column"
        />,
      );

      expect(screen.getByPlaceholderText('Filter by name')).toBeInTheDocument();
    });

    it('supports global filter mode', () => {
      render(
        <ControlsWithHook
          data={testData}
          columns={testColumns}
          filterText="all columns"
          filterMode="global"
        />,
      );

      expect(
        screen.getByPlaceholderText('Filter by all columns'),
      ).toBeInTheDocument();
    });
  });
});

// ============================================
// SortableHeaderCatto Tests
// ============================================

describe('SortableHeaderCatto', () => {
  // Create a mock column for testing
  const createMockColumn = (isSorted: false | 'asc' | 'desc' = false) => ({
    toggleSorting: vi.fn(),
    getIsSorted: () => isSorted,
  });

  it('renders header title', () => {
    const mockColumn = createMockColumn();
    render(
      <SortableHeaderCatto column={mockColumn as never} title="Test Header" />,
    );

    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  it('renders sort icon when sorting is enabled', () => {
    const mockColumn = createMockColumn();
    const { container } = render(
      <SortableHeaderCatto
        column={mockColumn as never}
        title="Name"
        enableSorting={true}
      />,
    );

    // Should have the ArrowUpDown icon
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('does not render sort icon when sorting is disabled', () => {
    const mockColumn = createMockColumn();
    const { container } = render(
      <SortableHeaderCatto
        column={mockColumn as never}
        title="Name"
        enableSorting={false}
      />,
    );

    const svg = container.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('calls toggleSorting on click', () => {
    const mockColumn = createMockColumn();
    render(<SortableHeaderCatto column={mockColumn as never} title="Name" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockColumn.toggleSorting).toHaveBeenCalled();
  });

  it('toggles to desc when currently asc', () => {
    const mockColumn = createMockColumn('asc');
    render(<SortableHeaderCatto column={mockColumn as never} title="Name" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // When sorted asc, clicking should toggle to desc (true)
    expect(mockColumn.toggleSorting).toHaveBeenCalledWith(true);
  });

  it('toggles to asc when currently desc', () => {
    const mockColumn = createMockColumn('desc');
    render(<SortableHeaderCatto column={mockColumn as never} title="Name" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // When sorted desc, clicking should toggle to asc (false)
    expect(mockColumn.toggleSorting).toHaveBeenCalledWith(false);
  });

  it('toggles to asc when not sorted', () => {
    const mockColumn = createMockColumn(false);
    render(<SortableHeaderCatto column={mockColumn as never} title="Name" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockColumn.toggleSorting).toHaveBeenCalledWith(false);
  });
});

// ============================================
// Integration Tests
// ============================================

describe('TableCatto Integration', () => {
  describe('filtering', () => {
    it('filters data by column value', async () => {
      const { user } = render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterVal="name"
          filterText="name"
        />,
      );

      const input = screen.getByPlaceholderText('Filter by name');
      await user.type(input, 'Alice');

      // Only Alice should be visible
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
    });

    it('shows empty state when filter matches nothing', async () => {
      const { user } = render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterVal="name"
          filterText="name"
        />,
      );

      const input = screen.getByPlaceholderText('Filter by name');
      await user.type(input, 'NonexistentUser');

      expect(
        screen.getByText('No matching results found.'),
      ).toBeInTheDocument();
    });

    it('filters globally across all columns', async () => {
      const { user } = render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="all"
          filterMode="global"
        />,
      );

      const input = screen.getByPlaceholderText('Filter by all');
      await user.type(input, 'Admin');

      // Should show Alice and Diana (both are Admin)
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Diana Prince')).toBeInTheDocument();
      expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
    });
  });

  describe('selection with filter', () => {
    it('selection column renders with filtered data', async () => {
      const { user, container } = render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterVal="name"
          filterText="name"
          showSelection={true}
        />,
      );

      // Filter to show only Alice
      const input = screen.getByPlaceholderText('Filter by name');
      await user.type(input, 'Alice');

      // Should still have selection column
      const headerCells = container.querySelectorAll('th');
      expect(headerCells.length).toBe(testColumns.length + 1);

      // Only one data row should be visible
      const rows = container.querySelectorAll('tbody tr');
      expect(rows.length).toBe(1);
    });
  });

  describe('accessibility', () => {
    it('table has proper role', () => {
      render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
        />,
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('rows are accessible', () => {
      render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
        />,
      );

      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(0);
    });

    it('cells are accessible', () => {
      render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
        />,
      );

      const cells = screen.getAllByRole('cell');
      expect(cells.length).toBeGreaterThan(0);
    });

    it('column headers are accessible', () => {
      render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
        />,
      );

      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBe(testColumns.length);
    });

    it('filter input has proper placeholder', () => {
      render(
        <TableCatto
          columns={testColumns}
          data={testData}
          filterText="name"
          filterVal="name"
        />,
      );

      const input = screen.getByPlaceholderText('Filter by name');
      expect(input).toBeInTheDocument();
    });
  });
});
