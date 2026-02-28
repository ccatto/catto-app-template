import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ProductCardCatto from './ProductCardCatto';

const meta = {
  title: 'E-commerce/ProductCard',
  component: ProductCardCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    badgeVariant: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info', 'default'],
    },
  },
  args: {
    onClick: fn(),
    onActionClick: fn(),
    onWishlistToggle: fn(),
  },
} satisfies Meta<typeof ProductCardCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Premium Wireless Headphones',
    description:
      'High-quality wireless headphones with active noise cancellation and 30-hour battery life.',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    price: 199.99,
    rating: 4.5,
    reviewCount: 128,
    category: 'Electronics',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px' }}>
        <Story />
      </div>
    ),
  ],
};

export const OnSale: Story = {
  args: {
    name: 'Running Shoes Pro',
    description: 'Lightweight running shoes with responsive cushioning.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviewCount: 256,
    category: 'Footwear',
    badge: 'Sale',
    badgeVariant: 'error',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px' }}>
        <Story />
      </div>
    ),
  ],
};

export const NewProduct: Story = {
  args: {
    name: 'Smart Watch Series X',
    description: 'Advanced smartwatch with health monitoring.',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    price: 349.99,
    rating: 5.0,
    reviewCount: 42,
    category: 'Wearables',
    badge: 'New',
    badgeVariant: 'success',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px' }}>
        <Story />
      </div>
    ),
  ],
};

export const OutOfStock: Story = {
  args: {
    name: 'Limited Edition Sneakers',
    description: 'Exclusive limited edition sneakers.',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    price: 249.99,
    rating: 4.9,
    reviewCount: 89,
    category: 'Footwear',
    inStock: false,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithWishlist: Story = {
  args: {
    name: 'Designer Handbag',
    description: 'Luxury leather handbag.',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
    price: 599.99,
    rating: 4.7,
    reviewCount: 64,
    category: 'Accessories',
    showWishlist: true,
    isWishlisted: false,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Wishlisted: Story = {
  args: {
    name: 'Designer Handbag',
    description: 'Luxury leather handbag.',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
    price: 599.99,
    rating: 4.7,
    reviewCount: 64,
    category: 'Accessories',
    showWishlist: true,
    isWishlisted: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Horizontal: Story = {
  args: {
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with 360-degree sound.',
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    price: 89.99,
    rating: 4.3,
    reviewCount: 312,
    category: 'Audio',
    orientation: 'horizontal',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export const NoImage: Story = {
  args: {
    name: 'Mystery Product',
    description: 'A product without an image.',
    price: 49.99,
    rating: 4.0,
    reviewCount: 15,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithAddToCart: Story = {
  args: {
    name: 'Coffee Maker',
    description: 'Automatic drip coffee maker with programmable timer.',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    price: 129.99,
    rating: 4.6,
    reviewCount: 445,
    category: 'Kitchen',
    actionText: 'Add to Cart',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Loading: Story = {
  args: {
    name: 'Coffee Maker',
    description: 'Automatic drip coffee maker.',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    price: 129.99,
    rating: 4.6,
    reviewCount: 445,
    loading: true,
    actionText: 'Add to Cart',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px' }}>
        <Story />
      </div>
    ),
  ],
};
