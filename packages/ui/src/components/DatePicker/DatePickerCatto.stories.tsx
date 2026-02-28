// @catto/ui - DatePickerCatto Stories
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DatePickerCatto from './DatePickerCatto';

const meta = {
  title: 'Components/DatePickerCatto',
  component: DatePickerCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: 'date',
      description: 'Selected date value',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'minimal'],
    },
    width: {
      control: 'select',
      options: ['auto', 'full', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    calendarTheme: {
      control: 'select',
      options: ['midnightEmber', 'sunset', 'ocean', 'forest', 'lavender'],
    },
  },
} satisfies Meta<typeof DatePickerCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper for controlled state
const DatePickerWrapper = (
  props: React.ComponentProps<typeof DatePickerCatto>,
) => {
  const [date, setDate] = useState<Date | null>(props.value || null);
  return (
    <div className="w-72">
      <DatePickerCatto {...props} value={date} onChange={setDate} />
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        Selected: {date ? date.toLocaleDateString() : 'None'}
      </p>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    placeholder: 'Select a date',
  },
};

export const WithLabel: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Event Date',
    placeholder: 'Choose date',
  },
};

export const WithLabelRequired: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Start Date',
    required: true,
  },
};

export const WithError: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Tournament Date',
    error: 'Please select a valid date',
  },
};

export const WithHelperText: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Registration Deadline',
    helperText: 'Select the last day for team registration',
  },
};

export const WithMinMaxDates: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Date (Next 30 days only)',
    minDate: new Date(),
    maxDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    helperText: 'Only dates within the next 30 days are selectable',
  },
};

export const WithPreselectedDate: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Tournament Start',
    value: new Date(2026, 2, 15), // March 15, 2026
  },
};

export const Small: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Date (Small)',
    size: 'small',
  },
};

export const Medium: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Date (Medium)',
    size: 'medium',
  },
};

export const Large: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Date (Large)',
    size: 'large',
  },
};

export const VariantOutlined: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Outlined Variant',
    variant: 'outlined',
  },
};

export const VariantFilled: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Filled Variant',
    variant: 'filled',
  },
};

export const VariantMinimal: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Minimal Variant',
    variant: 'minimal',
  },
};

export const Disabled: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Disabled Date Picker',
    disabled: true,
    value: new Date(),
  },
};

export const NotClearable: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Cannot be cleared',
    clearable: false,
    value: new Date(),
  },
};

export const CalendarThemeSunset: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Sunset Theme Calendar',
    calendarTheme: 'sunset',
  },
};

export const CalendarThemeOcean: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Ocean Theme Calendar',
    calendarTheme: 'ocean',
  },
};

export const CalendarThemeForest: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Forest Theme Calendar',
    calendarTheme: 'forest',
  },
};

export const CalendarThemeLavender: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Lavender Theme Calendar',
    calendarTheme: 'lavender',
  },
};

export const CustomI18nLabels: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    label: 'Fecha del Evento',
    labels: {
      placeholder: 'Seleccione una fecha',
      clearButton: 'Limpiar',
      calendarButton: 'Abrir calendario',
    },
  },
};

export const WidthVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <DatePickerWrapper label="Auto Width" width="auto" />
      <DatePickerWrapper label="Small Width" width="sm" />
      <DatePickerWrapper label="Medium Width" width="md" />
      <DatePickerWrapper label="Large Width" width="lg" />
    </div>
  ),
};

export const AllSizesComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <DatePickerWrapper label="Small" size="small" />
      <DatePickerWrapper label="Medium (Default)" size="medium" />
      <DatePickerWrapper label="Large" size="large" />
    </div>
  ),
};

export const AllVariantsComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <DatePickerWrapper label="Outlined (Default)" variant="outlined" />
      <DatePickerWrapper label="Filled" variant="filled" />
      <DatePickerWrapper label="Minimal" variant="minimal" />
    </div>
  ),
};
