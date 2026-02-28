// @catto/ui - ThemeToggleCatto Stories
import type { Meta, StoryObj } from '@storybook/react';
import ThemeToggleCatto from './ThemeToggleCatto';

const meta = {
  title: 'Components/ThemeToggleCatto',
  component: ThemeToggleCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Theme toggle component that uses next-themes. Requires next-themes to be installed and ThemeProvider configured.',
      },
    },
  },
} satisfies Meta<typeof ThemeToggleCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'The ThemeToggleCatto requires next-themes to be installed. In a non-Next.js environment like Storybook, it may not render correctly.',
      },
    },
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'shadow-lg',
  },
};
