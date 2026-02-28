import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import PhoneInputCatto from './PhoneInputCatto';

const meta = {
  title: 'Components/PhoneInput',
  component: PhoneInputCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof PhoneInputCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter phone number',
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
    label: 'Phone Number',
    placeholder: '(555) 123-4567',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithValue: Story = {
  args: {
    label: 'Phone Number',
    value: '+15551234567',
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
    label: 'Phone Number',
    value: '123',
    error: 'Please enter a valid phone number',
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
    label: 'Phone Number',
    value: '+15551234567',
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
    label: 'Phone Number',
    required: true,
    placeholder: 'Required field',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};
