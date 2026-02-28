import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import CheckboxCatto from './CheckboxCatto';

const meta = {
  title: 'Components/Checkbox',
  component: CheckboxCatto,
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
    onChange: fn(),
  },
} satisfies Meta<typeof CheckboxCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked checkbox',
    checked: true,
  },
};

export const Unchecked: Story = {
  args: {
    label: 'Unchecked checkbox',
    checked: false,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Indeterminate checkbox',
    indeterminate: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled and checked',
    checked: true,
    disabled: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Newsletter',
    description: 'Receive updates about new features and promotions.',
  },
};

export const Required: Story = {
  args: {
    label: 'I agree to the terms',
    required: true,
  },
};

export const Small: Story = {
  args: {
    label: 'Small checkbox',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    label: 'Large checkbox',
    size: 'lg',
  },
};

export const WithError: Story = {
  args: {
    label: 'Accept terms',
    error: 'You must accept the terms to continue',
  },
};

export const CheckboxGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <CheckboxCatto label="Option 1" onChange={() => {}} />
      <CheckboxCatto label="Option 2" checked onChange={() => {}} />
      <CheckboxCatto label="Option 3" onChange={() => {}} />
      <CheckboxCatto label="Option 4 (disabled)" disabled onChange={() => {}} />
    </div>
  ),
};
