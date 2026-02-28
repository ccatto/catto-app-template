import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ArrowRight, Check, Download, Mail, Trash2 } from 'lucide-react';
import ButtonCatto from './ButtonCatto';

const meta = {
  title: 'Components/Button',
  component: ButtonCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'tertiary',
        'catto',
        'ghost',
        'outline',
        'danger',
        'goGreen',
        'pill',
        'pillOutline',
        'funOrange',
        'outlineRoundedXL',
        'blueGradientXL',
      ],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    width: {
      control: 'select',
      options: ['full', 'auto', 'fit'],
    },
    haptic: {
      control: 'select',
      options: ['none', 'light', 'medium', 'heavy'],
    },
    animation: {
      control: 'select',
      options: ['none', 'tada', 'bounce', 'pulse'],
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof ButtonCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// Primary Variants
// ============================================

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
    width: 'auto',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
    width: 'auto',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'Tertiary Button',
    width: 'auto',
  },
};

export const Catto: Story = {
  args: {
    variant: 'catto',
    children: 'Catto Button',
    width: 'auto',
  },
};

// ============================================
// Status Variants
// ============================================

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete',
    width: 'auto',
    leftIcon: <Trash2 className="h-4 w-4" />,
  },
};

export const GoGreen: Story = {
  args: {
    variant: 'goGreen',
    children: 'Confirm',
    width: 'auto',
    leftIcon: <Check className="h-4 w-4" />,
  },
};

// ============================================
// Utility Variants
// ============================================

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: <Mail className="h-4 w-4" />,
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
    width: 'auto',
  },
};

// ============================================
// Marketing Variants
// ============================================

export const FunOrange: Story = {
  args: {
    variant: 'funOrange',
    children: 'Get Started',
  },
};

export const BlueGradientXL: Story = {
  args: {
    variant: 'blueGradientXL',
    children: 'Sign Up Now',
    width: 'auto',
  },
};

export const OutlineRoundedXL: Story = {
  args: {
    variant: 'outlineRoundedXL',
    children: 'Learn More',
  },
};

// ============================================
// Pill Variants
// ============================================

export const Pill: Story = {
  args: {
    variant: 'pill',
    children: 'Pill Button',
    width: 'auto',
  },
};

export const PillOutline: Story = {
  args: {
    variant: 'pillOutline',
    children: 'Pill Outline',
    width: 'auto',
  },
};

// ============================================
// Sizes
// ============================================

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small Button',
    width: 'auto',
  },
};

export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Medium Button',
    width: 'auto',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button',
    width: 'auto',
  },
};

// ============================================
// States
// ============================================

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true,
    width: 'auto',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'Loading...',
    isLoading: true,
    width: 'auto',
  },
};

// ============================================
// With Icons
// ============================================

export const WithLeftIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Send Email',
    leftIcon: <Mail className="h-4 w-4" />,
    width: 'auto',
  },
};

export const WithRightIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Continue',
    rightIcon: <ArrowRight className="h-4 w-4" />,
    width: 'auto',
  },
};

export const WithBothIcons: Story = {
  args: {
    variant: 'primary',
    children: 'Download',
    leftIcon: <Download className="h-4 w-4" />,
    rightIcon: <ArrowRight className="h-4 w-4" />,
    width: 'auto',
  },
};

// ============================================
// Width Variants
// ============================================

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    children: 'Full Width Button',
    width: 'full',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export const AutoWidth: Story = {
  args: {
    variant: 'primary',
    children: 'Auto Width',
    width: 'auto',
  },
};

export const FitWidth: Story = {
  args: {
    variant: 'primary',
    children: 'Fit Content',
    width: 'fit',
  },
};
