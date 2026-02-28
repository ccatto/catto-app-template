// @catto/ui - CalendarCatto Tests
import { describe, expect, it, vi } from 'vitest';
import CalendarCatto from '../../components/Calendar/CalendarCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('CalendarCatto', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<CalendarCatto />);

      // Should show current month/year
      const today = new Date();
      const monthYear = today.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
      expect(screen.getByText(monthYear)).toBeInTheDocument();
    });

    it('renders day names', () => {
      render(<CalendarCatto />);

      expect(screen.getByText('Sun')).toBeInTheDocument();
      expect(screen.getByText('Mon')).toBeInTheDocument();
      expect(screen.getByText('Tue')).toBeInTheDocument();
      expect(screen.getByText('Wed')).toBeInTheDocument();
      expect(screen.getByText('Thu')).toBeInTheDocument();
      expect(screen.getByText('Fri')).toBeInTheDocument();
      expect(screen.getByText('Sat')).toBeInTheDocument();
    });

    it('renders days of the month', () => {
      render(<CalendarCatto value={new Date(2026, 0, 15)} />);

      // January 2026 has 31 days
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('31')).toBeInTheDocument();
    });

    it('renders navigation buttons', () => {
      render(<CalendarCatto />);

      expect(
        screen.getByRole('button', { name: 'Previous month' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Next month' }),
      ).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('navigates to previous month', () => {
      render(<CalendarCatto value={new Date(2026, 1, 15)} />);

      // Should show February 2026
      expect(screen.getByText('February 2026')).toBeInTheDocument();

      // Click previous month
      fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));

      // Should show January 2026
      expect(screen.getByText('January 2026')).toBeInTheDocument();
    });

    it('navigates to next month', () => {
      render(<CalendarCatto value={new Date(2026, 0, 15)} />);

      // Should show January 2026
      expect(screen.getByText('January 2026')).toBeInTheDocument();

      // Click next month
      fireEvent.click(screen.getByRole('button', { name: 'Next month' }));

      // Should show February 2026
      expect(screen.getByText('February 2026')).toBeInTheDocument();
    });

    it('navigates across years', () => {
      render(<CalendarCatto value={new Date(2026, 0, 15)} />);

      expect(screen.getByText('January 2026')).toBeInTheDocument();

      // Click previous month
      fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));

      // Should show December 2025
      expect(screen.getByText('December 2025')).toBeInTheDocument();
    });
  });

  describe('date selection', () => {
    it('calls onChange when date is clicked', () => {
      const handleChange = vi.fn();
      render(
        <CalendarCatto value={new Date(2026, 0, 15)} onChange={handleChange} />,
      );

      // Click on day 20
      fireEvent.click(screen.getByText('20'));

      expect(handleChange).toHaveBeenCalledTimes(1);
      const selectedDate = handleChange.mock.calls[0][0];
      expect(selectedDate.getDate()).toBe(20);
      expect(selectedDate.getMonth()).toBe(0); // January
      expect(selectedDate.getFullYear()).toBe(2026);
    });

    it('highlights selected date', () => {
      const { container } = render(
        <CalendarCatto value={new Date(2026, 0, 15)} />,
      );

      // The selected date (15) should have orange background
      const day15 = screen.getByText('15');
      expect(day15.className).toContain('bg-orange-500');
    });
  });

  describe('date constraints', () => {
    it('disables dates before minDate', () => {
      const handleChange = vi.fn();
      render(
        <CalendarCatto
          value={new Date(2026, 0, 15)}
          onChange={handleChange}
          minDate={new Date(2026, 0, 10)}
        />,
      );

      // Click on day 5 (before minDate)
      fireEvent.click(screen.getByText('5'));

      // onChange should not be called
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('disables dates after maxDate', () => {
      const handleChange = vi.fn();
      render(
        <CalendarCatto
          value={new Date(2026, 0, 15)}
          onChange={handleChange}
          maxDate={new Date(2026, 0, 20)}
        />,
      );

      // Click on day 25 (after maxDate)
      fireEvent.click(screen.getByText('25'));

      // onChange should not be called
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('allows dates within range', () => {
      const handleChange = vi.fn();
      render(
        <CalendarCatto
          value={new Date(2026, 0, 15)}
          onChange={handleChange}
          minDate={new Date(2026, 0, 10)}
          maxDate={new Date(2026, 0, 20)}
        />,
      );

      // Click on day 18 (within range)
      fireEvent.click(screen.getByText('18'));

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('applies disabled styling to constrained dates', () => {
      const { container } = render(
        <CalendarCatto
          value={new Date(2026, 0, 15)}
          minDate={new Date(2026, 0, 10)}
        />,
      );

      // Day 5 should have disabled styling
      const day5 = screen.getByText('5');
      expect(day5.className).toContain('opacity-40');
      expect(day5.className).toContain('cursor-not-allowed');
    });
  });

  describe('themes', () => {
    it('applies midnightEmber theme by default', () => {
      const { container } = render(<CalendarCatto />);

      const calendar = container.firstChild as HTMLElement;
      expect(calendar.className).toContain('bg-slate-800');
    });

    it('applies sunset theme', () => {
      const { container } = render(<CalendarCatto theme="sunset" />);

      const calendar = container.firstChild as HTMLElement;
      expect(calendar.className).toContain('bg-amber-50');
    });

    it('applies ocean theme', () => {
      const { container } = render(<CalendarCatto theme="ocean" />);

      const calendar = container.firstChild as HTMLElement;
      expect(calendar.className).toContain('bg-blue-50');
    });

    it('applies forest theme', () => {
      const { container } = render(<CalendarCatto theme="forest" />);

      const calendar = container.firstChild as HTMLElement;
      expect(calendar.className).toContain('bg-green-50');
    });

    it('applies lavender theme', () => {
      const { container } = render(<CalendarCatto theme="lavender" />);

      const calendar = container.firstChild as HTMLElement;
      expect(calendar.className).toContain('bg-slate-50');
    });
  });

  describe('sizes', () => {
    it('applies small size', () => {
      const { container } = render(<CalendarCatto size="small" />);

      const calendar = container.firstChild as HTMLElement;
      expect(calendar.className).toContain('w-64');
    });

    it('applies medium size by default', () => {
      const { container } = render(<CalendarCatto />);

      const calendar = container.firstChild as HTMLElement;
      expect(calendar.className).toContain('w-80');
    });

    it('applies large size', () => {
      const { container } = render(<CalendarCatto size="large" />);

      const calendar = container.firstChild as HTMLElement;
      expect(calendar.className).toContain('w-96');
    });
  });

  describe('variants', () => {
    it('applies outlined variant by default', () => {
      const { container } = render(<CalendarCatto />);

      const calendar = container.firstChild as HTMLElement;
      expect(calendar.className).toContain('border');
      expect(calendar.className).toContain('rounded-lg');
    });

    it('applies filled variant', () => {
      const { container } = render(<CalendarCatto variant="filled" />);

      const calendar = container.firstChild as HTMLElement;
      expect(calendar.className).toContain('shadow-md');
    });

    it('applies minimal variant', () => {
      const { container } = render(<CalendarCatto variant="minimal" />);

      const calendar = container.firstChild as HTMLElement;
      expect(calendar.className).toContain('border-0');
    });
  });

  describe('custom className', () => {
    it('merges custom className', () => {
      const { container } = render(
        <CalendarCatto className="my-custom-class" />,
      );

      const calendar = container.firstChild as HTMLElement;
      expect(calendar.className).toContain('my-custom-class');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to container div', () => {
      const ref = { current: null };
      render(<CalendarCatto ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
