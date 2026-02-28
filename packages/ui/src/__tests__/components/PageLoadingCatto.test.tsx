// @catto/ui - PageLoadingCatto Tests
import { describe, expect, it } from 'vitest';
import PageLoadingCatto from '../../components/Loading/PageLoadingCatto';
import { render, screen } from '../test-utils';

describe('PageLoadingCatto', () => {
  describe('rendering', () => {
    it('renders spinner', () => {
      const { container } = render(<PageLoadingCatto />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with orange color', () => {
      const { container } = render(<PageLoadingCatto />);

      const svg = container.querySelector('svg.text-orange-500');
      expect(svg).toBeInTheDocument();
    });

    it('has bounce animation', () => {
      const { container } = render(<PageLoadingCatto />);

      // Class is animate-[bounce_1s_infinite]
      const animatedDiv = container.querySelector('[class*="animate-"]');
      expect(animatedDiv?.className).toContain('bounce');
    });

    it('has spin animation', () => {
      const { container } = render(<PageLoadingCatto />);

      const svg = container.querySelector('svg.animate-spin');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('message', () => {
    it('does not render message by default', () => {
      const { container } = render(<PageLoadingCatto />);

      expect(container.querySelector('p')).not.toBeInTheDocument();
    });

    it('renders message when provided', () => {
      render(<PageLoadingCatto message="Loading data..." />);

      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });
  });

  describe('minHeight', () => {
    it('applies screen height by default', () => {
      const { container } = render(<PageLoadingCatto />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('min-h-screen');
    });

    it('applies full height when specified', () => {
      const { container } = render(<PageLoadingCatto minHeight="full" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('min-h-full');
      expect(wrapper.className).toContain('h-full');
    });

    it('applies auto height when specified', () => {
      const { container } = render(<PageLoadingCatto minHeight="auto" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('min-h-full');
    });

    it('has background when minHeight is screen', () => {
      const { container } = render(<PageLoadingCatto minHeight="screen" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('bg-slate-50');
    });

    it('has no background when minHeight is auto', () => {
      const { container } = render(<PageLoadingCatto minHeight="auto" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).not.toContain('bg-slate-50');
    });
  });

  describe('showLogo', () => {
    it('does not show logo by default', () => {
      const { container } = render(<PageLoadingCatto />);

      const logoSvg = container.querySelector('text');
      expect(logoSvg).not.toBeInTheDocument();
    });

    it('shows Rz logo when showLogo is true', () => {
      const { container } = render(<PageLoadingCatto showLogo />);

      const logoText = container.querySelector('text');
      expect(logoText).toBeInTheDocument();
      expect(logoText?.textContent).toBe('Rz');
    });

    it('applies larger size when showLogo is true', () => {
      const { container } = render(<PageLoadingCatto showLogo />);

      const spinner = container.querySelector('[class*="h-24"]');
      expect(spinner).toBeInTheDocument();
    });

    it('applies standard size when showLogo is false', () => {
      const { container } = render(<PageLoadingCatto />);

      const spinner = container.querySelector('[class*="h-16"]');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('layout', () => {
    it('centers content vertically and horizontally', () => {
      const { container } = render(<PageLoadingCatto />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('flex');
      expect(wrapper.className).toContain('items-center');
      expect(wrapper.className).toContain('justify-center');
    });

    it('has text-center for spinner container', () => {
      const { container } = render(<PageLoadingCatto />);

      const textCenter = container.querySelector('.text-center');
      expect(textCenter).toBeInTheDocument();
    });
  });
});
