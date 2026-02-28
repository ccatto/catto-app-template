// @catto/ui - BadgeCatto Tests
import { describe, expect, it, vi } from 'vitest';
import BadgeCatto from '../../components/Badge/BadgeCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('BadgeCatto', () => {
  describe('rendering', () => {
    it('renders children content', () => {
      render(<BadgeCatto>New</BadgeCatto>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('renders as span by default', () => {
      const { container } = render(<BadgeCatto>Badge</BadgeCatto>);
      expect(container.querySelector('span')).toBeInTheDocument();
    });

    it('renders as button when onClick provided', () => {
      render(<BadgeCatto onClick={() => {}}>Click</BadgeCatto>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('applies data-testid', () => {
      render(<BadgeCatto data-testid="my-badge">Test</BadgeCatto>);
      expect(screen.getByTestId('my-badge')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('applies default variant styles', () => {
      render(<BadgeCatto variant="default">Default</BadgeCatto>);
      const badge = screen.getByText('Default');
      expect(badge.className).toContain('bg-gray-100');
    });

    it('applies primary variant styles', () => {
      render(<BadgeCatto variant="primary">Primary</BadgeCatto>);
      const badge = screen.getByText('Primary');
      expect(badge.className).toContain('bg-blue-100');
    });

    it('applies success variant styles', () => {
      render(<BadgeCatto variant="success">Success</BadgeCatto>);
      const badge = screen.getByText('Success');
      expect(badge.className).toContain('bg-green-100');
    });

    it('applies warning variant styles', () => {
      render(<BadgeCatto variant="warning">Warning</BadgeCatto>);
      const badge = screen.getByText('Warning');
      expect(badge.className).toContain('bg-orange-100');
    });

    it('applies error variant styles', () => {
      render(<BadgeCatto variant="error">Error</BadgeCatto>);
      const badge = screen.getByText('Error');
      expect(badge.className).toContain('bg-red-100');
    });

    it('applies info variant styles', () => {
      render(<BadgeCatto variant="info">Info</BadgeCatto>);
      const badge = screen.getByText('Info');
      expect(badge.className).toContain('bg-cyan-100');
    });

    it('applies outline variant styles', () => {
      render(<BadgeCatto variant="outline">Outline</BadgeCatto>);
      const badge = screen.getByText('Outline');
      expect(badge.className).toContain('border');
      expect(badge.className).toContain('bg-transparent');
    });
  });

  describe('sizes', () => {
    it('applies xs size styles', () => {
      render(<BadgeCatto size="xs">XS</BadgeCatto>);
      const badge = screen.getByText('XS');
      expect(badge.className).toContain('text-xs');
      expect(badge.className).toContain('px-1.5');
    });

    it('applies sm size styles by default', () => {
      render(<BadgeCatto>SM</BadgeCatto>);
      const badge = screen.getByText('SM');
      expect(badge.className).toContain('text-xs');
      expect(badge.className).toContain('px-2');
    });

    it('applies md size styles', () => {
      render(<BadgeCatto size="md">MD</BadgeCatto>);
      const badge = screen.getByText('MD');
      expect(badge.className).toContain('text-sm');
      expect(badge.className).toContain('px-2.5');
    });

    it('applies lg size styles', () => {
      render(<BadgeCatto size="lg">LG</BadgeCatto>);
      const badge = screen.getByText('LG');
      expect(badge.className).toContain('text-base');
      expect(badge.className).toContain('px-3');
    });
  });

  describe('rounded', () => {
    it('applies rounded-md by default', () => {
      render(<BadgeCatto>Badge</BadgeCatto>);
      const badge = screen.getByText('Badge');
      expect(badge.className).toContain('rounded-md');
    });

    it('applies rounded-full when rounded prop is true', () => {
      render(<BadgeCatto rounded>Badge</BadgeCatto>);
      const badge = screen.getByText('Badge');
      expect(badge.className).toContain('rounded-full');
    });
  });

  describe('icons', () => {
    it('renders left icon', () => {
      render(
        <BadgeCatto leftIcon={<span data-testid="left-icon">L</span>}>
          Badge
        </BadgeCatto>,
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renders right icon', () => {
      render(
        <BadgeCatto rightIcon={<span data-testid="right-icon">R</span>}>
          Badge
        </BadgeCatto>,
      );
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('renders both icons', () => {
      render(
        <BadgeCatto
          leftIcon={<span data-testid="left">L</span>}
          rightIcon={<span data-testid="right">R</span>}
        >
          Badge
        </BadgeCatto>,
      );
      expect(screen.getByTestId('left')).toBeInTheDocument();
      expect(screen.getByTestId('right')).toBeInTheDocument();
    });
  });

  describe('dot mode', () => {
    it('renders as dot indicator', () => {
      const { container } = render(<BadgeCatto dot />);
      const dot = container.querySelector('.rounded-full');
      expect(dot).toBeInTheDocument();
    });

    it('dot has aria-hidden', () => {
      const { container } = render(<BadgeCatto dot />);
      const dot = container.querySelector('[aria-hidden="true"]');
      expect(dot).toBeInTheDocument();
    });

    it('dot ignores children', () => {
      render(<BadgeCatto dot>Hidden Text</BadgeCatto>);
      expect(screen.queryByText('Hidden Text')).not.toBeInTheDocument();
    });

    it('applies dot size styles', () => {
      const { container } = render(<BadgeCatto dot size="md" />);
      const dot = container.querySelector('.h-2\\.5');
      expect(dot).toBeInTheDocument();
    });
  });

  describe('pulse animation', () => {
    it('applies pulse animation', () => {
      render(<BadgeCatto pulse>Pulsing</BadgeCatto>);
      const badge = screen.getByText('Pulsing');
      expect(badge.className).toContain('animate-pulse');
    });

    it('applies pulse to dot', () => {
      const { container } = render(<BadgeCatto dot pulse />);
      const dot = container.querySelector('.animate-pulse');
      expect(dot).toBeInTheDocument();
    });
  });

  describe('onClick', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<BadgeCatto onClick={handleClick}>Click me</BadgeCatto>);

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies interactive styles when onClick provided', () => {
      render(<BadgeCatto onClick={() => {}}>Interactive</BadgeCatto>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('cursor-pointer');
    });

    it('has type button when interactive', () => {
      render(<BadgeCatto onClick={() => {}}>Button</BadgeCatto>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });
  });

  describe('className', () => {
    it('applies custom className', () => {
      render(<BadgeCatto className="my-custom-class">Badge</BadgeCatto>);
      const badge = screen.getByText('Badge');
      expect(badge.className).toContain('my-custom-class');
    });
  });
});
