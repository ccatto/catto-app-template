// @catto/ui - CarouselCatto Tests
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CarouselCatto from '../../components/Carousel/CarouselCatto';
import { act, fireEvent, render, screen } from '../test-utils';

const mockImages = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg',
];

describe('CarouselCatto', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders all images', () => {
      const { container } = render(<CarouselCatto images={mockImages} />);

      const imageSlides = container.querySelectorAll(
        '[style*="background-image"]',
      );
      expect(imageSlides).toHaveLength(3);
    });

    it('renders navigation buttons', () => {
      render(<CarouselCatto images={mockImages} />);

      expect(
        screen.getByRole('button', { name: 'Previous slide' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Next slide' }),
      ).toBeInTheDocument();
    });

    it('applies custom width class', () => {
      const { container } = render(
        <CarouselCatto images={mockImages} width="w-[600px]" />,
      );

      const carousel = container.firstChild as HTMLElement;
      expect(carousel.className).toContain('w-[600px]');
    });

    it('applies custom height class', () => {
      const { container } = render(
        <CarouselCatto images={mockImages} height="h-[400px]" />,
      );

      const carousel = container.firstChild as HTMLElement;
      expect(carousel.className).toContain('h-[400px]');
    });

    it('applies default width and height', () => {
      const { container } = render(<CarouselCatto images={mockImages} />);

      const carousel = container.firstChild as HTMLElement;
      expect(carousel.className).toContain('w-[500px]');
      expect(carousel.className).toContain('h-[300px]');
    });
  });

  describe('manual navigation', () => {
    it('navigates to next slide on next button click', () => {
      const { container } = render(<CarouselCatto images={mockImages} />);

      const nextButton = screen.getByRole('button', { name: 'Next slide' });
      const slidesContainer = container.querySelector('.flex') as HTMLElement;

      // Initially at index 0
      expect(slidesContainer.style.transform).toBe('translateX(-0%)');

      fireEvent.click(nextButton);

      // Should be at index 1
      expect(slidesContainer.style.transform).toBe('translateX(-100%)');
    });

    it('navigates to previous slide on previous button click', () => {
      const { container } = render(<CarouselCatto images={mockImages} />);

      const nextButton = screen.getByRole('button', { name: 'Next slide' });
      const prevButton = screen.getByRole('button', { name: 'Previous slide' });
      const slidesContainer = container.querySelector('.flex') as HTMLElement;

      // Go to second slide
      fireEvent.click(nextButton);
      expect(slidesContainer.style.transform).toBe('translateX(-100%)');

      // Go back to first slide
      fireEvent.click(prevButton);
      expect(slidesContainer.style.transform).toBe('translateX(-0%)');
    });

    it('wraps around from last to first slide', () => {
      const { container } = render(<CarouselCatto images={mockImages} />);

      const nextButton = screen.getByRole('button', { name: 'Next slide' });
      const slidesContainer = container.querySelector('.flex') as HTMLElement;

      // Go through all slides
      fireEvent.click(nextButton); // index 1
      fireEvent.click(nextButton); // index 2
      fireEvent.click(nextButton); // index 0 (wrapped)

      expect(slidesContainer.style.transform).toBe('translateX(-0%)');
    });

    it('wraps around from first to last slide', () => {
      const { container } = render(<CarouselCatto images={mockImages} />);

      const prevButton = screen.getByRole('button', { name: 'Previous slide' });
      const slidesContainer = container.querySelector('.flex') as HTMLElement;

      // Go to last slide from first
      fireEvent.click(prevButton);

      // Should be at last index (2)
      expect(slidesContainer.style.transform).toBe('translateX(-200%)');
    });
  });

  describe('auto-advance', () => {
    it('auto-advances after interval', () => {
      const { container } = render(
        <CarouselCatto images={mockImages} interval={3000} />,
      );

      const slidesContainer = container.querySelector('.flex') as HTMLElement;

      // Initially at index 0
      expect(slidesContainer.style.transform).toBe('translateX(-0%)');

      // Advance timer by 3 seconds
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // Should be at index 1
      expect(slidesContainer.style.transform).toBe('translateX(-100%)');
    });

    it('uses custom interval', () => {
      const { container } = render(
        <CarouselCatto images={mockImages} interval={5000} />,
      );

      const slidesContainer = container.querySelector('.flex') as HTMLElement;

      // Advance timer by 3 seconds (less than interval)
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // Should still be at index 0
      expect(slidesContainer.style.transform).toBe('translateX(-0%)');

      // Advance to 5 seconds
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Now should be at index 1
      expect(slidesContainer.style.transform).toBe('translateX(-100%)');
    });

    it('resets auto-advance timer on manual navigation', () => {
      const { container } = render(
        <CarouselCatto images={mockImages} interval={3000} />,
      );

      const nextButton = screen.getByRole('button', { name: 'Next slide' });
      const slidesContainer = container.querySelector('.flex') as HTMLElement;

      // Advance timer by 2 seconds
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Manually navigate
      fireEvent.click(nextButton);
      expect(slidesContainer.style.transform).toBe('translateX(-100%)');

      // Advance timer by 2 more seconds (total would be 4s if timer wasn't reset)
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Should still be at index 1 (timer was reset)
      expect(slidesContainer.style.transform).toBe('translateX(-100%)');

      // Advance timer by 1 more second (total 3s since manual nav)
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Now should auto-advance to index 2
      expect(slidesContainer.style.transform).toBe('translateX(-200%)');
    });
  });

  describe('custom className', () => {
    it('merges custom className', () => {
      const { container } = render(
        <CarouselCatto images={mockImages} className="my-custom-class" />,
      );

      const carousel = container.firstChild as HTMLElement;
      expect(carousel.className).toContain('my-custom-class');
    });
  });

  describe('single image', () => {
    it('renders with single image', () => {
      const { container } = render(
        <CarouselCatto images={['https://example.com/single.jpg']} />,
      );

      const imageSlides = container.querySelectorAll(
        '[style*="background-image"]',
      );
      expect(imageSlides).toHaveLength(1);
    });
  });

  describe('styling', () => {
    it('has overflow hidden', () => {
      const { container } = render(<CarouselCatto images={mockImages} />);

      const carousel = container.firstChild as HTMLElement;
      expect(carousel.className).toContain('overflow-hidden');
    });

    it('has transition on slides container', () => {
      const { container } = render(<CarouselCatto images={mockImages} />);

      const slidesContainer = container.querySelector('.flex') as HTMLElement;
      expect(slidesContainer.className).toContain('transition-transform');
    });
  });
});
