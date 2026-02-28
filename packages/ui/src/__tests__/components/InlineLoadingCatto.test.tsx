// @catto/ui - InlineLoadingCatto Tests
import { describe, expect, it } from 'vitest';
import InlineLoadingCatto from '../../components/Loading/InlineLoadingCatto';
import { render, screen } from '../test-utils';

describe('InlineLoadingCatto', () => {
  describe('rendering', () => {
    it('renders spinner', () => {
      const { container } = render(<InlineLoadingCatto />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with orange color', () => {
      const { container } = render(<InlineLoadingCatto />);

      const svg = container.querySelector('svg.text-orange-500');
      expect(svg).toBeInTheDocument();
    });

    it('has bounce animation', () => {
      const { container } = render(<InlineLoadingCatto />);

      // Class is animate-[bounce_1s_infinite]
      const animatedDiv = container.querySelector('[class*="animate-"]');
      expect(animatedDiv?.className).toContain('bounce');
    });

    it('has spin animation', () => {
      const { container } = render(<InlineLoadingCatto />);

      const svg = container.querySelector('svg.animate-spin');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('message', () => {
    it('does not render message by default', () => {
      const { container } = render(<InlineLoadingCatto />);

      expect(container.querySelector('p')).not.toBeInTheDocument();
    });

    it('renders message when provided', () => {
      render(<InlineLoadingCatto message="Loading data..." />);

      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('applies small size', () => {
      const { container } = render(<InlineLoadingCatto size="sm" />);

      const spinner = container.querySelector('.h-5.w-5');
      expect(spinner).toBeInTheDocument();
    });

    it('applies medium size by default', () => {
      const { container } = render(<InlineLoadingCatto />);

      const spinner = container.querySelector('.h-8.w-8');
      expect(spinner).toBeInTheDocument();
    });

    it('applies large size', () => {
      const { container } = render(<InlineLoadingCatto size="lg" />);

      const spinner = container.querySelector('.h-12.w-12');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('padding', () => {
    it('applies no padding when set to none', () => {
      const { container } = render(<InlineLoadingCatto padding="none" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).not.toContain('py-');
    });

    it('applies small padding', () => {
      const { container } = render(<InlineLoadingCatto padding="sm" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('py-4');
    });

    it('applies medium padding by default', () => {
      const { container } = render(<InlineLoadingCatto />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('py-8');
    });

    it('applies large padding', () => {
      const { container } = render(<InlineLoadingCatto padding="lg" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('py-12');
    });
  });

  describe('layout', () => {
    it('applies horizontal layout by default', () => {
      const { container } = render(<InlineLoadingCatto message="Loading" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('flex-row');
      expect(wrapper.className).toContain('space-x-3');
    });

    it('applies vertical layout when specified', () => {
      const { container } = render(
        <InlineLoadingCatto message="Loading" layout="vertical" />,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('flex-col');
      expect(wrapper.className).toContain('space-y-3');
    });
  });

  describe('showLogo', () => {
    it('does not show logo by default', () => {
      const { container } = render(<InlineLoadingCatto />);

      const logoText = container.querySelector('text');
      expect(logoText).not.toBeInTheDocument();
    });

    it('shows Rz logo when showLogo is true', () => {
      const { container } = render(<InlineLoadingCatto showLogo />);

      const logoText = container.querySelector('text');
      expect(logoText).toBeInTheDocument();
      expect(logoText?.textContent).toBe('Rz');
    });

    it('uses large size when showLogo is true', () => {
      const { container } = render(<InlineLoadingCatto showLogo />);

      // When showLogo is true, effectiveSize becomes 'lg' which maps to h-12 w-12
      const spinner = container.querySelector('.h-12.w-12');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('centering', () => {
    it('centers content', () => {
      const { container } = render(<InlineLoadingCatto />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('items-center');
      expect(wrapper.className).toContain('justify-center');
    });
  });
});
