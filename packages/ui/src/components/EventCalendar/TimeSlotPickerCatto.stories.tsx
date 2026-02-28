import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TimeSlotPickerCatto from './TimeSlotPickerCatto';
import type { TimeSlot } from './types';

const meta: Meta<typeof TimeSlotPickerCatto> = {
  title: 'Components/EventCalendar/TimeSlotPickerCatto',
  component: TimeSlotPickerCatto,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['midnightEmber', 'sunset', 'ocean', 'forest', 'lavender'],
    },
    columns: {
      control: 'select',
      options: [2, 3, 4],
    },
    slotDuration: {
      control: 'select',
      options: [30, 60, 90],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimeSlotPickerCatto>;

// Sample available slots
const availableSlots: TimeSlot[] = [
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '11:00', end: '12:00' },
  { start: '13:00', end: '14:00' },
  { start: '14:00', end: '15:00' },
  { start: '15:00', end: '16:00' },
  { start: '16:00', end: '17:00' },
  { start: '17:00', end: '18:00' },
];

// Some booked slots
const bookedSlots: TimeSlot[] = [
  { start: '10:00', end: '11:00' },
  { start: '14:00', end: '15:00' },
];

// Interactive wrapper for stories
const InteractiveWrapper = (
  props: React.ComponentProps<typeof TimeSlotPickerCatto>,
) => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>(
    undefined,
  );
  return (
    <TimeSlotPickerCatto
      {...props}
      selectedSlot={selectedSlot}
      onSlotSelect={setSelectedSlot}
    />
  );
};

export const Default: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    availableSlots,
    bookedSlots: [],
    date: new Date(),
    theme: 'midnightEmber',
    columns: 3,
  },
};

export const WithBookedSlots: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    availableSlots,
    bookedSlots,
    date: new Date(),
    theme: 'midnightEmber',
    columns: 3,
  },
};

export const ThreeColumns: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    availableSlots,
    bookedSlots: [],
    date: new Date(),
    theme: 'midnightEmber',
    columns: 3,
  },
};

export const FourColumns: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    availableSlots,
    bookedSlots: [],
    date: new Date(),
    theme: 'midnightEmber',
    columns: 4,
  },
};

export const TwoColumns: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    availableSlots,
    bookedSlots: [],
    date: new Date(),
    theme: 'midnightEmber',
    columns: 2,
  },
};

export const ShowDuration: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    availableSlots,
    bookedSlots: [],
    date: new Date(),
    theme: 'midnightEmber',
    columns: 3,
    showDuration: true,
    slotDuration: 60,
  },
};

export const HalfHourSlots: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    availableSlots: [
      { start: '09:00', end: '09:30' },
      { start: '09:30', end: '10:00' },
      { start: '10:00', end: '10:30' },
      { start: '10:30', end: '11:00' },
      { start: '11:00', end: '11:30' },
      { start: '11:30', end: '12:00' },
    ],
    bookedSlots: [{ start: '10:00', end: '10:30' }],
    date: new Date(),
    theme: 'midnightEmber',
    columns: 3,
    slotDuration: 30,
    showDuration: true,
  },
};

export const SunsetTheme: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    availableSlots,
    bookedSlots,
    date: new Date(),
    theme: 'sunset',
    columns: 3,
  },
};

export const OceanTheme: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    availableSlots,
    bookedSlots,
    date: new Date(),
    theme: 'ocean',
    columns: 3,
  },
};

export const NoAvailableSlots: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    availableSlots: [],
    bookedSlots: [],
    date: new Date(),
    theme: 'midnightEmber',
    columns: 3,
  },
};

export const Loading: Story = {
  args: {
    availableSlots: [],
    bookedSlots: [],
    date: new Date(),
    loading: true,
    theme: 'midnightEmber',
    columns: 3,
    onSlotSelect: () => {},
  },
};

export const PreSelected: Story = {
  args: {
    availableSlots,
    bookedSlots: [],
    selectedSlot: { start: '13:00', end: '14:00' },
    date: new Date(),
    theme: 'midnightEmber',
    columns: 3,
    onSlotSelect: () => {},
  },
};
