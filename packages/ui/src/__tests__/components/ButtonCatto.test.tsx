// @catto/ui - ButtonCatto Tests
import { Check, ChevronRight } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import ButtonCatto from '../../components/Button/ButtonCatto';
import { render, screen } from '../test-utils';

describe('ButtonCatto', () => {
  // ============================================
  // Rendering Tests
  // ============================================

  describe('rendering', () => {
    it('renders with children text', () => {
      render(<ButtonCatto>Click Me</ButtonCatto>);
      expect(
        screen.getByRole('button', { name: /click me/i }),
      ).toBeInTheDocument();
    });

    it('renders with label prop', () => {
      render(<ButtonCatto label="Submit" />);
      expect(
        screen.getByRole('button', { name: /submit/i }),
      ).toBeInTheDocument();
    });

    it('prefers children over label when both provided', () => {
      render(<ButtonCatto label="Label Text">Children Text</ButtonCatto>);
      expect(
        screen.getByRole('button', { name: /children text/i }),
      ).toBeInTheDocument();
      expect(screen.queryByText(/label text/i)).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Click Handler Tests
  // ============================================

  describe('click handling', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = vi.fn();
      const { user } = render(
        <ButtonCatto onClick={handleClick}>Click Me</ButtonCatto>,
      );

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const { user } = render(
        <ButtonCatto onClick={handleClick} disabled>
          Disabled Button
        </ButtonCatto>,
      );

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', async () => {
      const handleClick = vi.fn();
      const { user } = render(
        <ButtonCatto onClick={handleClick} isLoading>
          Loading Button
        </ButtonCatto>,
      );

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // Disabled State Tests
  // ============================================

  describe('disabled state', () => {
    it('has disabled attribute when disabled', () => {
      render(<ButtonCatto disabled>Disabled</ButtonCatto>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('has disabled attribute when loading', () => {
      render(<ButtonCatto isLoading>Loading</ButtonCatto>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('is enabled by default', () => {
      render(<ButtonCatto>Enabled</ButtonCatto>);
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  // ============================================
  // Loading State Tests
  // ============================================

  describe('loading state', () => {
    it('shows loading spinner when isLoading is true', () => {
      render(<ButtonCatto isLoading>Submit</ButtonCatto>);
      // Check for SVG spinner
      expect(
        screen.getByRole('button').querySelector('svg'),
      ).toBeInTheDocument();
    });

    it('hides icons when loading', () => {
      render(
        <ButtonCatto
          isLoading
          leftIcon={<Check data-testid="left-icon" />}
          rightIcon={<ChevronRight data-testid="right-icon" />}
        >
          Submit
        </ButtonCatto>,
      );

      expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Icon Tests
  // ============================================

  describe('icons', () => {
    it('renders left icon when provided', () => {
      render(
        <ButtonCatto leftIcon={<Check data-testid="left-icon" />}>
          With Icon
        </ButtonCatto>,
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renders right icon when provided', () => {
      render(
        <ButtonCatto rightIcon={<ChevronRight data-testid="right-icon" />}>
          With Icon
        </ButtonCatto>,
      );
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('renders both icons when provided', () => {
      render(
        <ButtonCatto
          leftIcon={<Check data-testid="left-icon" />}
          rightIcon={<ChevronRight data-testid="right-icon" />}
        >
          With Both Icons
        </ButtonCatto>,
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  // ============================================
  // Button Type Tests
  // ============================================

  describe('button type', () => {
    it('has type="button" by default', () => {
      render(<ButtonCatto>Default Type</ButtonCatto>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('accepts type="submit"', () => {
      render(<ButtonCatto type="submit">Submit</ButtonCatto>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('accepts type="reset"', () => {
      render(<ButtonCatto type="reset">Reset</ButtonCatto>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    });
  });

  // ============================================
  // Variant Tests
  // ============================================

  describe('variants', () => {
    it('applies primary variant classes', () => {
      render(<ButtonCatto variant="primary">Primary</ButtonCatto>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-theme-primary');
    });

    it('applies danger variant classes', () => {
      render(<ButtonCatto variant="danger">Delete</ButtonCatto>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-500');
    });

    it('applies goGreen variant classes', () => {
      render(<ButtonCatto variant="goGreen">Success</ButtonCatto>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-green-400');
    });
  });

  // ============================================
  // Size Tests
  // ============================================

  describe('sizes', () => {
    it('applies small size classes', () => {
      render(<ButtonCatto size="small">Small</ButtonCatto>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-sm');
    });

    it('applies medium size classes', () => {
      render(<ButtonCatto size="medium">Medium</ButtonCatto>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-base');
    });

    it('applies large size classes', () => {
      render(<ButtonCatto size="large">Large</ButtonCatto>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-lg');
    });
  });

  // ============================================
  // Width Tests
  // ============================================

  describe('width', () => {
    it('applies full width by default', () => {
      render(<ButtonCatto>Full Width</ButtonCatto>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('applies auto width', () => {
      render(<ButtonCatto width="auto">Auto Width</ButtonCatto>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-auto');
    });

    it('applies fit width', () => {
      render(<ButtonCatto width="fit">Fit Width</ButtonCatto>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-fit');
    });

    it('applies custom width class', () => {
      render(<ButtonCatto width="w-64">Custom Width</ButtonCatto>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-64');
    });
  });

  // ============================================
  // className Override Tests
  // ============================================

  describe('className override', () => {
    it('applies additional className', () => {
      render(<ButtonCatto className="my-custom-class">Custom</ButtonCatto>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('my-custom-class');
    });

    it('preserves variant classes when className is added', () => {
      render(
        <ButtonCatto variant="primary" className="my-custom-class">
          Custom
        </ButtonCatto>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('my-custom-class');
      expect(button).toHaveClass('bg-theme-primary');
    });
  });
});
