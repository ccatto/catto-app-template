import type { Meta, StoryObj } from '@storybook/react';
import { Info } from 'lucide-react';
import TooltipCatto from './TooltipCatto';

const meta = {
  title: 'Components/Tooltip',
  component: TooltipCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
} satisfies Meta<typeof TooltipCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {
  args: {
    content: 'This is a tooltip',
    position: 'top',
    children: (
      <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
        Hover me
      </button>
    ),
  },
};

export const Bottom: Story = {
  args: {
    content: 'This is a tooltip',
    position: 'bottom',
    children: (
      <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
        Hover me
      </button>
    ),
  },
};

export const Left: Story = {
  args: {
    content: 'This is a tooltip',
    position: 'left',
    children: (
      <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
        Hover me
      </button>
    ),
  },
};

export const Right: Story = {
  args: {
    content: 'This is a tooltip',
    position: 'right',
    children: (
      <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
        Hover me
      </button>
    ),
  },
};

export const WithIcon: Story = {
  args: {
    content: 'Click for more information',
    position: 'top',
    children: <Info className="h-5 w-5 text-gray-500 cursor-help" />,
  },
};

export const LongContent: Story = {
  args: {
    content:
      'This is a longer tooltip message that provides more detailed information about the element.',
    position: 'top',
    children: (
      <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
        Hover for details
      </button>
    ),
  },
};

export const AllPositions: Story = {
  render: () => (
    <div className="flex gap-8">
      <TooltipCatto content="Top tooltip" position="top">
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
          Top
        </button>
      </TooltipCatto>
      <TooltipCatto content="Bottom tooltip" position="bottom">
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
          Bottom
        </button>
      </TooltipCatto>
      <TooltipCatto content="Left tooltip" position="left">
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
          Left
        </button>
      </TooltipCatto>
      <TooltipCatto content="Right tooltip" position="right">
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
          Right
        </button>
      </TooltipCatto>
    </div>
  ),
};
