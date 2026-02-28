// @catto/ui - PhoneInputCatto Tests
import { describe, expect, it, vi } from 'vitest';
import PhoneInputCatto from '../../components/Phone/PhoneInputCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('PhoneInputCatto', () => {
  describe('rendering', () => {
    it('renders input element', () => {
      render(<PhoneInputCatto />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('has type tel', () => {
      render(<PhoneInputCatto />);

      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'tel');
    });

    it('has inputMode tel', () => {
      render(<PhoneInputCatto />);

      expect(screen.getByRole('textbox')).toHaveAttribute('inputMode', 'tel');
    });

    it('has autoComplete tel', () => {
      render(<PhoneInputCatto />);

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'autoComplete',
        'tel',
      );
    });

    it('renders with placeholder', () => {
      render(<PhoneInputCatto placeholder="Enter phone" />);

      expect(screen.getByPlaceholderText('Enter phone')).toBeInTheDocument();
    });

    it('renders with value', () => {
      render(<PhoneInputCatto value="(555) 123-4567" />);

      expect(screen.getByRole('textbox')).toHaveValue('(555) 123-4567');
    });
  });

  describe('label', () => {
    it('renders label when provided', () => {
      render(<PhoneInputCatto label="Phone Number" />);

      expect(screen.getByText('Phone Number')).toBeInTheDocument();
    });

    it('associates label with input', () => {
      render(<PhoneInputCatto label="Phone" id="phone-input" />);

      const label = screen.getByText('Phone');
      expect(label).toHaveAttribute('for', 'phone-input');
    });

    it('shows required indicator when required', () => {
      render(<PhoneInputCatto label="Phone" required />);

      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('applies top position by default', () => {
      const { container } = render(<PhoneInputCatto label="Phone" />);

      const label = container.querySelector('label');
      expect(label?.className).toContain('mb-1');
    });

    it('applies left position when specified', () => {
      const { container } = render(
        <PhoneInputCatto label="Phone" labelPosition="left" />,
      );

      const label = container.querySelector('label');
      expect(label?.className).toContain('mr-3');
    });
  });

  describe('error state', () => {
    it('shows error message when error is string', () => {
      render(<PhoneInputCatto label="Phone" error="Invalid phone number" />);

      expect(screen.getByRole('alert')).toHaveTextContent(
        'Invalid phone number',
      );
    });

    it('applies error border color', () => {
      render(<PhoneInputCatto error="Error" label="Phone" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('border-red-500');
    });

    it('sets aria-invalid when error', () => {
      render(<PhoneInputCatto error="Error" />);

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    it('sets aria-describedby to error message', () => {
      render(<PhoneInputCatto error="Error" label="Phone" id="phone" />);

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        'phone-error',
      );
    });
  });

  describe('helper text', () => {
    it('shows helper text when provided', () => {
      render(
        <PhoneInputCatto helperText="Enter your mobile number" label="Phone" />,
      );

      expect(screen.getByText('Enter your mobile number')).toBeInTheDocument();
    });

    it('hides helper text when error is shown', () => {
      render(
        <PhoneInputCatto
          helperText="Enter your mobile number"
          error="Invalid"
          label="Phone"
        />,
      );

      expect(
        screen.queryByText('Enter your mobile number'),
      ).not.toBeInTheDocument();
    });

    it('sets aria-describedby to helper text', () => {
      render(<PhoneInputCatto helperText="Helper" label="Phone" id="phone" />);

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        'phone-helper',
      );
    });
  });

  describe('onChange', () => {
    it('calls onChange with raw and formatted values', () => {
      const handleChange = vi.fn();
      render(<PhoneInputCatto onChange={handleChange} />);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '5551234567' },
      });

      expect(handleChange).toHaveBeenCalled();
      // First arg is raw, second is formatted, third is event
      expect(handleChange.mock.calls[0][0]).toBe('5551234567');
    });

    it('calls onChangeNative when provided', () => {
      const handleNativeChange = vi.fn();
      render(<PhoneInputCatto onChangeNative={handleNativeChange} />);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '555' },
      });

      expect(handleNativeChange).toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('sets disabled attribute', () => {
      render(<PhoneInputCatto disabled />);

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('applies disabled styling', () => {
      render(<PhoneInputCatto disabled />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('opacity-50');
      expect(input.className).toContain('cursor-not-allowed');
    });
  });

  describe('sizes', () => {
    it('applies small size styles', () => {
      render(<PhoneInputCatto size="small" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('h-8');
      expect(input.className).toContain('text-sm');
    });

    it('applies medium size styles by default', () => {
      render(<PhoneInputCatto />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('h-10');
      expect(input.className).toContain('text-base');
    });

    it('applies large size styles', () => {
      render(<PhoneInputCatto size="large" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('h-12');
      expect(input.className).toContain('text-lg');
    });
  });

  describe('variants', () => {
    it('applies outlined variant by default', () => {
      render(<PhoneInputCatto />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('border');
      expect(input.className).toContain('rounded-md');
    });

    it('applies filled variant styles', () => {
      render(<PhoneInputCatto variant="filled" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('bg-theme-surface');
    });

    it('applies minimal variant styles', () => {
      render(<PhoneInputCatto variant="minimal" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('bg-transparent');
    });
  });

  describe('width', () => {
    it('applies full width by default', () => {
      render(<PhoneInputCatto />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('w-full');
    });

    it('applies custom width', () => {
      render(<PhoneInputCatto width="w-64" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('w-64');
    });
  });

  describe('disableFormatting', () => {
    it('passes through value without formatting when disabled', () => {
      const handleChange = vi.fn();
      render(<PhoneInputCatto onChange={handleChange} disableFormatting />);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '5551234567' },
      });

      // Raw value should be extracted without formatting
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('custom className', () => {
    it('applies custom className to input', () => {
      render(<PhoneInputCatto className="my-custom-class" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('my-custom-class');
    });

    it('applies wrapperClassName to wrapper', () => {
      const { container } = render(
        <PhoneInputCatto label="Phone" wrapperClassName="my-wrapper-class" />,
      );

      expect(container.querySelector('.my-wrapper-class')).toBeInTheDocument();
    });
  });

  describe('i18n labels', () => {
    it('uses custom placeholder from labels', () => {
      render(
        <PhoneInputCatto labels={{ placeholder: 'Numéro de téléphone' }} />,
      );

      expect(
        screen.getByPlaceholderText('Numéro de téléphone'),
      ).toBeInTheDocument();
    });

    it('explicit placeholder overrides labels', () => {
      render(
        <PhoneInputCatto
          placeholder="Custom placeholder"
          labels={{ placeholder: 'From labels' }}
        />,
      );

      expect(
        screen.getByPlaceholderText('Custom placeholder'),
      ).toBeInTheDocument();
    });
  });
});
