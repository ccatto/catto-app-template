// @catto/ui - InputCatto Tests
import { describe, expect, it, vi } from 'vitest';
import InputCatto from '../../components/Input/InputCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('InputCatto', () => {
  describe('rendering', () => {
    it('renders with placeholder', () => {
      render(<InputCatto placeholder="Enter text" />);

      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with default value', () => {
      render(<InputCatto value="Test value" placeholder="Enter text" />);

      expect(screen.getByDisplayValue('Test value')).toBeInTheDocument();
    });

    it('renders as textbox role', () => {
      render(<InputCatto placeholder="Enter text" />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('label', () => {
    it('renders label when provided', () => {
      render(<InputCatto label="Email" placeholder="Enter email" />);

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('shows required indicator when required', () => {
      render(<InputCatto label="Email" required placeholder="Enter email" />);

      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('does not show required indicator when not required', () => {
      render(<InputCatto label="Email" placeholder="Enter email" />);

      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('renders with label position top by default', () => {
      const { container } = render(
        <InputCatto label="Name" placeholder="Enter name" />,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('flex-col');
    });

    it('renders with label position left when specified', () => {
      const { container } = render(
        <InputCatto
          label="Name"
          labelPosition="left"
          placeholder="Enter name"
        />,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('items-center');
    });
  });

  describe('onChange', () => {
    it('calls onChange with value and event', () => {
      const handleChange = vi.fn();
      render(<InputCatto onChange={handleChange} placeholder="Enter text" />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(
        'new value',
        expect.any(Object),
      );
    });

    it('calls onChangeNative handler', () => {
      const handleChangeNative = vi.fn();
      render(
        <InputCatto
          onChangeNative={handleChangeNative}
          placeholder="Enter text"
        />,
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'native value' } });

      expect(handleChangeNative).toHaveBeenCalledTimes(1);
    });

    it('calls both onChange handlers when both provided', () => {
      const handleChange = vi.fn();
      const handleChangeNative = vi.fn();
      render(
        <InputCatto
          onChange={handleChange}
          onChangeNative={handleChangeNative}
          placeholder="Enter text"
        />,
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'both' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChangeNative).toHaveBeenCalledTimes(1);
    });
  });

  describe('error state', () => {
    it('shows error message when error is string', () => {
      render(
        <InputCatto error="This field is required" placeholder="Enter text" />,
      );

      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('applies error styling when error is truthy', () => {
      render(<InputCatto error="Error" placeholder="Enter text" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('border-red-500');
    });

    it('applies error styling when error is boolean true', () => {
      render(<InputCatto error={true} placeholder="Enter text" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('border-red-500');
    });

    it('sets aria-invalid when error exists', () => {
      render(<InputCatto error="Error message" placeholder="Enter text" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid when no error', () => {
      render(<InputCatto placeholder="Enter text" />);

      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('helper text', () => {
    it('shows helper text when provided', () => {
      render(
        <InputCatto
          helperText="Enter a valid email"
          placeholder="Enter text"
        />,
      );

      expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
    });

    it('hides helper text when error message is shown', () => {
      render(
        <InputCatto
          helperText="Enter a valid email"
          error="This field is required"
          placeholder="Enter text"
        />,
      );

      expect(screen.queryByText('Enter a valid email')).not.toBeInTheDocument();
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('renders enabled by default', () => {
      render(<InputCatto placeholder="Enter text" />);

      expect(screen.getByRole('textbox')).not.toBeDisabled();
    });

    it('renders disabled when disabled prop is true', () => {
      render(<InputCatto placeholder="Enter text" disabled />);

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('applies disabled styling', () => {
      render(<InputCatto placeholder="Enter text" disabled />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('opacity-50');
      expect(input.className).toContain('cursor-not-allowed');
    });
  });

  describe('sizes', () => {
    it('applies small size styles', () => {
      render(<InputCatto placeholder="Small" size="small" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('h-8');
      expect(input.className).toContain('text-sm');
    });

    it('applies medium size styles by default', () => {
      render(<InputCatto placeholder="Medium" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('h-10');
      expect(input.className).toContain('text-base');
    });

    it('applies large size styles', () => {
      render(<InputCatto placeholder="Large" size="large" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('h-12');
      expect(input.className).toContain('text-lg');
    });
  });

  describe('variants', () => {
    it('applies outlined variant by default', () => {
      render(<InputCatto placeholder="Outlined" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('border');
      expect(input.className).toContain('bg-theme-surface');
    });

    it('applies filled variant styles', () => {
      render(<InputCatto placeholder="Filled" variant="filled" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('bg-theme-surface-sunken');
    });

    it('applies minimal variant styles', () => {
      render(<InputCatto placeholder="Minimal" variant="minimal" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('bg-transparent');
    });
  });

  describe('input types', () => {
    it('renders as text input by default', () => {
      render(<InputCatto placeholder="Text" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders as email input when specified', () => {
      render(<InputCatto type="email" placeholder="Email" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders as password input when specified', () => {
      render(<InputCatto type="password" placeholder="Password" />);

      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe('focus and blur', () => {
    it('calls onFocus when focused', () => {
      const handleFocus = vi.fn();
      render(<InputCatto onFocus={handleFocus} placeholder="Enter text" />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', () => {
      const handleBlur = vi.fn();
      render(<InputCatto onBlur={handleBlur} placeholder="Enter text" />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('width', () => {
    it('applies full width by default', () => {
      render(<InputCatto placeholder="Full" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('w-full');
    });

    it('applies custom width class', () => {
      render(<InputCatto placeholder="Half" width="w-1/2" />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain('w-1/2');
    });
  });
});
