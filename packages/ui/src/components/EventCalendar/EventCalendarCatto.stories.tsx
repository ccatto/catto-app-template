import type { Meta, StoryObj } from '@storybook/react';
import EventCalendarCatto from './EventCalendarCatto';
import type { CalendarEventItem } from './types';

const meta: Meta<typeof EventCalendarCatto> = {
  title: 'Components/EventCalendar/EventCalendarCatto',
  component: EventCalendarCatto,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['midnightEmber', 'sunset', 'ocean', 'forest', 'lavender'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    view: {
      control: 'select',
      options: ['month', 'week', 'day'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof EventCalendarCatto>;

// Sample events for demo
const today = new Date();
const sampleEvents: CalendarEventItem[] = [
  {
    id: '1',
    title: 'Spring Tournament',
    startTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      15,
      9,
      0,
    ).toISOString(),
    endTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      15,
      17,
      0,
    ).toISOString(),
    color: 'orange',
    type: 'tournament',
  },
  {
    id: '2',
    title: 'League Game: Hawks vs Eagles',
    startTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      18,
      19,
      0,
    ).toISOString(),
    endTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      18,
      21,
      0,
    ).toISOString(),
    color: 'blue',
    type: 'league',
  },
  {
    id: '3',
    title: 'Beginner Clinic',
    startTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      20,
      10,
      0,
    ).toISOString(),
    endTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      20,
      12,
      0,
    ).toISOString(),
    color: 'green',
    type: 'clinic',
  },
  {
    id: '4',
    title: 'Private Lesson',
    startTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      14,
      0,
    ).toISOString(),
    endTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      15,
      0,
    ).toISOString(),
    color: 'blue',
    type: 'lesson',
  },
  {
    id: '5',
    title: 'Open Play Session',
    startTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      22,
      18,
      0,
    ).toISOString(),
    endTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      22,
      20,
      0,
    ).toISOString(),
    color: 'green',
    type: 'openplay',
  },
  {
    id: '6',
    title: 'Team Meeting',
    startTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      25,
      19,
      0,
    ).toISOString(),
    color: 'gray',
    type: 'event',
  },
];

export const Default: Story = {
  args: {
    events: sampleEvents,
    theme: 'midnightEmber',
    size: 'medium',
    showTodayButton: true,
    showViewSwitcher: false,
  },
};

export const WithViewSwitcher: Story = {
  args: {
    events: sampleEvents,
    theme: 'midnightEmber',
    size: 'medium',
    showTodayButton: true,
    showViewSwitcher: true,
    view: 'month',
  },
};

export const SmallSize: Story = {
  args: {
    events: sampleEvents,
    theme: 'midnightEmber',
    size: 'small',
    showTodayButton: true,
  },
};

export const LargeSize: Story = {
  args: {
    events: sampleEvents,
    theme: 'midnightEmber',
    size: 'large',
    showTodayButton: true,
  },
};

export const SunsetTheme: Story = {
  args: {
    events: sampleEvents,
    theme: 'sunset',
    size: 'medium',
  },
};

export const OceanTheme: Story = {
  args: {
    events: sampleEvents,
    theme: 'ocean',
    size: 'medium',
  },
};

export const ForestTheme: Story = {
  args: {
    events: sampleEvents,
    theme: 'forest',
    size: 'medium',
  },
};

export const LavenderTheme: Story = {
  args: {
    events: sampleEvents,
    theme: 'lavender',
    size: 'medium',
  },
};

export const NoEvents: Story = {
  args: {
    events: [],
    theme: 'midnightEmber',
    size: 'medium',
  },
};

export const Loading: Story = {
  args: {
    events: [],
    loading: true,
    theme: 'midnightEmber',
    size: 'medium',
  },
};

export const ManyEventsPerDay: Story = {
  args: {
    events: [
      ...sampleEvents,
      {
        id: '7',
        title: 'Morning Practice',
        startTime: new Date(
          today.getFullYear(),
          today.getMonth(),
          15,
          7,
          0,
        ).toISOString(),
        color: 'blue',
        type: 'event',
      },
      {
        id: '8',
        title: 'Lunch Meeting',
        startTime: new Date(
          today.getFullYear(),
          today.getMonth(),
          15,
          12,
          0,
        ).toISOString(),
        color: 'gray',
        type: 'event',
      },
      {
        id: '9',
        title: 'Evening Session',
        startTime: new Date(
          today.getFullYear(),
          today.getMonth(),
          15,
          19,
          0,
        ).toISOString(),
        color: 'green',
        type: 'openplay',
      },
      {
        id: '10',
        title: 'Late Night Event',
        startTime: new Date(
          today.getFullYear(),
          today.getMonth(),
          15,
          21,
          0,
        ).toISOString(),
        color: 'red',
        type: 'event',
      },
    ],
    theme: 'midnightEmber',
    size: 'medium',
    maxEventsPerDay: 3,
  },
};
