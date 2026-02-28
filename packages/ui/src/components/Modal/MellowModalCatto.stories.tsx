import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import MellowModalCatto from './MellowModalCatto';

const meta = {
  title: 'Components/Modal',
  component: MellowModalCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    theme: {
      control: 'select',
      options: [
        'primary',
        'danger',
        'success',
        'warning',
        'neutral',
        'midnightEmber',
        'branded',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
    },
    position: {
      control: 'select',
      options: ['center', 'top', 'bottom'],
    },
  },
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof MellowModalCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Modal Title',
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">
          This is the modal content. You can put any content here.
        </p>
      </div>
    ),
  },
};

export const Small: Story = {
  args: {
    isOpen: true,
    title: 'Small Modal',
    size: 'sm',
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">
          A small modal for quick confirmations.
        </p>
      </div>
    ),
  },
};

export const Large: Story = {
  args: {
    isOpen: true,
    title: 'Large Modal',
    size: 'lg',
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">
          A large modal with more space for content.
        </p>
      </div>
    ),
  },
};

export const ExtraLarge: Story = {
  args: {
    isOpen: true,
    title: 'Extra Large Modal',
    size: 'xl',
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">
          An extra large modal for complex content.
        </p>
      </div>
    ),
  },
};

export const DangerTheme: Story = {
  args: {
    isOpen: true,
    title: 'Delete Confirmation',
    theme: 'danger',
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>
      </div>
    ),
  },
};

export const SuccessTheme: Story = {
  args: {
    isOpen: true,
    title: 'Success!',
    theme: 'success',
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">
          Your action was completed successfully.
        </p>
      </div>
    ),
  },
};

export const WarningTheme: Story = {
  args: {
    isOpen: true,
    title: 'Warning',
    theme: 'warning',
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">
          Please review this information carefully before proceeding.
        </p>
      </div>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    isOpen: true,
    title: 'Confirm Action',
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">
          Do you want to proceed with this action?
        </p>
      </div>
    ),
    footer: (
      <div className="flex justify-end gap-3 p-4">
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
          Cancel
        </button>
        <button className="px-4 py-2 bg-orange-500 text-white rounded">
          Confirm
        </button>
      </div>
    ),
  },
};

export const TopPosition: Story = {
  args: {
    isOpen: true,
    title: 'Top Position',
    position: 'top',
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">
          This modal appears at the top of the screen.
        </p>
      </div>
    ),
  },
};

export const BottomPosition: Story = {
  args: {
    isOpen: true,
    title: 'Bottom Position',
    position: 'bottom',
    children: (
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300">
          This modal appears at the bottom of the screen.
        </p>
      </div>
    ),
  },
};
