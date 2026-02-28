import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import PricingCardCatto from './PricingCardCatto';

const meta = {
  title: 'E-commerce/PricingCard',
  component: PricingCardCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'featured', 'enterprise'],
    },
  },
  args: {
    onCtaClick: fn(),
  },
} satisfies Meta<typeof PricingCardCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicFeatures = [
  { text: '5 Projects', included: true },
  { text: '10GB Storage', included: true },
  { text: 'Email Support', included: true },
  { text: 'API Access', included: false },
  { text: 'Custom Domain', included: false },
];

const proFeatures = [
  { text: 'Unlimited Projects', included: true },
  { text: '100GB Storage', included: true },
  { text: 'Priority Support', included: true },
  { text: 'API Access', included: true },
  { text: 'Custom Domain', included: false },
];

const enterpriseFeatures = [
  { text: 'Unlimited Everything', included: true },
  { text: '1TB Storage', included: true },
  { text: '24/7 Phone Support', included: true },
  { text: 'Full API Access', included: true },
  { text: 'Custom Domain', included: true },
  { text: 'SSO Integration', included: true },
];

export const Default: Story = {
  args: {
    name: 'Basic',
    description: 'Perfect for getting started',
    price: 9,
    period: 'month',
    features: basicFeatures,
    ctaText: 'Start Free Trial',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Featured: Story = {
  args: {
    name: 'Pro',
    description: 'Best for growing teams',
    price: 29,
    period: 'month',
    features: proFeatures,
    ctaText: 'Get Started',
    variant: 'featured',
    badge: 'Most Popular',
    highlighted: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Enterprise: Story = {
  args: {
    name: 'Enterprise',
    description: 'For large organizations',
    price: 'Custom',
    features: enterpriseFeatures,
    ctaText: 'Contact Sales',
    variant: 'enterprise',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export const YearlyPricing: Story = {
  args: {
    name: 'Pro Annual',
    description: 'Save 20% with yearly billing',
    price: 290,
    period: 'year',
    features: proFeatures,
    ctaText: 'Get Started',
    badge: 'Save 20%',
    variant: 'featured',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Loading: Story = {
  args: {
    name: 'Pro',
    description: 'Best for growing teams',
    price: 29,
    period: 'month',
    features: proFeatures,
    ctaText: 'Processing...',
    ctaLoading: true,
    variant: 'featured',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    name: 'Basic',
    description: 'Currently unavailable',
    price: 9,
    period: 'month',
    features: basicFeatures,
    ctaText: 'Unavailable',
    ctaDisabled: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export const PricingGrid: Story = {
  render: () => (
    <div className="flex gap-6">
      <PricingCardCatto
        name="Basic"
        description="For individuals"
        price={9}
        period="month"
        features={basicFeatures}
        ctaText="Start Free"
      />
      <PricingCardCatto
        name="Pro"
        description="For teams"
        price={29}
        period="month"
        features={proFeatures}
        ctaText="Get Started"
        variant="featured"
        badge="Popular"
        highlighted
      />
      <PricingCardCatto
        name="Enterprise"
        description="For organizations"
        price="Custom"
        features={enterpriseFeatures}
        ctaText="Contact Sales"
        variant="enterprise"
      />
    </div>
  ),
};
