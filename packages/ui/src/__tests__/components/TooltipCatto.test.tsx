// @catto/ui - TooltipCatto Tests
// Tests for the CSS-based tooltip (uses group-hover, no JS state)
import { fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TooltipCatto from '../../components/Tooltip/TooltipCatto';
import { render, screen } from '../test-utils';

describe('TooltipCatto', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(
        <TooltipCatto content="Tooltip text">
          <button>Hover me</button>
        </TooltipCatto>,
      );

      expect(
        screen.getByRole('button', { name: 'Hover me' }),
      ).toBeInTheDocument();
    });

    it('renders tooltip content', () => {
      render(
        <TooltipCatto content="Tooltip text">
          <button>Hover me</button>
        </TooltipCatto>,
      );

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('renders ReactNode as content', () => {
      render(
        <TooltipCatto
          content={<span data-testid="custom">Custom content</span>}
        >
          <button>Hover</button>
        </TooltipCatto>,
      );

      expect(screen.getByTestId('custom')).toBeInTheDocument();
    });

    it('tooltip starts hidden (opacity-0)', () => {
      render(
        <TooltipCatto content="Tooltip">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('opacity-0');
    });

    it('has group-hover classes for CSS visibility', () => {
      render(
        <TooltipCatto content="Tooltip">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('group-hover/tooltip:opacity-100');
      expect(tooltip.className).toContain('group-hover/tooltip:scale-100');
    });

    it('has group-focus-within classes for keyboard support', () => {
      render(
        <TooltipCatto content="Tooltip">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain(
        'group-focus-within/tooltip:opacity-100',
      );
    });

    it('wrapper has group/tooltip class', () => {
      const { container } = render(
        <TooltipCatto content="Tooltip">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('group/tooltip');
    });
  });

  describe('positions', () => {
    it('applies top position by default', () => {
      render(
        <TooltipCatto content="Tooltip">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('bottom-full');
    });

    it('applies bottom position', () => {
      render(
        <TooltipCatto content="Tooltip" position="bottom">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('top-full');
    });

    it('applies left position', () => {
      render(
        <TooltipCatto content="Tooltip" position="left">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('right-full');
    });

    it('applies right position', () => {
      render(
        <TooltipCatto content="Tooltip" position="right">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('left-full');
    });
  });

  describe('variants', () => {
    it('applies default variant styles', () => {
      render(
        <TooltipCatto content="Tooltip" variant="default">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('bg-gray-800');
    });

    it('applies orange variant styles', () => {
      render(
        <TooltipCatto content="Tooltip" variant="orange">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('bg-orange-500');
    });

    it('applies navy variant styles', () => {
      render(
        <TooltipCatto content="Tooltip" variant="navy">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('bg-slate-800');
    });

    it('applies dark variant styles', () => {
      render(
        <TooltipCatto content="Tooltip" variant="dark">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('bg-gray-900');
    });

    it('applies light variant styles', () => {
      render(
        <TooltipCatto content="Tooltip" variant="light">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('bg-gray-50');
    });
  });

  describe('delay', () => {
    it('applies delay as CSS transition-delay', () => {
      render(
        <TooltipCatto content="Tooltip" delay={500}>
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.style.transitionDelay).toBe('500ms');
    });

    it('applies default delay', () => {
      render(
        <TooltipCatto content="Tooltip">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.style.transitionDelay).toBe('200ms');
    });
  });

  describe('maxWidth', () => {
    it('applies default maxWidth', () => {
      render(
        <TooltipCatto content="Tooltip">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.style.maxWidth).toBe('220px');
    });

    it('applies custom maxWidth', () => {
      render(
        <TooltipCatto content="Tooltip" maxWidth="300px">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.style.maxWidth).toBe('300px');
    });
  });

  describe('offset', () => {
    it('applies additional offset to margin', () => {
      render(
        <TooltipCatto content="Tooltip" offset={10} position="top">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      // Base offset (8) + custom offset (10) = 18px
      expect(tooltip.style.marginBottom).toBe('18px');
    });
  });

  describe('custom classNames', () => {
    it('applies custom className to wrapper', () => {
      const { container } = render(
        <TooltipCatto content="Tooltip" className="my-wrapper">
          <button>Hover</button>
        </TooltipCatto>,
      );

      expect(container.querySelector('.my-wrapper')).toBeInTheDocument();
    });

    it('applies tooltipClassName to tooltip', () => {
      render(
        <TooltipCatto content="Tooltip" tooltipClassName="my-tooltip">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('my-tooltip');
    });
  });

  describe('accessibility', () => {
    it('tooltip has role tooltip', () => {
      render(
        <TooltipCatto content="Tooltip">
          <button>Hover</button>
        </TooltipCatto>,
      );

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('tooltip is pointer-events-none', () => {
      render(
        <TooltipCatto content="Tooltip">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('pointer-events-none');
    });
  });

  describe('hide on click', () => {
    it('removes hover classes after click', () => {
      const { container } = render(
        <TooltipCatto content="Tooltip">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const wrapper = container.firstChild as HTMLElement;
      const tooltip = screen.getByRole('tooltip');

      // Before click: has group-hover classes
      expect(tooltip.className).toContain('group-hover/tooltip:opacity-100');

      // Click the wrapper
      fireEvent.click(wrapper);

      // After click: group-hover classes removed
      expect(tooltip.className).not.toContain(
        'group-hover/tooltip:opacity-100',
      );
    });

    it('restores hover classes on next mouse enter', () => {
      const { container } = render(
        <TooltipCatto content="Tooltip">
          <button>Hover</button>
        </TooltipCatto>,
      );

      const wrapper = container.firstChild as HTMLElement;
      const tooltip = screen.getByRole('tooltip');

      // Click to hide
      fireEvent.click(wrapper);
      expect(tooltip.className).not.toContain(
        'group-hover/tooltip:opacity-100',
      );

      // Mouse enter resets
      fireEvent.mouseEnter(wrapper);
      expect(tooltip.className).toContain('group-hover/tooltip:opacity-100');
    });
  });

  describe('arrow', () => {
    it('renders arrow element', () => {
      const { container } = render(
        <TooltipCatto content="Tooltip">
          <button>Hover</button>
        </TooltipCatto>,
      );

      // Arrow has border-4 class
      const arrow = container.querySelector('.border-4');
      expect(arrow).toBeInTheDocument();
    });
  });
});
