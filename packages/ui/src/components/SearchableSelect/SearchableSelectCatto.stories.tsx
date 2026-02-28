// @catto/ui - SearchableSelectCatto Stories
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SearchableSelectCatto from './SearchableSelectCatto';

const meta = {
  title: 'Components/SearchableSelectCatto',
  component: SearchableSelectCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'minimal', 'primary'],
    },
    theme: {
      control: 'select',
      options: ['light', 'sunset', 'ocean', 'forest', 'dusk'],
    },
    width: {
      control: 'select',
      options: ['auto', 'full', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
} satisfies Meta<typeof SearchableSelectCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' },
  { value: 'br', label: 'Brazil' },
];

// Interactive wrapper
const SelectWrapper = (
  props: React.ComponentProps<typeof SearchableSelectCatto>,
) => {
  const [value, setValue] = useState(props.value || '');

  return (
    <div className="w-72">
      <SearchableSelectCatto
        {...props}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          props.onChange?.(newValue);
        }}
      />
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Selected: {value || 'None'}
      </p>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <SelectWrapper {...args} />,
  args: {
    options: countryOptions,
    placeholder: 'Search countries...',
    value: '',
    onChange: (value) => console.log('Selected:', value),
  },
};

export const WithLabel: Story = {
  render: (args) => <SelectWrapper {...args} />,
  args: {
    options: countryOptions,
    label: 'Country',
    placeholder: 'Search countries...',
    value: '',
    onChange: (value) => console.log('Selected:', value),
  },
};

export const WithError: Story = {
  render: (args) => <SelectWrapper {...args} />,
  args: {
    options: countryOptions,
    label: 'Country',
    error: 'Please select a country',
    value: '',
    onChange: (value) => console.log('Selected:', value),
  },
};

export const AllowCreate: Story = {
  render: (args) => <SelectWrapper {...args} />,
  args: {
    options: countryOptions,
    label: 'Country',
    placeholder: 'Search or create...',
    allowCreate: true,
    createNewText: 'Add country',
    onCreateNew: (text) => console.log('Create:', text),
    value: '',
    onChange: (value) => console.log('Selected:', value),
  },
};

export const Disabled: Story = {
  render: (args) => <SelectWrapper {...args} />,
  args: {
    options: countryOptions,
    label: 'Country',
    disabled: true,
    value: 'us',
    onChange: (value) => console.log('Selected:', value),
  },
};

export const SmallSize: Story = {
  render: (args) => <SelectWrapper {...args} />,
  args: {
    options: countryOptions,
    label: 'Country (Small)',
    size: 'small',
    value: '',
    onChange: (value) => console.log('Selected:', value),
  },
};

export const LargeSize: Story = {
  render: (args) => <SelectWrapper {...args} />,
  args: {
    options: countryOptions,
    label: 'Country (Large)',
    size: 'large',
    value: '',
    onChange: (value) => console.log('Selected:', value),
  },
};

export const PrimaryVariant: Story = {
  render: (args) => <SelectWrapper {...args} />,
  args: {
    options: countryOptions,
    label: 'Country',
    variant: 'primary',
    value: '',
    onChange: (value) => console.log('Selected:', value),
  },
};

export const OceanTheme: Story = {
  render: (args) => <SelectWrapper {...args} />,
  args: {
    options: countryOptions,
    label: 'Country',
    theme: 'ocean',
    value: '',
    onChange: (value) => console.log('Selected:', value),
  },
};

export const ForestTheme: Story = {
  render: (args) => <SelectWrapper {...args} />,
  args: {
    options: countryOptions,
    label: 'Country',
    theme: 'forest',
    value: '',
    onChange: (value) => console.log('Selected:', value),
  },
};
