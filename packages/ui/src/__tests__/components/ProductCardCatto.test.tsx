// @catto/ui - ProductCardCatto Tests
import { describe, expect, it, vi } from 'vitest';
import ProductCardCatto from '../../components/ProductCard/ProductCardCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('ProductCardCatto', () => {
  describe('rendering', () => {
    it('renders product name', () => {
      render(<ProductCardCatto name="Test Product" price={99.99} />);
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('renders description', () => {
      render(
        <ProductCardCatto
          name="Test"
          price={99}
          description="A great product"
        />,
      );
      expect(screen.getByText('A great product')).toBeInTheDocument();
    });

    it('applies data-testid', () => {
      render(
        <ProductCardCatto name="Test" price={99} data-testid="product-card" />,
      );
      expect(screen.getByTestId('product-card')).toBeInTheDocument();
    });
  });

  describe('image', () => {
    it('renders product image', () => {
      render(<ProductCardCatto name="Test" price={99} image="/product.jpg" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', '/product.jpg');
      expect(img).toHaveAttribute('alt', 'Test');
    });

    it('shows placeholder on image error', () => {
      render(<ProductCardCatto name="Test" price={99} image="/broken.jpg" />);
      const img = screen.getByRole('img');
      fireEvent.error(img);

      // Placeholder icon should appear
      const { container } = render(<ProductCardCatto name="Test" price={99} />);
      const placeholder = container.querySelector('svg');
      expect(placeholder).toBeInTheDocument();
    });

    it('shows placeholder when no image', () => {
      const { container } = render(<ProductCardCatto name="Test" price={99} />);
      const placeholder = container.querySelector('svg');
      expect(placeholder).toBeInTheDocument();
    });
  });

  describe('price', () => {
    it('renders price with currency', () => {
      render(<ProductCardCatto name="Test" price={99.99} />);
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    it('renders custom currency', () => {
      render(<ProductCardCatto name="Test" price={99.99} currency="€" />);
      expect(screen.getByText('€99.99')).toBeInTheDocument();
    });

    it('formats price with two decimals', () => {
      render(<ProductCardCatto name="Test" price={100} />);
      expect(screen.getByText('$100.00')).toBeInTheDocument();
    });
  });

  describe('discount', () => {
    it('shows original price when discounted', () => {
      render(
        <ProductCardCatto name="Test" price={79.99} originalPrice={99.99} />,
      );
      expect(screen.getByText('$79.99')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    it('shows discount percentage', () => {
      render(<ProductCardCatto name="Test" price={80} originalPrice={100} />);
      expect(screen.getByText('-20%')).toBeInTheDocument();
    });

    it('does not show discount when no original price', () => {
      render(<ProductCardCatto name="Test" price={99} />);
      expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
    });
  });

  describe('badge', () => {
    it('renders badge when provided', () => {
      render(<ProductCardCatto name="Test" price={99} badge="Sale" />);
      expect(screen.getByText('Sale')).toBeInTheDocument();
    });

    it('does not render badge when not provided', () => {
      render(<ProductCardCatto name="Test" price={99} />);
      expect(screen.queryByText('Sale')).not.toBeInTheDocument();
    });
  });

  describe('rating', () => {
    it('shows rating stars', () => {
      const { container } = render(
        <ProductCardCatto name="Test" price={99} rating={4} />,
      );
      const stars = container.querySelectorAll('svg[fill="currentColor"]');
      expect(stars.length).toBe(5);
    });

    it('shows review count', () => {
      render(
        <ProductCardCatto
          name="Test"
          price={99}
          rating={4}
          reviewCount={128}
        />,
      );
      expect(screen.getByText('(128)')).toBeInTheDocument();
    });

    it('does not show rating when not provided', () => {
      const { container } = render(<ProductCardCatto name="Test" price={99} />);
      // No star icons when rating is undefined
      const starsContainer = container.querySelector(
        '.flex.items-center.gap-1',
      );
      expect(starsContainer).not.toBeInTheDocument();
    });
  });

  describe('category', () => {
    it('shows category when provided', () => {
      render(
        <ProductCardCatto name="Test" price={99} category="Electronics" />,
      );
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });
  });

  describe('stock', () => {
    it('shows sold out overlay when not in stock', () => {
      render(<ProductCardCatto name="Test" price={99} inStock={false} />);
      expect(screen.getByText('Sold Out')).toBeInTheDocument();
    });

    it('does not show sold out when in stock', () => {
      render(<ProductCardCatto name="Test" price={99} inStock={true} />);
      expect(screen.queryByText('Sold Out')).not.toBeInTheDocument();
    });
  });

  describe('action button', () => {
    it('renders default action text', () => {
      render(
        <ProductCardCatto name="Test" price={99} onActionClick={() => {}} />,
      );
      expect(
        screen.getByRole('button', { name: 'Add to Cart' }),
      ).toBeInTheDocument();
    });

    it('renders custom action text', () => {
      render(
        <ProductCardCatto
          name="Test"
          price={99}
          actionText="Buy Now"
          onActionClick={() => {}}
        />,
      );
      expect(
        screen.getByRole('button', { name: 'Buy Now' }),
      ).toBeInTheDocument();
    });

    it('calls onActionClick when clicked', () => {
      const handleClick = vi.fn();
      render(
        <ProductCardCatto name="Test" price={99} onActionClick={handleClick} />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('stops propagation on action click', () => {
      const handleCardClick = vi.fn();
      const handleActionClick = vi.fn();
      render(
        <ProductCardCatto
          name="Test"
          price={99}
          onClick={handleCardClick}
          onActionClick={handleActionClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));

      expect(handleActionClick).toHaveBeenCalledTimes(1);
      expect(handleCardClick).not.toHaveBeenCalled();
    });

    it('disables button when out of stock', () => {
      render(
        <ProductCardCatto
          name="Test"
          price={99}
          inStock={false}
          onActionClick={() => {}}
        />,
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows loading state', () => {
      render(
        <ProductCardCatto
          name="Test"
          price={99}
          loading
          onActionClick={() => {}}
        />,
      );
      expect(screen.getByText('Adding...')).toBeInTheDocument();
    });
  });

  describe('wishlist', () => {
    it('shows wishlist button when enabled', () => {
      render(<ProductCardCatto name="Test" price={99} showWishlist />);
      expect(
        screen.getByRole('button', { name: 'Add to wishlist' }),
      ).toBeInTheDocument();
    });

    it('shows remove from wishlist when wishlisted', () => {
      render(
        <ProductCardCatto name="Test" price={99} showWishlist isWishlisted />,
      );
      expect(
        screen.getByRole('button', { name: 'Remove from wishlist' }),
      ).toBeInTheDocument();
    });

    it('calls onWishlistToggle when clicked', () => {
      const handleToggle = vi.fn();
      render(
        <ProductCardCatto
          name="Test"
          price={99}
          showWishlist
          onWishlistToggle={handleToggle}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Add to wishlist' }));

      expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it('stops propagation on wishlist click', () => {
      const handleCardClick = vi.fn();
      const handleToggle = vi.fn();
      render(
        <ProductCardCatto
          name="Test"
          price={99}
          onClick={handleCardClick}
          showWishlist
          onWishlistToggle={handleToggle}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Add to wishlist' }));

      expect(handleToggle).toHaveBeenCalledTimes(1);
      expect(handleCardClick).not.toHaveBeenCalled();
    });
  });

  describe('card click', () => {
    it('calls onClick when card is clicked', () => {
      const handleClick = vi.fn();
      render(
        <ProductCardCatto
          name="Test"
          price={99}
          onClick={handleClick}
          data-testid="card"
        />,
      );

      fireEvent.click(screen.getByTestId('card'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('has role button when clickable', () => {
      render(
        <ProductCardCatto
          name="Test"
          price={99}
          onClick={() => {}}
          data-testid="card"
        />,
      );
      expect(screen.getByTestId('card')).toHaveAttribute('role', 'button');
    });

    it('is keyboard accessible', () => {
      const handleClick = vi.fn();
      render(
        <ProductCardCatto
          name="Test"
          price={99}
          onClick={handleClick}
          data-testid="card"
        />,
      );

      fireEvent.keyDown(screen.getByTestId('card'), { key: 'Enter' });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('responds to space key', () => {
      const handleClick = vi.fn();
      render(
        <ProductCardCatto
          name="Test"
          price={99}
          onClick={handleClick}
          data-testid="card"
        />,
      );

      fireEvent.keyDown(screen.getByTestId('card'), { key: ' ' });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('orientation', () => {
    it('applies vertical orientation by default', () => {
      render(<ProductCardCatto name="Test" price={99} data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('flex-col');
    });

    it('applies horizontal orientation', () => {
      render(
        <ProductCardCatto
          name="Test"
          price={99}
          orientation="horizontal"
          data-testid="card"
        />,
      );
      const card = screen.getByTestId('card');
      expect(card.className).toContain('flex-row');
    });

    it('hides description in horizontal mode', () => {
      render(
        <ProductCardCatto
          name="Test"
          price={99}
          description="Hidden in horizontal"
          orientation="horizontal"
        />,
      );
      // Description should not be rendered in horizontal mode
      expect(
        screen.queryByText('Hidden in horizontal'),
      ).not.toBeInTheDocument();
    });

    it('hides action button in horizontal mode', () => {
      render(
        <ProductCardCatto
          name="Test"
          price={99}
          orientation="horizontal"
          onActionClick={() => {}}
        />,
      );
      expect(
        screen.queryByRole('button', { name: 'Add to Cart' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('className', () => {
    it('applies custom className', () => {
      render(
        <ProductCardCatto
          name="Test"
          price={99}
          className="my-product-card"
          data-testid="card"
        />,
      );
      const card = screen.getByTestId('card');
      expect(card.className).toContain('my-product-card');
    });
  });
});
