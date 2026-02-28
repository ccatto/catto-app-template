import type { Meta, StoryObj } from '@storybook/react';
import InlineLoadingCatto from './InlineLoadingCatto';

const meta = {
  title: 'Components/Loading/InlineLoading',
  component: InlineLoadingCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof InlineLoadingCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithText: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <InlineLoadingCatto />
      <span className="text-gray-600 dark:text-gray-300">Loading...</span>
    </div>
  ),
};
