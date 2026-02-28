import type { Meta, StoryObj } from '@storybook/react';
import type { CalendarEvent } from '../../utils/calendar-utils';
import AddToCalendarCatto from './AddToCalendarCatto';

const sampleEvent: CalendarEvent = {
  id: 'story-event-1',
  title: 'Team Practice',
  description: 'Weekly team practice session. Bring water and equipment.',
  location: 'City Sports Complex, Court 3',
  startTime: '2026-03-15T14:00:00Z',
  endTime: '2026-03-15T16:00:00Z',
};

const meta = {
  title: 'Components/AddToCalendarCatto',
  component: AddToCalendarCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A dropdown button for exporting events to calendar applications. Supports downloading .ics files (Apple Calendar, Outlook) and opening Google Calendar.',
      },
    },
  },
  argTypes: {
    event: {
      description: 'Calendar event data',
      control: 'object',
    },
    compact: {
      description: 'Show icon-only button (no text)',
      control: 'boolean',
    },
    disabled: {
      description: 'Disable the button',
      control: 'boolean',
    },
    labels: {
      description: 'i18n labels for button and menu text',
      control: 'object',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
} satisfies Meta<typeof AddToCalendarCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    event: sampleEvent,
  },
};

export const Compact: Story = {
  args: {
    event: sampleEvent,
    compact: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Icon-only mode, ideal for dashboard cards or tight spaces.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    event: sampleEvent,
    disabled: true,
  },
};

export const CustomLabels: Story = {
  args: {
    event: sampleEvent,
    labels: {
      buttonText: 'Agregar al Calendario',
      buttonTooltip: 'Exportar evento',
      downloadTitle: 'Descargar .ics',
      downloadDescription: 'Apple Calendar, Outlook',
      googleTitle: 'Google Calendar',
      googleDescription: 'Abre en nueva pestaña',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'With Spanish translations using the labels prop.',
      },
    },
  },
};

export const MinimalEvent: Story = {
  args: {
    event: {
      id: 'minimal-1',
      title: 'Quick Meeting',
      startTime: '2026-03-15T10:00:00Z',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Event with only required fields (id, title, startTime). End time defaults to +2 hours.',
      },
    },
  },
};

export const InCard: Story = {
  render: (args) => (
    <div className="rounded-lg border border-gray-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Team Practice
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            March 15, 2026 at 2:00 PM
          </p>
        </div>
        <AddToCalendarCatto {...args} compact />
      </div>
    </div>
  ),
  args: {
    event: sampleEvent,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact mode used inside a card layout.',
      },
    },
  },
};

export const WithLongTitle: Story = {
  args: {
    event: {
      id: 'long-title-1',
      title: "Annual Championship Tournament Finals - Division A Men's Singles",
      description:
        'The grand finals of the annual championship. Spectators welcome!',
      location: 'National Sports Arena, Main Court',
      startTime: '2026-06-20T18:00:00Z',
      endTime: '2026-06-20T21:00:00Z',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Event with a long title - filename will be sanitized.',
      },
    },
  },
};
