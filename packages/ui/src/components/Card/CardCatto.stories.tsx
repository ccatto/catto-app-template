import type { Meta, StoryObj } from '@storybook/react';
import CardCatto from './CardCatto';

const meta = {
  title: 'Components/Card',
  component: CardCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    width: {
      control: 'select',
      options: [
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        '6xl',
        '7xl',
        'full',
      ],
    },
    bodyPadding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    elevation: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'elevated', 'ghost'],
    },
  },
} satisfies Meta<typeof CardCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">
          This is a default card with some content inside.
        </p>
      </div>
    ),
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Card Title',
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">
          Card content goes here.
        </p>
      </div>
    ),
  },
};

export const Bordered: Story = {
  args: {
    variant: 'bordered',
    title: 'Bordered Card',
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">
          A card with a visible border.
        </p>
      </div>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    elevation: 'lg',
    title: 'Elevated Card',
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">
          A card with shadow elevation.
        </p>
      </div>
    ),
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    title: 'Ghost Card',
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">
          A transparent card with minimal styling.
        </p>
      </div>
    ),
  },
};

export const SmallWidth: Story = {
  args: {
    width: 'sm',
    title: 'Small Card',
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">A small width card.</p>
      </div>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    width: 'full',
    title: 'Full Width Card',
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">A full width card.</p>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export const NoPadding: Story = {
  args: {
    bodyPadding: 'none',
    children: (
      <img
        src="https://via.placeholder.com/400x200"
        alt="Placeholder"
        className="w-full rounded-lg"
      />
    ),
  },
};
