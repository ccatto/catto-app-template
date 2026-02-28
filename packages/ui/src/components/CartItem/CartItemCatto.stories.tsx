import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import CartItemCatto from './CartItemCatto';

const meta = {
  title: 'E-commerce/CartItem',
  component: CartItemCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    onQuantityChange: fn(),
    onRemove: fn(),
    onSaveForLater: fn(),
  },
} satisfies Meta<typeof CartItemCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Premium Wireless Headphones',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
    price: 199.99,
    quantity: 1,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithVariant: Story = {
  args: {
    name: 'Running Shoes Pro',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
    price: 129.99,
    quantity: 1,
    variant: 'Size: 10, Color: Black',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export const MultipleQuantity: Story = {
  args: {
    name: 'Coffee Beans Premium',
    image:
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop',
    price: 24.99,
    quantity: 3,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export const OutOfStock: Story = {
  args: {
    name: 'Limited Edition Sneakers',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop',
    price: 249.99,
    quantity: 1,
    inStock: false,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithSaveForLater: Story = {
  args: {
    name: 'Bluetooth Speaker',
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop',
    price: 89.99,
    quantity: 1,
    showSaveForLater: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Compact: Story = {
  args: {
    name: 'USB-C Cable 6ft',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
    price: 14.99,
    quantity: 2,
    compact: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Loading: Story = {
  args: {
    name: 'Smart Watch Series X',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
    price: 349.99,
    quantity: 1,
    loading: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export const NoImage: Story = {
  args: {
    name: 'Digital Download - Software License',
    price: 99.99,
    quantity: 1,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export const MaxQuantity: Story = {
  args: {
    name: 'Limited Stock Item',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
    price: 59.99,
    quantity: 5,
    maxQuantity: 5,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export const CartList: Story = {
  render: () => (
    <div className="space-y-0" style={{ width: '600px' }}>
      <CartItemCatto
        name="Premium Headphones"
        image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"
        price={199.99}
        quantity={1}
        onQuantityChange={() => {}}
        onRemove={() => {}}
      />
      <CartItemCatto
        name="Running Shoes"
        image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop"
        price={129.99}
        quantity={1}
        variant="Size: 10"
        onQuantityChange={() => {}}
        onRemove={() => {}}
      />
      <CartItemCatto
        name="Coffee Beans"
        image="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop"
        price={24.99}
        quantity={2}
        onQuantityChange={() => {}}
        onRemove={() => {}}
        showSaveForLater
        onSaveForLater={() => {}}
      />
    </div>
  ),
};
