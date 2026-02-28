import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SelectCatto from './SelectCatto';

const meta = {
  title: 'Components/Select',
  component: SelectCatto,
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
} satisfies Meta<typeof SelectCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
];

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
];

export const Default: Story = {
  args: {
    options,
    placeholder: 'Select an option',
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
    options,
    label: 'Choose an option',
    placeholder: 'Select...',
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
    options,
    value: 'option2',
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
    options,
    placeholder: 'Disabled select',
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

export const WithError: Story = {
  args: {
    options,
    label: 'Country',
    placeholder: 'Select a country',
    error: 'Please select a country',
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
    options: countryOptions,
    label: 'Country',
    placeholder: 'Select a country',
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

export const Small: Story = {
  args: {
    options,
    placeholder: 'Small select',
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

export const Large: Story = {
  args: {
    options,
    placeholder: 'Large select',
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

export const ManyOptions: Story = {
  args: {
    options: countryOptions,
    placeholder: 'Select a country',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};
