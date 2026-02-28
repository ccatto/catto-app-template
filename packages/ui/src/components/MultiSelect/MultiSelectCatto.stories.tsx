import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MultiSelectCatto, { MultiSelectOption } from './MultiSelectCatto';

const meta: Meta<typeof MultiSelectCatto> = {
  title: 'Components/MultiSelectCatto',
  component: MultiSelectCatto,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    width: {
      control: 'select',
      options: ['auto', 'full'],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MultiSelectCatto>;

// Sample options
const teamOptions: MultiSelectOption[] = [
  { value: '1', label: 'Team Alpha', color: '#ef4444' },
  { value: '2', label: 'Team Beta', color: '#3b82f6' },
  { value: '3', label: 'Team Charlie', color: '#22c55e' },
  { value: '4', label: 'Team Delta', color: '#f97316' },
  { value: '5', label: 'Team Echo', color: '#8b5cf6' },
  { value: '6', label: 'Team Foxtrot', color: '#ec4899' },
];

const teamOptionsWithDisabled: MultiSelectOption[] = [
  { value: '1', label: 'Team Alpha', color: '#ef4444' },
  {
    value: '2',
    label: 'Team Beta',
    color: '#3b82f6',
    disabled: true,
    description: 'Already registered',
  },
  { value: '3', label: 'Team Charlie', color: '#22c55e' },
  {
    value: '4',
    label: 'Team Delta',
    color: '#f97316',
    disabled: true,
    description: 'Already registered',
  },
  { value: '5', label: 'Team Echo', color: '#8b5cf6' },
];

const simpleOptions: MultiSelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

// Interactive wrapper for stories
const MultiSelectWrapper = (
  props: Partial<React.ComponentProps<typeof MultiSelectCatto>>,
) => {
  const [selected, setSelected] = useState<string[]>(
    props.selectedValues || [],
  );

  return (
    <MultiSelectCatto
      options={teamOptions}
      selectedValues={selected}
      onChange={setSelected}
      placeholder="Select teams..."
      {...props}
    />
  );
};

export const Default: Story = {
  render: () => <MultiSelectWrapper />,
};

export const WithLabel: Story = {
  render: () => <MultiSelectWrapper label="Select Teams" />,
};

export const WithSearch: Story = {
  render: () => (
    <MultiSelectWrapper
      label="Select Teams"
      searchable
      searchPlaceholder="Search teams..."
    />
  ),
};

export const WithSelectAll: Story = {
  render: () => (
    <MultiSelectWrapper
      label="Select Teams"
      searchable
      showSelectAll
      searchPlaceholder="Search teams..."
    />
  ),
};

export const WithMaxSelections: Story = {
  render: () => (
    <MultiSelectWrapper
      label="Select up to 3 Teams"
      showSelectAll
      maxSelections={3}
    />
  ),
};

export const WithDisabledOptions: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <MultiSelectCatto
        options={teamOptionsWithDisabled}
        selectedValues={selected}
        onChange={setSelected}
        label="Select Teams"
        showSelectAll
        searchable
        placeholder="Select teams..."
      />
    );
  },
};

export const SingleSelect: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <MultiSelectCatto
        options={teamOptions}
        selectedValues={selected}
        onChange={setSelected}
        multiple={false}
        label="Select One Team"
        placeholder="Choose a team..."
      />
    );
  },
};

export const WithoutColors: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <MultiSelectCatto
        options={simpleOptions}
        selectedValues={selected}
        onChange={setSelected}
        label="Select Fruits"
        searchable
        showSelectAll
        placeholder="Select fruits..."
      />
    );
  },
};

export const PreSelected: Story = {
  render: () => <MultiSelectWrapper selectedValues={['1', '3']} />,
};

export const WithError: Story = {
  render: () => (
    <MultiSelectWrapper
      label="Select Teams"
      error="Please select at least one team"
    />
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <MultiSelectWrapper
      label="Select Teams"
      helperText="You can select multiple teams for this tournament"
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <MultiSelectWrapper label="Select Teams" disabled selectedValues={['1']} />
  ),
};

export const Loading: Story = {
  render: () => <MultiSelectWrapper label="Select Teams" isLoading />,
};

export const Empty: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <MultiSelectCatto
        options={[]}
        selectedValues={selected}
        onChange={setSelected}
        label="Select Teams"
        emptyMessage="No teams available in this organization"
      />
    );
  },
};

export const SmallSize: Story = {
  render: () => <MultiSelectWrapper label="Small" size="sm" />,
};

export const LargeSize: Story = {
  render: () => <MultiSelectWrapper label="Large" size="lg" />,
};

export const PrimaryVariant: Story = {
  render: () => (
    <MultiSelectWrapper label="Primary Variant" variant="primary" />
  ),
};

export const OutlineVariant: Story = {
  render: () => (
    <MultiSelectWrapper label="Outline Variant" variant="outline" />
  ),
};

export const FullExample: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <MultiSelectCatto
        options={teamOptionsWithDisabled}
        selectedValues={selected}
        onChange={setSelected}
        label="Add Teams to Division"
        placeholder="Search and select teams..."
        searchable
        showSelectAll
        maxSelections={10}
        helperText="Teams already in the tournament are disabled"
        searchPlaceholder="Filter teams..."
      />
    );
  },
};
