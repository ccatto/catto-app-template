// @catto/ui - DatePickerCatto Unit Tests
import { describe, expect, it, vi } from 'vitest';
import DatePickerCatto from '../../components/DatePicker/DatePickerCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('DatePickerCatto', () => {
  describe('Rendering', () => {
    it('renders with default placeholder', () => {
      render(<DatePickerCatto />);
      expect(screen.getByText('Select a date')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      render(<DatePickerCatto placeholder="Choose a date" />);
      expect(screen.getByText('Choose a date')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<DatePickerCatto label="Start Date" />);
      expect(screen.getByText('Start Date')).toBeInTheDocument();
    });

    it('renders required indicator with label', () => {
      render(<DatePickerCatto label="Start Date" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders selected date value', () => {
      const date = new Date(2026, 0, 15); // Jan 15, 2026
      render(<DatePickerCatto value={date} />);
      // Should display formatted date (format may vary by locale)
      expect(screen.queryByText('Select a date')).not.toBeInTheDocument();
    });

    it('renders with error message', () => {
      render(<DatePickerCatto error="Date is required" />);
      expect(screen.getByText('Date is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders with helper text', () => {
      render(<DatePickerCatto helperText="Choose your preferred date" />);
      expect(
        screen.getByText('Choose your preferred date'),
      ).toBeInTheDocument();
    });

    it('hides helper text when error is shown', () => {
      render(
        <DatePickerCatto
          helperText="Choose your preferred date"
          error="Date is required"
        />,
      );
      expect(screen.getByText('Date is required')).toBeInTheDocument();
      expect(
        screen.queryByText('Choose your preferred date'),
      ).not.toBeInTheDocument();
    });

    it('renders disabled state', () => {
      render(<DatePickerCatto disabled />);
      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveAttribute('tabindex', '-1');
      expect(combobox).toHaveClass('opacity-50');
    });
  });

  describe('Sizes', () => {
    it('renders small size', () => {
      render(<DatePickerCatto size="small" />);
      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveClass('h-8');
    });

    it('renders medium size (default)', () => {
      render(<DatePickerCatto />);
      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveClass('h-10');
    });

    it('renders large size', () => {
      render(<DatePickerCatto size="large" />);
      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveClass('h-12');
    });
  });

  describe('Variants', () => {
    it('renders outlined variant (default)', () => {
      render(<DatePickerCatto />);
      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveClass('border');
      expect(combobox).toHaveClass('bg-theme-surface');
    });

    it('renders filled variant', () => {
      render(<DatePickerCatto variant="filled" />);
      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveClass('border-b-2');
      expect(combobox).toHaveClass('bg-theme-surface-secondary');
    });

    it('renders minimal variant', () => {
      render(<DatePickerCatto variant="minimal" />);
      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveClass('bg-transparent');
    });
  });

  describe('Width', () => {
    it('renders full width (default)', () => {
      const { container } = render(<DatePickerCatto />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('w-full');
    });

    it('renders auto width', () => {
      const { container } = render(<DatePickerCatto width="auto" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('w-auto');
    });

    it('renders md width', () => {
      const { container } = render(<DatePickerCatto width="md" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('w-48');
    });
  });

  describe('Calendar Popup', () => {
    it('opens calendar on click', () => {
      render(<DatePickerCatto />);
      const combobox = screen.getByRole('combobox');

      fireEvent.click(combobox);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('opens calendar on Enter key', () => {
      render(<DatePickerCatto />);
      const combobox = screen.getByRole('combobox');

      fireEvent.keyDown(combobox, { key: 'Enter' });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('opens calendar on Space key', () => {
      render(<DatePickerCatto />);
      const combobox = screen.getByRole('combobox');

      fireEvent.keyDown(combobox, { key: ' ' });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('does not open when disabled', () => {
      render(<DatePickerCatto disabled />);
      const combobox = screen.getByRole('combobox');

      fireEvent.click(combobox);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes calendar on Escape key', () => {
      render(<DatePickerCatto />);
      const combobox = screen.getByRole('combobox');

      fireEvent.click(combobox);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes calendar on click outside', () => {
      render(
        <div>
          <DatePickerCatto />
          <button>Outside</button>
        </div>,
      );
      const combobox = screen.getByRole('combobox');

      fireEvent.click(combobox);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      fireEvent.mouseDown(screen.getByText('Outside'));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Date Selection', () => {
    it('calls onChange when date is selected', () => {
      const handleChange = vi.fn();
      render(<DatePickerCatto onChange={handleChange} />);
      const combobox = screen.getByRole('combobox');

      fireEvent.click(combobox);

      // Find a day to click (assuming CalendarCatto renders day numbers)
      const day15 = screen.getByText('15');
      fireEvent.click(day15);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(expect.any(Date));
    });

    it('closes calendar after date selection', () => {
      render(<DatePickerCatto />);
      const combobox = screen.getByRole('combobox');

      fireEvent.click(combobox);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      const day15 = screen.getByText('15');
      fireEvent.click(day15);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Clear Functionality', () => {
    it('shows clear button when value is set', () => {
      render(<DatePickerCatto value={new Date()} clearable />);
      expect(screen.getByLabelText('Clear date')).toBeInTheDocument();
    });

    it('hides clear button when no value', () => {
      render(<DatePickerCatto clearable />);
      expect(screen.queryByLabelText('Clear date')).not.toBeInTheDocument();
    });

    it('hides clear button when disabled', () => {
      render(<DatePickerCatto value={new Date()} clearable disabled />);
      expect(screen.queryByLabelText('Clear date')).not.toBeInTheDocument();
    });

    it('hides clear button when clearable is false', () => {
      render(<DatePickerCatto value={new Date()} clearable={false} />);
      expect(screen.queryByLabelText('Clear date')).not.toBeInTheDocument();
    });

    it('calls onChange with null when cleared', () => {
      const handleChange = vi.fn();
      render(
        <DatePickerCatto
          value={new Date()}
          onChange={handleChange}
          clearable
        />,
      );

      fireEvent.click(screen.getByLabelText('Clear date'));

      expect(handleChange).toHaveBeenCalledWith(null);
    });
  });

  describe('Date Constraints', () => {
    it('passes minDate to CalendarCatto', () => {
      const minDate = new Date(2026, 0, 1);
      render(<DatePickerCatto minDate={minDate} />);

      fireEvent.click(screen.getByRole('combobox'));

      // Calendar should be open and contain the min date constraint
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('passes maxDate to CalendarCatto', () => {
      const maxDate = new Date(2026, 11, 31);
      render(<DatePickerCatto maxDate={maxDate} />);

      fireEvent.click(screen.getByRole('combobox'));

      // Calendar should be open and contain the max date constraint
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has combobox role', () => {
      render(<DatePickerCatto />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('has aria-expanded attribute', () => {
      render(<DatePickerCatto />);
      const combobox = screen.getByRole('combobox');

      expect(combobox).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(combobox);
      expect(combobox).toHaveAttribute('aria-expanded', 'true');
    });

    it('has aria-haspopup attribute', () => {
      render(<DatePickerCatto />);
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-haspopup',
        'dialog',
      );
    });

    it('has aria-label from label prop', () => {
      render(<DatePickerCatto label="Event Date" />);
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-label',
        'Event Date',
      );
    });

    it('has aria-label from placeholder when no label', () => {
      render(<DatePickerCatto placeholder="Choose date" />);
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-label',
        'Choose date',
      );
    });

    it('calendar button has accessible label', () => {
      render(<DatePickerCatto />);
      expect(screen.getByLabelText('Open calendar')).toBeInTheDocument();
    });

    it('dialog has aria-modal attribute', () => {
      render(<DatePickerCatto />);
      fireEvent.click(screen.getByRole('combobox'));

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });
  });

  describe('i18n Labels', () => {
    it('uses custom placeholder label', () => {
      render(
        <DatePickerCatto labels={{ placeholder: 'Seleccione una fecha' }} />,
      );
      expect(screen.getByText('Seleccione una fecha')).toBeInTheDocument();
    });

    it('uses custom clear button label', () => {
      render(
        <DatePickerCatto
          value={new Date()}
          labels={{ clearButton: 'Limpiar fecha' }}
        />,
      );
      expect(screen.getByLabelText('Limpiar fecha')).toBeInTheDocument();
    });

    it('uses custom calendar button label', () => {
      render(
        <DatePickerCatto labels={{ calendarButton: 'Abrir calendario' }} />,
      );
      expect(screen.getByLabelText('Abrir calendario')).toBeInTheDocument();
    });
  });

  describe('Calendar Icon Button', () => {
    it('opens calendar on icon button click', () => {
      render(<DatePickerCatto />);

      fireEvent.click(screen.getByLabelText('Open calendar'));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('toggles calendar on repeated icon clicks', () => {
      render(<DatePickerCatto />);
      const button = screen.getByLabelText('Open calendar');

      fireEvent.click(button);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Form Integration', () => {
    it('renders hidden input with name attribute', () => {
      const { container } = render(<DatePickerCatto name="eventDate" />);
      const hiddenInput = container.querySelector('input[type="hidden"]');

      expect(hiddenInput).toHaveAttribute('name', 'eventDate');
    });

    it('hidden input contains ISO date string when value is set', () => {
      const date = new Date(2026, 0, 15);
      const { container } = render(
        <DatePickerCatto value={date} name="eventDate" />,
      );
      const hiddenInput = container.querySelector('input[type="hidden"]');

      expect(hiddenInput).toHaveAttribute('value', date.toISOString());
    });

    it('hidden input is empty when no value', () => {
      const { container } = render(<DatePickerCatto name="eventDate" />);
      const hiddenInput = container.querySelector('input[type="hidden"]');

      expect(hiddenInput).toHaveAttribute('value', '');
    });

    it('hidden input has aria-invalid when error', () => {
      const { container } = render(<DatePickerCatto error="Required" />);
      const hiddenInput = container.querySelector('input[type="hidden"]');

      expect(hiddenInput).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
