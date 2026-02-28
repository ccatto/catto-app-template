import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import DrawerCatto from './DrawerCatto';

const meta = {
  title: 'Components/Drawer',
  component: DrawerCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['left', 'right'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
  },
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof DrawerCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Left: Story = {
  args: {
    isOpen: true,
    position: 'left',
    title: 'Navigation',
    children: (
      <div className="p-4">
        <nav className="space-y-2">
          <a
            href="#"
            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            Home
          </a>
          <a
            href="#"
            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            About
          </a>
          <a
            href="#"
            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            Services
          </a>
          <a
            href="#"
            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            Contact
          </a>
        </nav>
      </div>
    ),
  },
};

export const Right: Story = {
  args: {
    isOpen: true,
    position: 'right',
    title: 'Settings',
    children: (
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Preferences</h4>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Enable notifications</span>
            </label>
          </div>
          <div>
            <h4 className="font-medium mb-2">Theme</h4>
            <select className="w-full p-2 border rounded dark:bg-gray-700">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
        </div>
      </div>
    ),
  },
};

export const Small: Story = {
  args: {
    isOpen: true,
    position: 'right',
    size: 'sm',
    title: 'Small Drawer',
    children: (
      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-300">
          A compact drawer for quick actions.
        </p>
      </div>
    ),
  },
};

export const Large: Story = {
  args: {
    isOpen: true,
    position: 'right',
    size: 'lg',
    title: 'Large Drawer',
    children: (
      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-300">
          A larger drawer with more space for content.
        </p>
      </div>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    isOpen: true,
    position: 'right',
    size: 'full',
    title: 'Full Width Drawer',
    children: (
      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-300">
          A full-width drawer that takes up the entire screen.
        </p>
      </div>
    ),
  },
};

export const WithoutTitle: Story = {
  args: {
    isOpen: true,
    position: 'left',
    children: (
      <div className="p-4">
        <nav className="space-y-2">
          <a
            href="#"
            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            Menu Item 1
          </a>
          <a
            href="#"
            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            Menu Item 2
          </a>
          <a
            href="#"
            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            Menu Item 3
          </a>
        </nav>
      </div>
    ),
  },
};
