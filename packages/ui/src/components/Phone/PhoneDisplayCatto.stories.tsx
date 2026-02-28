import type { Meta, StoryObj } from '@storybook/react';
import PhoneDisplayCatto from './PhoneDisplayCatto';

const meta = {
  title: 'Components/PhoneDisplay',
  component: PhoneDisplayCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PhoneDisplayCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const USNumber: Story = {
  args: {
    value: '+15551234567',
  },
};

export const InternationalNumber: Story = {
  args: {
    value: '+442071234567',
  },
};

export const WithCountryCode: Story = {
  args: {
    value: '+15551234567',
    showCountryCode: true,
  },
};

export const Formatted: Story = {
  args: {
    value: '+15551234567',
    format: 'national',
  },
};

export const Clickable: Story = {
  args: {
    value: '+15551234567',
    clickable: true,
  },
};

export const EmptyValue: Story = {
  args: {
    value: '',
    placeholder: 'No phone number',
  },
};
