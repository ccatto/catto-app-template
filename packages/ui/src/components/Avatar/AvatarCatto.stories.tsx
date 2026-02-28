import type { Meta, StoryObj } from '@storybook/react';
import AvatarCatto from './AvatarCatto';

const meta = {
  title: 'Components/Avatar',
  component: AvatarCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    shape: {
      control: 'select',
      options: ['circle', 'rounded', 'square'],
    },
    status: {
      control: 'select',
      options: [undefined, 'online', 'offline', 'away', 'busy'],
    },
  },
} satisfies Meta<typeof AvatarCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// Basic Usage
// ============================================

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    alt: 'User avatar',
    name: 'John Doe',
  },
};

export const WithInitials: Story = {
  args: {
    name: 'John Doe',
  },
};

export const FallbackToInitials: Story = {
  args: {
    src: 'https://invalid-url.com/avatar.jpg',
    name: 'Jane Smith',
  },
};

// ============================================
// Sizes
// ============================================

export const ExtraSmall: Story = {
  args: {
    name: 'XS User',
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    name: 'Small User',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    name: 'Medium User',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    name: 'Large User',
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    name: 'XL User',
    size: 'xl',
  },
};

export const DoubleExtraLarge: Story = {
  args: {
    name: '2XL User',
    size: '2xl',
  },
};

// ============================================
// Shapes
// ============================================

export const Circle: Story = {
  args: {
    name: 'Circle Shape',
    shape: 'circle',
    size: 'lg',
  },
};

export const Rounded: Story = {
  args: {
    name: 'Rounded Shape',
    shape: 'rounded',
    size: 'lg',
  },
};

export const Square: Story = {
  args: {
    name: 'Square Shape',
    shape: 'square',
    size: 'lg',
  },
};

// ============================================
// Status Indicators
// ============================================

export const Online: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=2',
    name: 'Online User',
    status: 'online',
    size: 'lg',
  },
};

export const Offline: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=3',
    name: 'Offline User',
    status: 'offline',
    size: 'lg',
  },
};

export const Away: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=4',
    name: 'Away User',
    status: 'away',
    size: 'lg',
  },
};

export const Busy: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=5',
    name: 'Busy User',
    status: 'busy',
    size: 'lg',
  },
};

// ============================================
// With Ring
// ============================================

export const WithRing: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=6',
    name: 'Ringed Avatar',
    ring: true,
    size: 'lg',
  },
};

// ============================================
// All Sizes
// ============================================

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <AvatarCatto name="XS" size="xs" />
      <AvatarCatto name="SM" size="sm" />
      <AvatarCatto name="MD" size="md" />
      <AvatarCatto name="LG" size="lg" />
      <AvatarCatto name="XL" size="xl" />
      <AvatarCatto name="2X" size="2xl" />
    </div>
  ),
};

// ============================================
// All Statuses
// ============================================

export const AllStatuses: Story = {
  render: () => (
    <div className="flex gap-4">
      <AvatarCatto name="Online" status="online" size="lg" />
      <AvatarCatto name="Offline" status="offline" size="lg" />
      <AvatarCatto name="Away" status="away" size="lg" />
      <AvatarCatto name="Busy" status="busy" size="lg" />
    </div>
  ),
};
