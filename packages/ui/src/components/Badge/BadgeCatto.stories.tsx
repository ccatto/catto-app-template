import type { Meta, StoryObj } from '@storybook/react';
import { AlertCircle, Check, Info as InfoIcon, Star } from 'lucide-react';
import BadgeCatto from './BadgeCatto';

const meta = {
  title: 'Components/Badge',
  component: BadgeCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'success',
        'warning',
        'error',
        'info',
        'outline',
      ],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof BadgeCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// Variants
// ============================================

export const Default: Story = {
  args: {
    children: 'Default',
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    children: 'Error',
    variant: 'error',
  },
};

export const Info: Story = {
  args: {
    children: 'Info',
    variant: 'info',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

// ============================================
// Sizes
// ============================================

export const ExtraSmall: Story = {
  args: {
    children: 'XS',
    size: 'xs',
    variant: 'primary',
  },
};

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
    variant: 'primary',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium',
    size: 'md',
    variant: 'primary',
  },
};

export const Large: Story = {
  args: {
    children: 'Large',
    size: 'lg',
    variant: 'primary',
  },
};

// ============================================
// With Icons
// ============================================

export const WithLeftIcon: Story = {
  args: {
    children: 'Verified',
    variant: 'success',
    leftIcon: <Check className="h-3 w-3" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Alert',
    variant: 'error',
    rightIcon: <AlertCircle className="h-3 w-3" />,
  },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Featured',
    variant: 'warning',
    leftIcon: <Star className="h-3 w-3" />,
    rightIcon: <InfoIcon className="h-3 w-3" />,
  },
};

// ============================================
// Special Modes
// ============================================

export const Dot: Story = {
  args: {
    children: 'New',
    variant: 'success',
    dot: true,
  },
};

export const Pulse: Story = {
  args: {
    children: 'Live',
    variant: 'error',
    pulse: true,
  },
};

export const Rounded: Story = {
  args: {
    children: '99+',
    variant: 'primary',
    rounded: true,
  },
};

// ============================================
// All Variants
// ============================================

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <BadgeCatto variant="default">Default</BadgeCatto>
      <BadgeCatto variant="primary">Primary</BadgeCatto>
      <BadgeCatto variant="secondary">Secondary</BadgeCatto>
      <BadgeCatto variant="success">Success</BadgeCatto>
      <BadgeCatto variant="warning">Warning</BadgeCatto>
      <BadgeCatto variant="error">Error</BadgeCatto>
      <BadgeCatto variant="info">Info</BadgeCatto>
      <BadgeCatto variant="outline">Outline</BadgeCatto>
    </div>
  ),
};
