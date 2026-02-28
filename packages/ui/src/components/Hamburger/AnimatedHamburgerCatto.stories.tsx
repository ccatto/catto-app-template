// Need to import useState for the interactive example
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import AnimatedHamburgerCatto from './AnimatedHamburgerCatto';

const meta = {
  title: 'Components/AnimatedHamburger',
  component: AnimatedHamburgerCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof AnimatedHamburgerCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
  },
};

export const Small: Story = {
  args: {
    isOpen: false,
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    isOpen: false,
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    isOpen: false,
    size: 'lg',
  },
};

export const Interactive: Story = {
  render: function InteractiveHamburger() {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <AnimatedHamburgerCatto
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        />
        <span className="text-sm text-gray-500">
          Click to toggle: {isOpen ? 'Open' : 'Closed'}
        </span>
      </div>
    );
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <AnimatedHamburgerCatto isOpen={false} size="sm" onClick={() => {}} />
        <span className="text-xs text-gray-500">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AnimatedHamburgerCatto isOpen={false} size="md" onClick={() => {}} />
        <span className="text-xs text-gray-500">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AnimatedHamburgerCatto isOpen={false} size="lg" onClick={() => {}} />
        <span className="text-xs text-gray-500">Large</span>
      </div>
    </div>
  ),
};
