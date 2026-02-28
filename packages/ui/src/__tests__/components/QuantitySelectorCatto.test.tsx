// @catto/ui - QuantitySelectorCatto Tests
import { describe, expect, it, vi } from 'vitest';
import QuantitySelectorCatto from '../../components/QuantitySelector/QuantitySelectorCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('QuantitySelectorCatto', () => {
  describe('rendering', () => {
    it('renders current value', () => {
      render(<QuantitySelectorCatto value={5} onChange={() => {}} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders increment and decrement buttons', () => {
      render(<QuantitySelectorCatto value={1} onChange={() => {}} />);
      expect(
        screen.getByRole('button', { name: 'Decrease quantity' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Increase quantity' }),
      ).toBeInTheDocument();
    });

    it('applies data-testid', () => {
      render(
        <QuantitySelectorCatto
          value={1}
          onChange={() => {}}
          data-testid="qty"
        />,
      );
      expect(screen.getByTestId('qty')).toBeInTheDocument();
    });

    it('has role group with aria-label', () => {
      render(<QuantitySelectorCatto value={1} onChange={() => {}} />);
      expect(
        screen.getByRole('group', { name: 'Quantity' }),
      ).toBeInTheDocument();
    });

    it('uses custom aria-label', () => {
      render(
        <QuantitySelectorCatto
          value={1}
          onChange={() => {}}
          aria-label="Item count"
        />,
      );
      expect(
        screen.getByRole('group', { name: 'Item count' }),
      ).toBeInTheDocument();
    });
  });

  describe('increment', () => {
    it('calls onChange with incremented value', () => {
      const handleChange = vi.fn();
      render(<QuantitySelectorCatto value={5} onChange={handleChange} />);

      fireEvent.click(
        screen.getByRole('button', { name: 'Increase quantity' }),
      );

      expect(handleChange).toHaveBeenCalledWith(6);
    });

    it('respects max limit', () => {
      const handleChange = vi.fn();
      render(
        <QuantitySelectorCatto value={10} max={10} onChange={handleChange} />,
      );

      const incrementBtn = screen.getByRole('button', {
        name: 'Increase quantity',
      });
      expect(incrementBtn).toBeDisabled();

      fireEvent.click(incrementBtn);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('uses custom step', () => {
      const handleChange = vi.fn();
      render(
        <QuantitySelectorCatto value={5} step={5} onChange={handleChange} />,
      );

      fireEvent.click(
        screen.getByRole('button', { name: 'Increase quantity' }),
      );

      expect(handleChange).toHaveBeenCalledWith(10);
    });
  });

  describe('decrement', () => {
    it('calls onChange with decremented value', () => {
      const handleChange = vi.fn();
      render(<QuantitySelectorCatto value={5} onChange={handleChange} />);

      fireEvent.click(
        screen.getByRole('button', { name: 'Decrease quantity' }),
      );

      expect(handleChange).toHaveBeenCalledWith(4);
    });

    it('respects min limit', () => {
      const handleChange = vi.fn();
      render(
        <QuantitySelectorCatto value={0} min={0} onChange={handleChange} />,
      );

      const decrementBtn = screen.getByRole('button', {
        name: 'Decrease quantity',
      });
      expect(decrementBtn).toBeDisabled();

      fireEvent.click(decrementBtn);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('uses custom step', () => {
      const handleChange = vi.fn();
      render(
        <QuantitySelectorCatto value={10} step={5} onChange={handleChange} />,
      );

      fireEvent.click(
        screen.getByRole('button', { name: 'Decrease quantity' }),
      );

      expect(handleChange).toHaveBeenCalledWith(5);
    });
  });

  describe('showInput', () => {
    it('renders input field when showInput is true', () => {
      render(<QuantitySelectorCatto value={5} onChange={() => {}} showInput />);
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(5);
    });

    it('handles input change', () => {
      const handleChange = vi.fn();
      render(
        <QuantitySelectorCatto value={5} onChange={handleChange} showInput />,
      );

      fireEvent.change(screen.getByRole('spinbutton'), {
        target: { value: '8' },
      });

      expect(handleChange).toHaveBeenCalledWith(8);
    });

    it('clamps input value to min/max', () => {
      const handleChange = vi.fn();
      render(
        <QuantitySelectorCatto
          value={5}
          min={1}
          max={10}
          onChange={handleChange}
          showInput
        />,
      );

      fireEvent.change(screen.getByRole('spinbutton'), {
        target: { value: '15' },
      });
      expect(handleChange).toHaveBeenCalledWith(10);

      fireEvent.change(screen.getByRole('spinbutton'), {
        target: { value: '0' },
      });
      expect(handleChange).toHaveBeenCalledWith(1);
    });
  });

  describe('sizes', () => {
    it('applies sm size', () => {
      const { container } = render(
        <QuantitySelectorCatto value={1} onChange={() => {}} size="sm" />,
      );
      const button = container.querySelector('.h-7');
      expect(button).toBeInTheDocument();
    });

    it('applies md size by default', () => {
      const { container } = render(
        <QuantitySelectorCatto value={1} onChange={() => {}} />,
      );
      const button = container.querySelector('.h-9');
      expect(button).toBeInTheDocument();
    });

    it('applies lg size', () => {
      const { container } = render(
        <QuantitySelectorCatto value={1} onChange={() => {}} size="lg" />,
      );
      const button = container.querySelector('.h-11');
      expect(button).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('applies default variant', () => {
      render(
        <QuantitySelectorCatto
          value={1}
          onChange={() => {}}
          data-testid="qty"
        />,
      );
      const container = screen.getByTestId('qty');
      expect(container.className).toContain('bg-gray-100');
    });

    it('applies outline variant', () => {
      render(
        <QuantitySelectorCatto
          value={1}
          onChange={() => {}}
          variant="outline"
          data-testid="qty"
        />,
      );
      const container = screen.getByTestId('qty');
      expect(container.className).toContain('border');
    });

    it('applies filled variant', () => {
      render(
        <QuantitySelectorCatto
          value={1}
          onChange={() => {}}
          variant="filled"
          data-testid="qty"
        />,
      );
      const container = screen.getByTestId('qty');
      expect(container.className).toContain('bg-gray-200');
    });
  });

  describe('disabled', () => {
    it('disables all buttons when disabled', () => {
      render(<QuantitySelectorCatto value={5} onChange={() => {}} disabled />);

      expect(
        screen.getByRole('button', { name: 'Decrease quantity' }),
      ).toBeDisabled();
      expect(
        screen.getByRole('button', { name: 'Increase quantity' }),
      ).toBeDisabled();
    });

    it('applies disabled styling', () => {
      render(
        <QuantitySelectorCatto
          value={5}
          onChange={() => {}}
          disabled
          data-testid="qty"
        />,
      );
      const container = screen.getByTestId('qty');
      expect(container.className).toContain('opacity-50');
    });

    it('disables input when disabled', () => {
      render(
        <QuantitySelectorCatto
          value={5}
          onChange={() => {}}
          disabled
          showInput
        />,
      );
      expect(screen.getByRole('spinbutton')).toBeDisabled();
    });
  });

  describe('className', () => {
    it('applies custom className', () => {
      render(
        <QuantitySelectorCatto
          value={1}
          onChange={() => {}}
          className="my-custom-class"
          data-testid="qty"
        />,
      );
      expect(screen.getByTestId('qty').className).toContain('my-custom-class');
    });
  });
});
