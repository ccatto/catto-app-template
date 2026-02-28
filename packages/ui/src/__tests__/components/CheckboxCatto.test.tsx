// @catto/ui - CheckboxCatto Tests
import { describe, expect, it, vi } from 'vitest';
import CheckboxCatto from '../../components/Checkbox/CheckboxCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('CheckboxCatto', () => {
  describe('rendering', () => {
    it('renders checkbox input', () => {
      render(<CheckboxCatto id="test" checked={false} onChange={vi.fn()} />);

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders with correct id', () => {
      render(
        <CheckboxCatto id="my-checkbox" checked={false} onChange={vi.fn()} />,
      );

      expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'my-checkbox');
    });

    it('checkbox is visually hidden (sr-only)', () => {
      render(<CheckboxCatto id="test" checked={false} onChange={vi.fn()} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox.className).toContain('sr-only');
    });
  });

  describe('checked state', () => {
    it('renders unchecked state', () => {
      render(<CheckboxCatto id="test" checked={false} onChange={vi.fn()} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('renders checked state', () => {
      render(<CheckboxCatto id="test" checked={true} onChange={vi.fn()} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('shows checkmark icon when checked', () => {
      const { container } = render(
        <CheckboxCatto id="test" checked={true} onChange={vi.fn()} />,
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('hides checkmark icon when unchecked', () => {
      const { container } = render(
        <CheckboxCatto id="test" checked={false} onChange={vi.fn()} />,
      );

      const svg = container.querySelector('svg');
      expect(svg).not.toBeInTheDocument();
    });

    it('applies checked background color', () => {
      const { container } = render(
        <CheckboxCatto id="test" checked={true} onChange={vi.fn()} />,
      );

      const visual = container.querySelector('.bg-orange-500');
      expect(visual).toBeInTheDocument();
    });

    it('applies unchecked border color', () => {
      const { container } = render(
        <CheckboxCatto id="test" checked={false} onChange={vi.fn()} />,
      );

      const visual = container.querySelector('.border-blue-500');
      expect(visual).toBeInTheDocument();
    });
  });

  describe('onChange', () => {
    it('calls onChange with true when clicking unchecked', () => {
      const handleChange = vi.fn();
      render(
        <CheckboxCatto id="test" checked={false} onChange={handleChange} />,
      );

      fireEvent.click(screen.getByRole('checkbox'));

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('calls onChange with false when clicking checked', () => {
      const handleChange = vi.fn();
      render(
        <CheckboxCatto id="test" checked={true} onChange={handleChange} />,
      );

      fireEvent.click(screen.getByRole('checkbox'));

      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('can be toggled by clicking label', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <CheckboxCatto id="test" checked={false} onChange={handleChange} />,
      );

      const label = container.querySelector('label');
      fireEvent.click(label!);

      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });

  describe('disabled state', () => {
    it('sets disabled attribute on checkbox', () => {
      render(
        <CheckboxCatto id="test" checked={false} onChange={vi.fn()} disabled />,
      );

      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('applies disabled styling', () => {
      const { container } = render(
        <CheckboxCatto id="test" checked={false} onChange={vi.fn()} disabled />,
      );

      const visual = container.querySelector('.opacity-50');
      expect(visual).toBeInTheDocument();
    });

    it('applies cursor-not-allowed when disabled', () => {
      const { container } = render(
        <CheckboxCatto id="test" checked={false} onChange={vi.fn()} disabled />,
      );

      const visual = container.querySelector('.cursor-not-allowed');
      expect(visual).toBeInTheDocument();
    });

    it('does not call onChange when disabled', async () => {
      const handleChange = vi.fn();
      const { user } = render(
        <CheckboxCatto
          id="test"
          checked={false}
          onChange={handleChange}
          disabled
        />,
      );

      // userEvent respects disabled state, unlike fireEvent
      await user.click(screen.getByRole('checkbox'));

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('sizes', () => {
    it('applies medium size by default', () => {
      const { container } = render(
        <CheckboxCatto id="test" checked={false} onChange={vi.fn()} />,
      );

      const visual = container.querySelector('.w-5.h-5');
      expect(visual).toBeInTheDocument();
    });

    it('applies large size', () => {
      const { container } = render(
        <CheckboxCatto
          id="test"
          checked={false}
          onChange={vi.fn()}
          checkboxSize="lg"
        />,
      );

      const visual = container.querySelector('.w-6.h-6');
      expect(visual).toBeInTheDocument();
    });

    it('applies xl size', () => {
      const { container } = render(
        <CheckboxCatto
          id="test"
          checked={false}
          onChange={vi.fn()}
          checkboxSize="xl"
        />,
      );

      const visual = container.querySelector('.w-8.h-8');
      expect(visual).toBeInTheDocument();
    });

    it('applies xxl size', () => {
      const { container } = render(
        <CheckboxCatto
          id="test"
          checked={false}
          onChange={vi.fn()}
          checkboxSize="xxl"
        />,
      );

      const visual = container.querySelector('.w-10.h-10');
      expect(visual).toBeInTheDocument();
    });
  });

  describe('custom className', () => {
    it('applies custom className to visual element', () => {
      const { container } = render(
        <CheckboxCatto
          id="test"
          checked={false}
          onChange={vi.fn()}
          className="my-custom-class"
        />,
      );

      const visual = container.querySelector('.my-custom-class');
      expect(visual).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('label is associated with checkbox via htmlFor', () => {
      const { container } = render(
        <CheckboxCatto id="my-cb" checked={false} onChange={vi.fn()} />,
      );

      const label = container.querySelector('label');
      expect(label).toHaveAttribute('for', 'my-cb');
    });

    it('has focus ring on focus', () => {
      const { container } = render(
        <CheckboxCatto id="test" checked={false} onChange={vi.fn()} />,
      );

      // The visual element has group-focus-within:ring-2 class
      const visual = container.querySelector('.group-focus-within\\:ring-2');
      expect(visual).toBeInTheDocument();
    });
  });
});
