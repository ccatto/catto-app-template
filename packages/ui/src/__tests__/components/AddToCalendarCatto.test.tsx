import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AddToCalendarCatto from '../../components/AddToCalendar/AddToCalendarCatto';
import type { CalendarEvent } from '../../utils/calendar-utils';

// Mock window.open
const mockOpen = vi.fn();
Object.defineProperty(window, 'open', { value: mockOpen, writable: true });

// Mock URL.createObjectURL and revokeObjectURL
const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
const mockRevokeObjectURL = vi.fn();
Object.defineProperty(URL, 'createObjectURL', { value: mockCreateObjectURL });
Object.defineProperty(URL, 'revokeObjectURL', { value: mockRevokeObjectURL });

// Sample event for testing
const sampleEvent: CalendarEvent = {
  id: 'test-event-123',
  title: 'Team Practice',
  description: 'Weekly team practice session',
  location: 'City Sports Complex',
  startTime: '2026-03-15T14:00:00Z',
  endTime: '2026-03-15T16:00:00Z',
};

describe('AddToCalendarCatto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      render(<AddToCalendarCatto event={sampleEvent} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Calendar')).toBeInTheDocument();
    });

    it('renders in compact mode (icon only)', () => {
      render(<AddToCalendarCatto event={sampleEvent} compact />);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.queryByText('Calendar')).not.toBeInTheDocument();
    });

    it('renders with custom labels', () => {
      render(
        <AddToCalendarCatto
          event={sampleEvent}
          labels={{ buttonText: 'Add Event' }}
        />,
      );

      expect(screen.getByText('Add Event')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <AddToCalendarCatto event={sampleEvent} className="custom-class" />,
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders disabled state', () => {
      render(<AddToCalendarCatto event={sampleEvent} disabled />);

      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('dropdown behavior', () => {
    it('opens dropdown on button click', () => {
      render(<AddToCalendarCatto event={sampleEvent} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByText('Download .ics')).toBeInTheDocument();
      expect(screen.getByText('Google Calendar')).toBeInTheDocument();
    });

    it('closes dropdown on second button click', () => {
      render(<AddToCalendarCatto event={sampleEvent} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('closes dropdown on click outside', () => {
      render(
        <div>
          <AddToCalendarCatto event={sampleEvent} />
          <div data-testid="outside">Outside</div>
        </div>,
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('closes dropdown on Escape key', () => {
      render(<AddToCalendarCatto event={sampleEvent} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('shows dropdown when button is clicked', () => {
      render(<AddToCalendarCatto event={sampleEvent} />);

      const button = screen.getByRole('button');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  describe('download ICS', () => {
    it('shows download option with correct text', () => {
      render(<AddToCalendarCatto event={sampleEvent} />);

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByText('Download .ics')).toBeInTheDocument();
      expect(screen.getByText('Apple Calendar, Outlook')).toBeInTheDocument();
    });

    it('download option is clickable', () => {
      render(<AddToCalendarCatto event={sampleEvent} />);

      fireEvent.click(screen.getByRole('button'));

      const downloadButton = screen
        .getByText('Download .ics')
        .closest('button');
      expect(downloadButton).toBeInTheDocument();
      expect(downloadButton).toHaveAttribute('role', 'menuitem');
    });
  });

  describe('Google Calendar', () => {
    it('opens Google Calendar URL in new tab', () => {
      render(<AddToCalendarCatto event={sampleEvent} />);

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Google Calendar'));

      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('calendar.google.com/calendar/render'),
        '_blank',
        'noopener',
      );
    });

    it('includes event details in Google Calendar URL', () => {
      render(<AddToCalendarCatto event={sampleEvent} />);

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Google Calendar'));

      const urlArg = mockOpen.mock.calls[0][0];
      expect(urlArg).toContain('text=Team+Practice');
      expect(urlArg).toContain('location=City+Sports+Complex');
      expect(urlArg).toContain('details=Weekly+team+practice+session');
    });

    it('closes dropdown after opening Google Calendar', () => {
      render(<AddToCalendarCatto event={sampleEvent} />);

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Google Calendar'));

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('custom labels', () => {
    it('applies all custom labels', () => {
      const customLabels = {
        buttonText: 'Agregar',
        downloadTitle: 'Descargar .ics',
        downloadDescription: 'Apple Calendar, Outlook',
        googleTitle: 'Google Calendar',
        googleDescription: 'Abre en nueva pestaña',
      };

      render(<AddToCalendarCatto event={sampleEvent} labels={customLabels} />);

      expect(screen.getByText('Agregar')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByText('Descargar .ics')).toBeInTheDocument();
      expect(screen.getByText('Abre en nueva pestaña')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has accessible button with calendar icon', () => {
      render(<AddToCalendarCatto event={sampleEvent} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      // Button should contain the text "Calendar" in non-compact mode
      expect(screen.getByText('Calendar')).toBeInTheDocument();
    });

    it('menu items have menuitem role', () => {
      render(<AddToCalendarCatto event={sampleEvent} />);

      fireEvent.click(screen.getByRole('button'));

      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems).toHaveLength(2);
    });

    it('menu has proper aria-label', () => {
      render(<AddToCalendarCatto event={sampleEvent} />);

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('menu')).toHaveAttribute(
        'aria-label',
        'Add to calendar',
      );
    });

    it('applies custom aria-label to menu', () => {
      render(
        <AddToCalendarCatto
          event={sampleEvent}
          labels={{ buttonTooltip: 'Export event' }}
        />,
      );

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('menu')).toHaveAttribute(
        'aria-label',
        'Export event',
      );
    });
  });

  describe('event without optional fields', () => {
    it('handles event without description', () => {
      const minimalEvent: CalendarEvent = {
        id: 'minimal',
        title: 'Quick Meeting',
        startTime: '2026-03-15T10:00:00Z',
      };

      render(<AddToCalendarCatto event={minimalEvent} />);

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Google Calendar'));

      const urlArg = mockOpen.mock.calls[0][0];
      expect(urlArg).toContain('text=Quick+Meeting');
      expect(urlArg).not.toContain('details=');
      expect(urlArg).not.toContain('location=');
    });

    it('handles event without endTime (defaults to +2 hours)', () => {
      const noEndEvent: CalendarEvent = {
        id: 'no-end',
        title: 'Open Ended',
        startTime: '2026-03-15T10:00:00Z',
      };

      render(<AddToCalendarCatto event={noEndEvent} />);

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Google Calendar'));

      const urlArg = mockOpen.mock.calls[0][0];
      // Start: 20260315T100000Z, End should be 20260315T120000Z (2 hours later)
      expect(urlArg).toContain('dates=20260315T100000Z%2F20260315T120000Z');
    });
  });

  describe('forwardRef', () => {
    it('forwards ref to container div', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<AddToCalendarCatto event={sampleEvent} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('works with callback ref', () => {
      let element: HTMLDivElement | null = null;
      const callbackRef = (node: HTMLDivElement | null) => {
        element = node;
      };

      render(<AddToCalendarCatto event={sampleEvent} ref={callbackRef} />);

      expect(element).toBeInstanceOf(HTMLDivElement);
    });
  });
});
