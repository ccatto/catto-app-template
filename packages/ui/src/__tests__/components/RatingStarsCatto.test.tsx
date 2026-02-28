// @catto/ui - RatingStarsCatto Tests
import { describe, expect, it, vi } from 'vitest';
import RatingStarsCatto from '../../components/RatingStars/RatingStarsCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('RatingStarsCatto', () => {
  describe('rendering', () => {
    it('renders 5 stars by default', () => {
      const { container } = render(<RatingStarsCatto value={3} />);
      const stars = container.querySelectorAll('svg');
      // Each star has 2 SVGs (empty + filled overlay), so 5 stars = 10 SVGs max
      expect(stars.length).toBeGreaterThanOrEqual(5);
    });

    it('renders custom number of stars', () => {
      render(<RatingStarsCatto value={3} max={10} />);
      expect(
        screen.getByRole('img', { name: /Rating: 3 out of 10/ }),
      ).toBeInTheDocument();
    });

    it('applies data-testid', () => {
      render(<RatingStarsCatto value={3} data-testid="rating" />);
      expect(screen.getByTestId('rating')).toBeInTheDocument();
    });

    it('has aria-label with rating info', () => {
      render(<RatingStarsCatto value={4.5} />);
      expect(
        screen.getByRole('img', { name: 'Rating: 4.5 out of 5 stars' }),
      ).toBeInTheDocument();
    });
  });

  describe('showValue', () => {
    it('shows numeric value when showValue is true', () => {
      render(<RatingStarsCatto value={4.5} showValue />);
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });

    it('formats value to one decimal', () => {
      render(<RatingStarsCatto value={4} showValue />);
      expect(screen.getByText('4.0')).toBeInTheDocument();
    });
  });

  describe('count', () => {
    it('shows review count when provided', () => {
      render(<RatingStarsCatto value={4} count={128} />);
      expect(screen.getByText('(128)')).toBeInTheDocument();
    });

    it('shows both value and count', () => {
      render(<RatingStarsCatto value={4.2} showValue count={50} />);
      expect(screen.getByText('4.2')).toBeInTheDocument();
      expect(screen.getByText('(50)')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('applies xs size', () => {
      const { container } = render(<RatingStarsCatto value={3} size="xs" />);
      const star = container.querySelector('.h-3');
      expect(star).toBeInTheDocument();
    });

    it('applies sm size', () => {
      const { container } = render(<RatingStarsCatto value={3} size="sm" />);
      const star = container.querySelector('.h-4');
      expect(star).toBeInTheDocument();
    });

    it('applies md size by default', () => {
      const { container } = render(<RatingStarsCatto value={3} />);
      const star = container.querySelector('.h-5');
      expect(star).toBeInTheDocument();
    });

    it('applies lg size', () => {
      const { container } = render(<RatingStarsCatto value={3} size="lg" />);
      const star = container.querySelector('.h-6');
      expect(star).toBeInTheDocument();
    });

    it('applies xl size', () => {
      const { container } = render(<RatingStarsCatto value={3} size="xl" />);
      const star = container.querySelector('.h-8');
      expect(star).toBeInTheDocument();
    });
  });

  describe('colors', () => {
    it('applies yellow color by default', () => {
      const { container } = render(<RatingStarsCatto value={3} />);
      const filledStar = container.querySelector('.text-yellow-400');
      expect(filledStar).toBeInTheDocument();
    });

    it('applies orange color', () => {
      const { container } = render(
        <RatingStarsCatto value={3} color="orange" />,
      );
      const filledStar = container.querySelector('.text-orange-400');
      expect(filledStar).toBeInTheDocument();
    });

    it('applies gold color', () => {
      const { container } = render(<RatingStarsCatto value={3} color="gold" />);
      const filledStar = container.querySelector('.text-amber-400');
      expect(filledStar).toBeInTheDocument();
    });
  });

  describe('interactive', () => {
    it('renders as buttons when interactive', () => {
      render(<RatingStarsCatto value={3} interactive onChange={() => {}} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(5);
    });

    it('has radiogroup role when interactive', () => {
      render(<RatingStarsCatto value={3} interactive onChange={() => {}} />);
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('calls onChange when star is clicked', () => {
      const handleChange = vi.fn();
      render(
        <RatingStarsCatto value={2} interactive onChange={handleChange} />,
      );

      // Click the 4th star button
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[3]);

      expect(handleChange).toHaveBeenCalledWith(4);
    });

    it('buttons have accessible labels', () => {
      render(<RatingStarsCatto value={3} interactive onChange={() => {}} />);
      expect(
        screen.getByRole('button', { name: 'Rate 1 out of 5' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Rate 5 out of 5' }),
      ).toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('does not render interactive buttons when disabled', () => {
      const handleChange = vi.fn();
      render(
        <RatingStarsCatto
          value={3}
          interactive
          onChange={handleChange}
          disabled
        />,
      );

      // When disabled, component renders as non-interactive (no buttons)
      expect(screen.queryAllByRole('button')).toHaveLength(0);
      // Should still render as img role (non-interactive)
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  describe('partial stars', () => {
    it('shows partial fill for decimal values', () => {
      const { container } = render(<RatingStarsCatto value={3.5} />);
      // The 4th star should have a partial fill (50%)
      const partialOverlay = container.querySelector('[style*="width: 50%"]');
      expect(partialOverlay).toBeInTheDocument();
    });

    it('shows full fill for integer values', () => {
      const { container } = render(<RatingStarsCatto value={3} />);
      // First 3 stars should have 100% fill
      const fullOverlays = container.querySelectorAll('[style*="width: 100%"]');
      expect(fullOverlays.length).toBe(3);
    });
  });

  describe('className', () => {
    it('applies custom className', () => {
      render(
        <RatingStarsCatto
          value={3}
          className="my-rating"
          data-testid="rating"
        />,
      );
      expect(screen.getByTestId('rating').className).toContain('my-rating');
    });
  });
});
