// @catto/ui - CartItemCatto Tests
import { describe, expect, it, vi } from 'vitest';
import CartItemCatto from '../../components/CartItem/CartItemCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('CartItemCatto', () => {
  const defaultProps = {
    name: 'Test Product',
    price: 29.99,
    quantity: 2,
  };

  describe('rendering', () => {
    it('renders product name', () => {
      render(<CartItemCatto {...defaultProps} />);
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('renders quantity in breakdown text', () => {
      render(<CartItemCatto {...defaultProps} />);
      // Quantity shown in breakdown: "2 x $29.99"
      expect(screen.getByText(/2 x/)).toBeInTheDocument();
    });

    it('renders line total', () => {
      render(<CartItemCatto {...defaultProps} />);
      // 29.99 * 2 = 59.98
      expect(screen.getByText('$59.98')).toBeInTheDocument();
    });

    it('applies data-testid', () => {
      render(<CartItemCatto {...defaultProps} data-testid="cart-item" />);
      expect(screen.getByTestId('cart-item')).toBeInTheDocument();
    });
  });

  describe('image', () => {
    it('renders product image', () => {
      render(<CartItemCatto {...defaultProps} image="/product.jpg" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', '/product.jpg');
      expect(img).toHaveAttribute('alt', 'Test Product');
    });

    it('shows placeholder when no image', () => {
      const { container } = render(<CartItemCatto {...defaultProps} />);
      const placeholder = container.querySelector('svg');
      expect(placeholder).toBeInTheDocument();
    });

    it('shows placeholder on image error', () => {
      const { container } = render(
        <CartItemCatto {...defaultProps} image="/broken.jpg" />,
      );
      const img = screen.getByRole('img');
      fireEvent.error(img);

      const placeholder = container.querySelector('svg');
      expect(placeholder).toBeInTheDocument();
    });
  });

  describe('price display', () => {
    it('shows unit price', () => {
      render(<CartItemCatto {...defaultProps} />);
      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });

    it('uses custom currency', () => {
      render(<CartItemCatto {...defaultProps} currency="€" />);
      expect(screen.getByText('€29.99')).toBeInTheDocument();
      expect(screen.getByText('€59.98')).toBeInTheDocument();
    });

    it('shows quantity breakdown for multiple items', () => {
      render(<CartItemCatto {...defaultProps} />);
      expect(screen.getByText('2 x $29.99')).toBeInTheDocument();
    });
  });

  describe('variant', () => {
    it('shows variant text when provided', () => {
      render(
        <CartItemCatto {...defaultProps} variant="Size: Large, Color: Blue" />,
      );
      expect(screen.getByText('Size: Large, Color: Blue')).toBeInTheDocument();
    });
  });

  describe('stock status', () => {
    it('shows in stock by default (no message)', () => {
      render(<CartItemCatto {...defaultProps} />);
      expect(screen.queryByText('Out of stock')).not.toBeInTheDocument();
    });

    it('shows out of stock message', () => {
      render(<CartItemCatto {...defaultProps} inStock={false} />);
      expect(screen.getByText('Out of stock')).toBeInTheDocument();
    });

    it('hides quantity selector when out of stock', () => {
      render(
        <CartItemCatto
          {...defaultProps}
          inStock={false}
          onQuantityChange={() => {}}
        />,
      );
      expect(
        screen.queryByRole('button', { name: 'Increase quantity' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('quantity change', () => {
    it('shows quantity selector when onQuantityChange provided', () => {
      render(<CartItemCatto {...defaultProps} onQuantityChange={() => {}} />);
      expect(
        screen.getByRole('button', { name: 'Increase quantity' }),
      ).toBeInTheDocument();
    });

    it('calls onQuantityChange when quantity changes', () => {
      const handleChange = vi.fn();
      render(
        <CartItemCatto {...defaultProps} onQuantityChange={handleChange} />,
      );

      fireEvent.click(
        screen.getByRole('button', { name: 'Increase quantity' }),
      );

      expect(handleChange).toHaveBeenCalledWith(3);
    });

    it('respects maxQuantity', () => {
      render(
        <CartItemCatto
          {...defaultProps}
          quantity={10}
          maxQuantity={10}
          onQuantityChange={() => {}}
        />,
      );
      expect(
        screen.getByRole('button', { name: 'Increase quantity' }),
      ).toBeDisabled();
    });
  });

  describe('remove', () => {
    it('shows remove button when onRemove provided', () => {
      render(<CartItemCatto {...defaultProps} onRemove={() => {}} />);
      expect(
        screen.getByRole('button', { name: 'Remove' }),
      ).toBeInTheDocument();
    });

    it('calls onRemove when clicked', () => {
      const handleRemove = vi.fn();
      render(<CartItemCatto {...defaultProps} onRemove={handleRemove} />);

      fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

      expect(handleRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('save for later', () => {
    it('does not show save for later by default', () => {
      render(<CartItemCatto {...defaultProps} onSaveForLater={() => {}} />);
      expect(
        screen.queryByRole('button', { name: 'Save for later' }),
      ).not.toBeInTheDocument();
    });

    it('shows save for later when enabled', () => {
      render(
        <CartItemCatto
          {...defaultProps}
          showSaveForLater
          onSaveForLater={() => {}}
        />,
      );
      expect(
        screen.getByRole('button', { name: 'Save for later' }),
      ).toBeInTheDocument();
    });

    it('calls onSaveForLater when clicked', () => {
      const handleSave = vi.fn();
      render(
        <CartItemCatto
          {...defaultProps}
          showSaveForLater
          onSaveForLater={handleSave}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Save for later' }));

      expect(handleSave).toHaveBeenCalledTimes(1);
    });
  });

  describe('loading', () => {
    it('applies loading styles', () => {
      render(
        <CartItemCatto {...defaultProps} loading data-testid="cart-item" />,
      );
      const item = screen.getByTestId('cart-item');
      expect(item.className).toContain('opacity-60');
      expect(item.className).toContain('pointer-events-none');
    });

    it('disables buttons when loading', () => {
      render(
        <CartItemCatto
          {...defaultProps}
          loading
          onRemove={() => {}}
          showSaveForLater
          onSaveForLater={() => {}}
        />,
      );

      expect(screen.getByRole('button', { name: 'Remove' })).toBeDisabled();
      expect(
        screen.getByRole('button', { name: 'Save for later' }),
      ).toBeDisabled();
    });
  });

  describe('compact mode', () => {
    it('applies compact styling', () => {
      const { container } = render(<CartItemCatto {...defaultProps} compact />);
      // Compact uses h-16 image instead of h-24
      const imageContainer = container.querySelector('.h-16');
      expect(imageContainer).toBeInTheDocument();
    });

    it('uses smaller quantity selector in compact mode', () => {
      const { container } = render(
        <CartItemCatto {...defaultProps} compact onQuantityChange={() => {}} />,
      );
      // Compact uses sm size which has h-7 buttons
      const smallButton = container.querySelector('.h-7');
      expect(smallButton).toBeInTheDocument();
    });
  });

  describe('className', () => {
    it('applies custom className', () => {
      render(
        <CartItemCatto
          {...defaultProps}
          className="my-cart-item"
          data-testid="cart-item"
        />,
      );
      expect(screen.getByTestId('cart-item').className).toContain(
        'my-cart-item',
      );
    });
  });
});
