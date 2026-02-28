import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import RatingStarsCatto from './RatingStarsCatto';

const meta = {
  title: 'E-commerce/RatingStars',
  component: RatingStarsCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['yellow', 'orange', 'gold'],
    },
    precision: {
      control: 'select',
      options: ['full', 'half'],
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof RatingStarsCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// Display Mode
// ============================================

export const Default: Story = {
  args: {
    value: 4,
  },
};

export const PartialStar: Story = {
  args: {
    value: 3.5,
  },
};

export const PreciseFill: Story = {
  args: {
    value: 4.2,
  },
};

export const WithValue: Story = {
  args: {
    value: 4.5,
    showValue: true,
  },
};

export const WithCount: Story = {
  args: {
    value: 4.2,
    count: 128,
  },
};

export const WithValueAndCount: Story = {
  args: {
    value: 4.7,
    showValue: true,
    count: 256,
  },
};

// ============================================
// Sizes
// ============================================

export const ExtraSmall: Story = {
  args: {
    value: 4,
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    value: 4,
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    value: 4,
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    value: 4,
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    value: 4,
    size: 'xl',
  },
};

// ============================================
// Colors
// ============================================

export const Yellow: Story = {
  args: {
    value: 4,
    color: 'yellow',
  },
};

export const Orange: Story = {
  args: {
    value: 4,
    color: 'orange',
  },
};

export const Gold: Story = {
  args: {
    value: 4,
    color: 'gold',
  },
};

// ============================================
// Interactive Mode
// ============================================

export const Interactive: Story = {
  args: {
    value: 0,
    interactive: true,
  },
};

export const InteractiveWithValue: Story = {
  args: {
    value: 3,
    interactive: true,
    showValue: true,
  },
};

export const HalfStarPrecision: Story = {
  args: {
    value: 3.5,
    interactive: true,
    precision: 'half',
    showValue: true,
  },
};

export const InteractiveDisabled: Story = {
  args: {
    value: 3,
    interactive: true,
    disabled: true,
  },
};

// ============================================
// Empty States
// ============================================

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const FullRating: Story = {
  args: {
    value: 5,
  },
};

// ============================================
// All Sizes
// ============================================

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <RatingStarsCatto value={4} size="xs" />
      <RatingStarsCatto value={4} size="sm" />
      <RatingStarsCatto value={4} size="md" />
      <RatingStarsCatto value={4} size="lg" />
      <RatingStarsCatto value={4} size="xl" />
    </div>
  ),
};

// ============================================
// All Colors
// ============================================

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <RatingStarsCatto value={4} color="yellow" />
      <RatingStarsCatto value={4} color="orange" />
      <RatingStarsCatto value={4} color="gold" />
    </div>
  ),
};
