import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import QuantitySelectorCatto from './QuantitySelectorCatto';

const meta = {
  title: 'E-commerce/QuantitySelector',
  component: QuantitySelectorCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'outline', 'filled'],
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof QuantitySelectorCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 1,
  },
};

export const WithLimits: Story = {
  args: {
    value: 5,
    min: 1,
    max: 10,
  },
};

export const AtMinimum: Story = {
  args: {
    value: 1,
    min: 1,
    max: 10,
  },
};

export const AtMaximum: Story = {
  args: {
    value: 10,
    min: 1,
    max: 10,
  },
};

export const WithInput: Story = {
  args: {
    value: 5,
    showInput: true,
  },
};

export const Small: Story = {
  args: {
    value: 1,
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    value: 1,
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    value: 1,
    size: 'lg',
  },
};

export const OutlineVariant: Story = {
  args: {
    value: 1,
    variant: 'outline',
  },
};

export const FilledVariant: Story = {
  args: {
    value: 1,
    variant: 'filled',
  },
};

export const Disabled: Story = {
  args: {
    value: 3,
    disabled: true,
  },
};

export const WithStep: Story = {
  args: {
    value: 10,
    step: 5,
    min: 0,
    max: 100,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <QuantitySelectorCatto value={1} size="sm" onChange={() => {}} />
      <QuantitySelectorCatto value={1} size="md" onChange={() => {}} />
      <QuantitySelectorCatto value={1} size="lg" onChange={() => {}} />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <QuantitySelectorCatto value={1} variant="default" onChange={() => {}} />
      <QuantitySelectorCatto value={1} variant="outline" onChange={() => {}} />
      <QuantitySelectorCatto value={1} variant="filled" onChange={() => {}} />
    </div>
  ),
};
