// @catto/ui - OtpInputCatto Tests
import { describe, expect, it, vi } from 'vitest';
import OtpInputCatto from '../../components/OtpInput/OtpInputCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('OtpInputCatto', () => {
  describe('rendering', () => {
    it('renders correct number of inputs with default length', () => {
      render(<OtpInputCatto onComplete={vi.fn()} />);

      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(6);
    });

    it('renders correct number of inputs with custom length', () => {
      render(<OtpInputCatto onComplete={vi.fn()} length={4} />);

      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(4);
    });

    it('renders with aria-label on each input', () => {
      render(<OtpInputCatto onComplete={vi.fn()} length={4} />);

      expect(screen.getByLabelText('Digit 1 of 4')).toBeInTheDocument();
      expect(screen.getByLabelText('Digit 2 of 4')).toBeInTheDocument();
      expect(screen.getByLabelText('Digit 3 of 4')).toBeInTheDocument();
      expect(screen.getByLabelText('Digit 4 of 4')).toBeInTheDocument();
    });

    it('renders error message when provided', () => {
      render(<OtpInputCatto onComplete={vi.fn()} error="Invalid code" />);

      expect(screen.getByText('Invalid code')).toBeInTheDocument();
    });
  });

  describe('input behavior', () => {
    it('accepts only numeric input', () => {
      render(<OtpInputCatto onComplete={vi.fn()} length={4} />);

      const firstInput = screen.getByLabelText('Digit 1 of 4');
      fireEvent.change(firstInput, { target: { value: 'a' } });

      expect(firstInput).toHaveValue('');

      fireEvent.change(firstInput, { target: { value: '5' } });

      expect(firstInput).toHaveValue('5');
    });

    it('auto-advances to next input after entering digit', () => {
      render(<OtpInputCatto onComplete={vi.fn()} length={4} />);

      const input1 = screen.getByLabelText('Digit 1 of 4');
      const input2 = screen.getByLabelText('Digit 2 of 4');

      fireEvent.change(input1, { target: { value: '1' } });

      expect(document.activeElement).toBe(input2);
    });

    it('only keeps last digit when multiple are entered', () => {
      render(<OtpInputCatto onComplete={vi.fn()} length={4} />);

      const input1 = screen.getByLabelText('Digit 1 of 4');
      fireEvent.change(input1, { target: { value: '123' } });

      expect(input1).toHaveValue('3');
    });
  });

  describe('keyboard navigation', () => {
    it('backspace clears current input', () => {
      render(<OtpInputCatto onComplete={vi.fn()} length={4} />);

      const input1 = screen.getByLabelText('Digit 1 of 4');
      fireEvent.change(input1, { target: { value: '5' } });

      expect(input1).toHaveValue('5');

      fireEvent.keyDown(input1, { key: 'Backspace' });

      expect(input1).toHaveValue('');
    });

    it('backspace on empty input moves to previous input', () => {
      render(<OtpInputCatto onComplete={vi.fn()} length={4} />);

      const input1 = screen.getByLabelText('Digit 1 of 4');
      const input2 = screen.getByLabelText('Digit 2 of 4');

      fireEvent.change(input1, { target: { value: '1' } });
      fireEvent.keyDown(input2, { key: 'Backspace' });

      expect(document.activeElement).toBe(input1);
    });

    it('arrow left moves to previous input', () => {
      render(<OtpInputCatto onComplete={vi.fn()} length={4} />);

      const input1 = screen.getByLabelText('Digit 1 of 4');
      const input2 = screen.getByLabelText('Digit 2 of 4');

      input2.focus();
      fireEvent.keyDown(input2, { key: 'ArrowLeft' });

      expect(document.activeElement).toBe(input1);
    });

    it('arrow right moves to next input', () => {
      render(<OtpInputCatto onComplete={vi.fn()} length={4} />);

      const input1 = screen.getByLabelText('Digit 1 of 4');
      const input2 = screen.getByLabelText('Digit 2 of 4');

      input1.focus();
      fireEvent.keyDown(input1, { key: 'ArrowRight' });

      expect(document.activeElement).toBe(input2);
    });
  });

  describe('paste functionality', () => {
    it('fills all inputs when pasting complete code', () => {
      const handleComplete = vi.fn();
      render(<OtpInputCatto onComplete={handleComplete} length={4} />);

      const input1 = screen.getByLabelText('Digit 1 of 4');
      fireEvent.paste(input1, {
        clipboardData: { getData: () => '1234' },
      });

      expect(screen.getByLabelText('Digit 1 of 4')).toHaveValue('1');
      expect(screen.getByLabelText('Digit 2 of 4')).toHaveValue('2');
      expect(screen.getByLabelText('Digit 3 of 4')).toHaveValue('3');
      expect(screen.getByLabelText('Digit 4 of 4')).toHaveValue('4');
    });

    it('strips non-numeric characters from pasted text', () => {
      render(<OtpInputCatto onComplete={vi.fn()} length={4} />);

      const input1 = screen.getByLabelText('Digit 1 of 4');
      fireEvent.paste(input1, {
        clipboardData: { getData: () => '1a2b3c4d' },
      });

      expect(screen.getByLabelText('Digit 1 of 4')).toHaveValue('1');
      expect(screen.getByLabelText('Digit 2 of 4')).toHaveValue('2');
      expect(screen.getByLabelText('Digit 3 of 4')).toHaveValue('3');
      expect(screen.getByLabelText('Digit 4 of 4')).toHaveValue('4');
    });
  });

  describe('completion callback', () => {
    it('calls onComplete when all digits are entered', () => {
      const handleComplete = vi.fn();
      render(<OtpInputCatto onComplete={handleComplete} length={4} />);

      const input1 = screen.getByLabelText('Digit 1 of 4');
      fireEvent.paste(input1, {
        clipboardData: { getData: () => '9876' },
      });

      expect(handleComplete).toHaveBeenCalledWith('9876');
    });

    it('does not call onComplete when code is incomplete', () => {
      const handleComplete = vi.fn();
      render(<OtpInputCatto onComplete={handleComplete} length={4} />);

      const input1 = screen.getByLabelText('Digit 1 of 4');
      fireEvent.change(input1, { target: { value: '1' } });

      const input2 = screen.getByLabelText('Digit 2 of 4');
      fireEvent.change(input2, { target: { value: '2' } });

      expect(handleComplete).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('disables all inputs when disabled', () => {
      render(<OtpInputCatto onComplete={vi.fn()} length={4} disabled />);

      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).toBeDisabled();
      });
    });

    it('applies disabled styling', () => {
      const { container } = render(
        <OtpInputCatto onComplete={vi.fn()} disabled />,
      );

      const disabledInput = container.querySelector('.opacity-50');
      expect(disabledInput).toBeInTheDocument();
    });

    it('ignores input when disabled', () => {
      render(<OtpInputCatto onComplete={vi.fn()} length={4} disabled />);

      const input1 = screen.getByLabelText('Digit 1 of 4');
      fireEvent.change(input1, { target: { value: '5' } });

      expect(input1).toHaveValue('');
    });
  });

  describe('error styling', () => {
    it('applies error styling to inputs', () => {
      const { container } = render(
        <OtpInputCatto onComplete={vi.fn()} error="Invalid code" />,
      );

      const errorInput = container.querySelector('.border-red-500');
      expect(errorInput).toBeInTheDocument();
    });
  });

  describe('custom className', () => {
    it('merges custom className', () => {
      const { container } = render(
        <OtpInputCatto onComplete={vi.fn()} className="my-custom-class" />,
      );

      const wrapper = container.querySelector('.my-custom-class');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('input mode', () => {
    it('has numeric inputMode for mobile keyboards', () => {
      render(<OtpInputCatto onComplete={vi.fn()} length={4} />);

      const input1 = screen.getByLabelText('Digit 1 of 4');
      expect(input1).toHaveAttribute('inputMode', 'numeric');
    });

    it('has maxLength of 1', () => {
      render(<OtpInputCatto onComplete={vi.fn()} length={4} />);

      const input1 = screen.getByLabelText('Digit 1 of 4');
      expect(input1).toHaveAttribute('maxLength', '1');
    });
  });
});
