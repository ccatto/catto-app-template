import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Eye, EyeOff, Mail, Search } from 'lucide-react';
import InputCatto from './InputCatto';

const meta = {
  title: 'Components/Input',
  component: InputCatto,
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
      options: ['default', 'filled', 'outline', 'ghost'],
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof InputCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    type: 'email',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    helperText: 'Must be at least 8 characters',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot type here',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Required: Story = {
  args: {
    label: 'Required Field',
    placeholder: 'This field is required',
    required: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Search...',
    leftIcon: <Search className="h-4 w-4" />,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithRightIcon: Story = {
  args: {
    placeholder: 'Enter email',
    rightIcon: <Mail className="h-4 w-4" />,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const SmallSize: Story = {
  args: {
    placeholder: 'Small input',
    size: 'sm',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const LargeSize: Story = {
  args: {
    placeholder: 'Large input',
    size: 'lg',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const FilledVariant: Story = {
  args: {
    placeholder: 'Filled variant',
    variant: 'filled',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};
