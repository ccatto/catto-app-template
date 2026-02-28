// @catto/ui - SkeletonBaseCatto Tests
import { describe, expect, it } from 'vitest';
import SkeletonBaseCatto from '../../components/Skeleton/SkeletonBaseCatto';
import { render } from '../test-utils';

describe('SkeletonBaseCatto', () => {
  describe('rendering', () => {
    it('renders a div element', () => {
      const { container } = render(<SkeletonBaseCatto />);

      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild?.nodeName).toBe('DIV');
    });

    it('has aria-hidden true', () => {
      const { container } = render(<SkeletonBaseCatto />);

      expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    });

    it('has role presentation', () => {
      const { container } = render(<SkeletonBaseCatto />);

      expect(container.firstChild).toHaveAttribute('role', 'presentation');
    });

    it('applies base gray background', () => {
      const { container } = render(<SkeletonBaseCatto />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('bg-gray-200');
    });
  });

  describe('width', () => {
    it('applies full width by default', () => {
      const { container } = render(<SkeletonBaseCatto />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('w-full');
    });

    it('applies 3/4 width', () => {
      const { container } = render(<SkeletonBaseCatto width="3/4" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('w-3/4');
    });

    it('applies 1/2 width', () => {
      const { container } = render(<SkeletonBaseCatto width="1/2" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('w-1/2');
    });

    it('applies 1/4 width', () => {
      const { container } = render(<SkeletonBaseCatto width="1/4" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('w-1/4');
    });

    it('applies numeric width as inline style', () => {
      const { container } = render(<SkeletonBaseCatto width={200} />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.width).toBe('200px');
    });
  });

  describe('height', () => {
    it('applies medium height by default', () => {
      const { container } = render(<SkeletonBaseCatto />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('h-4');
    });

    it('applies xs height', () => {
      const { container } = render(<SkeletonBaseCatto height="xs" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('h-2');
    });

    it('applies sm height', () => {
      const { container } = render(<SkeletonBaseCatto height="sm" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('h-3');
    });

    it('applies lg height', () => {
      const { container } = render(<SkeletonBaseCatto height="lg" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('h-6');
    });

    it('applies xl height', () => {
      const { container } = render(<SkeletonBaseCatto height="xl" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('h-8');
    });

    it('applies numeric height as inline style', () => {
      const { container } = render(<SkeletonBaseCatto height={50} />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.height).toBe('50px');
    });
  });

  describe('rounded', () => {
    it('applies medium rounded by default', () => {
      const { container } = render(<SkeletonBaseCatto />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('rounded');
    });

    it('applies no rounded', () => {
      const { container } = render(<SkeletonBaseCatto rounded="none" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('rounded-none');
    });

    it('applies small rounded', () => {
      const { container } = render(<SkeletonBaseCatto rounded="sm" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('rounded-sm');
    });

    it('applies large rounded', () => {
      const { container } = render(<SkeletonBaseCatto rounded="lg" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('rounded-lg');
    });

    it('applies full rounded', () => {
      const { container } = render(<SkeletonBaseCatto rounded="full" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('rounded-full');
    });
  });

  describe('animation', () => {
    it('has shimmer animation by default', () => {
      const { container } = render(<SkeletonBaseCatto />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('animate-shimmer');
      expect(skeleton.className).toContain('bg-gradient-to-r');
    });

    it('disables animation when animate is false', () => {
      const { container } = render(<SkeletonBaseCatto animate={false} />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).not.toContain('animate-shimmer');
      expect(skeleton.className).not.toContain('bg-gradient-to-r');
    });
  });

  describe('custom className', () => {
    it('applies custom className', () => {
      const { container } = render(
        <SkeletonBaseCatto className="my-custom-class" />,
      );

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('my-custom-class');
    });
  });
});
