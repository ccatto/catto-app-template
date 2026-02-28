import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SortableHeaderCatto from './SortableHeaderCatto';

const meta = {
  title: 'Components/Table/SortableHeader',
  component: SortableHeaderCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SortableHeaderCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock column object for demos
const mockColumn = {
  getIsSorted: () => false,
  toggleSorting: fn(),
  getCanSort: () => true,
};

const mockColumnAsc = {
  ...mockColumn,
  getIsSorted: () => 'asc',
};

const mockColumnDesc = {
  ...mockColumn,
  getIsSorted: () => 'desc',
};

export const Default: Story = {
  args: {
    column: mockColumn as any,
    title: 'Column Name',
  },
};

export const SortedAscending: Story = {
  args: {
    column: mockColumnAsc as any,
    title: 'Name',
  },
};

export const SortedDescending: Story = {
  args: {
    column: mockColumnDesc as any,
    title: 'Name',
  },
};

export const InTableContext: Story = {
  render: () => (
    <table className="min-w-full">
      <thead className="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th className="px-4 py-2 text-left">
            <SortableHeaderCatto column={mockColumn as any} title="Name" />
          </th>
          <th className="px-4 py-2 text-left">
            <SortableHeaderCatto column={mockColumnAsc as any} title="Date" />
          </th>
          <th className="px-4 py-2 text-left">
            <SortableHeaderCatto column={mockColumnDesc as any} title="Score" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b dark:border-gray-700">
          <td className="px-4 py-2">John Doe</td>
          <td className="px-4 py-2">2026-01-15</td>
          <td className="px-4 py-2">95</td>
        </tr>
        <tr className="border-b dark:border-gray-700">
          <td className="px-4 py-2">Jane Smith</td>
          <td className="px-4 py-2">2026-01-14</td>
          <td className="px-4 py-2">88</td>
        </tr>
      </tbody>
    </table>
  ),
};
