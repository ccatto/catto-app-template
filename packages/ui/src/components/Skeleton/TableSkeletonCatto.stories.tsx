import type { Meta, StoryObj } from '@storybook/react';
import TableSkeletonCatto from './TableSkeletonCatto';

const meta = {
  title: 'Components/Skeleton/Table',
  component: TableSkeletonCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof TableSkeletonCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rows: 5,
    columns: 4,
  },
};

export const ThreeRows: Story = {
  args: {
    rows: 3,
    columns: 4,
  },
};

export const FiveColumns: Story = {
  args: {
    rows: 5,
    columns: 5,
  },
};

export const TwoColumns: Story = {
  args: {
    rows: 5,
    columns: 2,
  },
};
