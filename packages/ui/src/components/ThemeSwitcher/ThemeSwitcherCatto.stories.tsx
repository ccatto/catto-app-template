import type { Meta, StoryObj } from '@storybook/react';
import ThemeSwitcherCatto from './ThemeSwitcherCatto';

const meta = {
  title: 'Components/ThemeSwitcher',
  component: ThemeSwitcherCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ThemeSwitcherCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 dark:text-gray-300">Theme:</span>
      <ThemeSwitcherCatto />
    </div>
  ),
};
