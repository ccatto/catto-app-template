// @catto/ui - LinkCatto Tests
import { describe, expect, it, vi } from 'vitest';
import LinkCatto from '../../components/Link/LinkCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('LinkCatto', () => {
  describe('rendering', () => {
    it('renders as link with href', () => {
      render(<LinkCatto href="/teams">View Teams</LinkCatto>);

      const link = screen.getByRole('link', { name: 'View Teams' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/teams');
    });

    it('renders children', () => {
      render(<LinkCatto href="/test">Link Text</LinkCatto>);

      expect(screen.getByText('Link Text')).toBeInTheDocument();
    });

    it('renders with external href', () => {
      render(<LinkCatto href="https://example.com">External</LinkCatto>);

      const link = screen.getByRole('link', { name: 'External' });
      expect(link).toHaveAttribute('href', 'https://example.com');
    });
  });

  describe('icons', () => {
    it('renders left icon when provided', () => {
      render(
        <LinkCatto
          href="/teams"
          leftIcon={<span data-testid="left-icon">left</span>}
        >
          Teams
        </LinkCatto>,
      );

      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renders right icon when provided', () => {
      render(
        <LinkCatto
          href="/teams"
          rightIcon={<span data-testid="right-icon">right</span>}
        >
          Teams
        </LinkCatto>,
      );

      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('renders both icons when provided', () => {
      render(
        <LinkCatto
          href="/teams"
          leftIcon={<span data-testid="left-icon">left</span>}
          rightIcon={<span data-testid="right-icon">right</span>}
        >
          Teams
        </LinkCatto>,
      );

      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('sets aria-disabled when disabled', () => {
      render(
        <LinkCatto href="/teams" disabled>
          Disabled
        </LinkCatto>,
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });

    it('applies opacity styling when disabled', () => {
      render(
        <LinkCatto href="/teams" disabled>
          Disabled
        </LinkCatto>,
      );

      const link = screen.getByRole('link');
      expect(link.className).toContain('opacity-50');
    });

    it('prevents click when disabled', () => {
      const handleClick = vi.fn();
      render(
        <LinkCatto href="/teams" disabled onClick={handleClick}>
          Disabled
        </LinkCatto>,
      );

      const link = screen.getByRole('link');
      fireEvent.click(link);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('onClick', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(
        <LinkCatto href="/teams" onClick={handleClick}>
          Click Me
        </LinkCatto>,
      );

      const link = screen.getByRole('link');
      fireEvent.click(link);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('passes event to onClick', () => {
      const handleClick = vi.fn();
      render(
        <LinkCatto href="/teams" onClick={handleClick}>
          Click Me
        </LinkCatto>,
      );

      const link = screen.getByRole('link');
      fireEvent.click(link);

      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('variants', () => {
    it('applies default variant styles', () => {
      render(<LinkCatto href="/test">Default</LinkCatto>);

      const link = screen.getByRole('link');
      // Uses explicit Tailwind colors
      expect(link.className).toContain('text-blue-600');
    });

    it('applies subtle variant styles', () => {
      render(
        <LinkCatto href="/test" variant="subtle">
          Subtle
        </LinkCatto>,
      );

      const link = screen.getByRole('link');
      // Uses explicit Tailwind colors
      expect(link.className).toContain('text-slate-600');
    });

    it('applies button variant styles', () => {
      render(
        <LinkCatto href="/test" variant="button">
          Button
        </LinkCatto>,
      );

      const link = screen.getByRole('link');
      // Uses explicit Tailwind colors
      expect(link.className).toContain('bg-blue-600');
      expect(link.className).toContain('rounded-md');
    });

    it('applies outline variant styles', () => {
      render(
        <LinkCatto href="/test" variant="outline">
          Outline
        </LinkCatto>,
      );

      const link = screen.getByRole('link');
      expect(link.className).toContain('border');
      // Uses explicit Tailwind colors
      expect(link.className).toContain('border-blue-600');
    });

    it('applies ghost variant styles', () => {
      render(
        <LinkCatto href="/test" variant="ghost">
          Ghost
        </LinkCatto>,
      );

      const link = screen.getByRole('link');
      expect(link.className).toContain('rounded-md');
    });

    it('applies underline variant styles', () => {
      render(
        <LinkCatto href="/test" variant="underline">
          Underline
        </LinkCatto>,
      );

      const link = screen.getByRole('link');
      expect(link.className).toContain('border-b-2');
    });

    it('applies orange variant styles', () => {
      render(
        <LinkCatto href="/test" variant="orange">
          Orange
        </LinkCatto>,
      );

      const link = screen.getByRole('link');
      // Uses explicit Tailwind colors
      expect(link.className).toContain('text-orange-500');
    });
  });

  describe('sizes', () => {
    it('applies small size styles', () => {
      render(
        <LinkCatto href="/test" size="sm">
          Small
        </LinkCatto>,
      );

      const link = screen.getByRole('link');
      expect(link.className).toContain('px-3');
      expect(link.className).toContain('text-sm');
    });

    it('applies medium size styles by default', () => {
      render(<LinkCatto href="/test">Medium</LinkCatto>);

      const link = screen.getByRole('link');
      expect(link.className).toContain('px-4');
      expect(link.className).toContain('text-base');
    });

    it('applies large size styles', () => {
      render(
        <LinkCatto href="/test" size="lg">
          Large
        </LinkCatto>,
      );

      const link = screen.getByRole('link');
      expect(link.className).toContain('px-6');
      expect(link.className).toContain('text-lg');
    });

    it('applies icon size styles', () => {
      render(
        <LinkCatto href="/test" size="icon">
          <span>Icon</span>
        </LinkCatto>,
      );

      const link = screen.getByRole('link');
      expect(link.className).toContain('p-2');
    });
  });

  describe('accessibility', () => {
    it('uses children as aria-label for string children', () => {
      render(<LinkCatto href="/test">Accessible Link</LinkCatto>);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-label', 'Accessible Link');
    });

    it('uses explicit aria-label when provided', () => {
      render(
        <LinkCatto href="/test" aria-label="Custom Label">
          Link Text
        </LinkCatto>,
      );

      const link = screen.getByRole('link', { name: 'Custom Label' });
      expect(link).toBeInTheDocument();
    });
  });

  describe('tooltip', () => {
    it('renders tooltip as title attribute', () => {
      render(
        <LinkCatto href="/test" tooltip="This is a tooltip">
          Hover Me
        </LinkCatto>,
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('title', 'This is a tooltip');
    });
  });

  describe('custom className', () => {
    it('merges custom className with variant classes', () => {
      render(
        <LinkCatto href="/test" className="my-custom-class">
          Custom
        </LinkCatto>,
      );

      const link = screen.getByRole('link');
      expect(link.className).toContain('my-custom-class');
      expect(link.className).toContain('text-blue-600');
    });
  });
});
