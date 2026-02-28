// @catto/ui - CalendarCatto Stories
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CalendarCatto from './CalendarCatto';

const meta = {
  title: 'Components/CalendarCatto',
  component: CalendarCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    theme: {
      control: 'select',
      options: ['midnightEmber', 'sunset', 'ocean', 'forest', 'lavender'],
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'minimal'],
    },
  },
} satisfies Meta<typeof CalendarCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper
const CalendarWrapper = (props: React.ComponentProps<typeof CalendarCatto>) => {
  const [date, setDate] = useState<Date>(props.value || new Date());

  return (
    <div className="flex flex-col items-center gap-4">
      <CalendarCatto
        {...props}
        value={date}
        onChange={(newDate) => {
          setDate(newDate);
          props.onChange?.(newDate);
        }}
      />
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Selected: {date.toLocaleDateString()}
      </p>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <CalendarWrapper {...args} />,
  args: {
    onChange: (date) => console.log('Selected:', date),
  },
};

export const MidnightEmberTheme: Story = {
  render: (args) => <CalendarWrapper {...args} />,
  args: {
    theme: 'midnightEmber',
    onChange: (date) => console.log('Selected:', date),
  },
};

export const SunsetTheme: Story = {
  render: (args) => <CalendarWrapper {...args} />,
  args: {
    theme: 'sunset',
    onChange: (date) => console.log('Selected:', date),
  },
};

export const OceanTheme: Story = {
  render: (args) => <CalendarWrapper {...args} />,
  args: {
    theme: 'ocean',
    onChange: (date) => console.log('Selected:', date),
  },
};

export const ForestTheme: Story = {
  render: (args) => <CalendarWrapper {...args} />,
  args: {
    theme: 'forest',
    onChange: (date) => console.log('Selected:', date),
  },
};

export const LavenderTheme: Story = {
  render: (args) => <CalendarWrapper {...args} />,
  args: {
    theme: 'lavender',
    onChange: (date) => console.log('Selected:', date),
  },
};

export const SmallSize: Story = {
  render: (args) => <CalendarWrapper {...args} />,
  args: {
    size: 'small',
    onChange: (date) => console.log('Selected:', date),
  },
};

export const LargeSize: Story = {
  render: (args) => <CalendarWrapper {...args} />,
  args: {
    size: 'large',
    onChange: (date) => console.log('Selected:', date),
  },
};

export const FilledVariant: Story = {
  render: (args) => <CalendarWrapper {...args} />,
  args: {
    variant: 'filled',
    onChange: (date) => console.log('Selected:', date),
  },
};

export const MinimalVariant: Story = {
  render: (args) => <CalendarWrapper {...args} />,
  args: {
    variant: 'minimal',
    onChange: (date) => console.log('Selected:', date),
  },
};

export const WithMinDate: Story = {
  render: (args) => <CalendarWrapper {...args} />,
  args: {
    minDate: new Date(),
    onChange: (date) => console.log('Selected:', date),
  },
};

export const WithMaxDate: Story = {
  render: (args) => <CalendarWrapper {...args} />,
  args: {
    maxDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    onChange: (date) => console.log('Selected:', date),
  },
};

export const WithDateRange: Story = {
  render: (args) => <CalendarWrapper {...args} />,
  args: {
    minDate: new Date(),
    maxDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    onChange: (date) => console.log('Selected:', date),
  },
};

export const AllThemes: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          Midnight Ember
        </p>
        <CalendarCatto theme="midnightEmber" size="small" />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          Sunset
        </p>
        <CalendarCatto theme="sunset" size="small" />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Ocean</p>
        <CalendarCatto theme="ocean" size="small" />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          Forest
        </p>
        <CalendarCatto theme="forest" size="small" />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          Lavender
        </p>
        <CalendarCatto theme="lavender" size="small" />
      </div>
    </div>
  ),
};
