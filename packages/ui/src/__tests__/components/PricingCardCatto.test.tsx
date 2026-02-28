// @catto/ui - PricingCardCatto Tests
import { describe, expect, it, vi } from 'vitest';
import PricingCardCatto from '../../components/PricingCard/PricingCardCatto';
import { fireEvent, render, screen } from '../test-utils';

const defaultFeatures = [
  { text: 'Feature 1', included: true },
  { text: 'Feature 2', included: true },
  { text: 'Feature 3', included: false },
];

describe('PricingCardCatto', () => {
  describe('rendering', () => {
    it('renders plan name', () => {
      render(
        <PricingCardCatto name="Pro" price={29} features={defaultFeatures} />,
      );
      expect(screen.getByText('Pro')).toBeInTheDocument();
    });

    it('renders description when provided', () => {
      render(
        <PricingCardCatto
          name="Pro"
          description="Best for teams"
          price={29}
          features={defaultFeatures}
        />,
      );
      expect(screen.getByText('Best for teams')).toBeInTheDocument();
    });

    it('applies data-testid', () => {
      render(
        <PricingCardCatto
          name="Pro"
          price={29}
          features={defaultFeatures}
          data-testid="pricing-card"
        />,
      );
      expect(screen.getByTestId('pricing-card')).toBeInTheDocument();
    });
  });

  describe('price display', () => {
    it('renders numeric price with currency', () => {
      render(
        <PricingCardCatto name="Pro" price={29} features={defaultFeatures} />,
      );
      expect(screen.getByText('$')).toBeInTheDocument();
      expect(screen.getByText('29')).toBeInTheDocument();
    });

    it('renders custom currency', () => {
      render(
        <PricingCardCatto
          name="Pro"
          price={29}
          currency="€"
          features={defaultFeatures}
        />,
      );
      expect(screen.getByText('€')).toBeInTheDocument();
    });

    it('renders period', () => {
      render(
        <PricingCardCatto
          name="Pro"
          price={29}
          period="year"
          features={defaultFeatures}
        />,
      );
      expect(screen.getByText('/year')).toBeInTheDocument();
    });

    it('renders string price for custom pricing', () => {
      render(
        <PricingCardCatto
          name="Enterprise"
          price="Custom"
          features={defaultFeatures}
        />,
      );
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });
  });

  describe('features', () => {
    it('renders all features', () => {
      render(
        <PricingCardCatto name="Pro" price={29} features={defaultFeatures} />,
      );
      expect(screen.getByText('Feature 1')).toBeInTheDocument();
      expect(screen.getByText('Feature 2')).toBeInTheDocument();
      expect(screen.getByText('Feature 3')).toBeInTheDocument();
    });

    it('shows checkmark for included features', () => {
      const { container } = render(
        <PricingCardCatto
          name="Pro"
          price={29}
          features={[{ text: 'Included', included: true }]}
        />,
      );
      // Check icon (checkmark path)
      const checkIcon = container.querySelector(
        'svg path[d*="M5 13l4 4L19 7"]',
      );
      expect(checkIcon).toBeInTheDocument();
    });

    it('shows X for excluded features', () => {
      const { container } = render(
        <PricingCardCatto
          name="Pro"
          price={29}
          features={[{ text: 'Excluded', included: false }]}
        />,
      );
      // X icon (cross path)
      const xIcon = container.querySelector(
        'svg path[d*="M6 18L18 6M6 6l12 12"]',
      );
      expect(xIcon).toBeInTheDocument();
    });

    it('treats undefined included as true', () => {
      const { container } = render(
        <PricingCardCatto
          name="Pro"
          price={29}
          features={[{ text: 'Default' }]}
        />,
      );
      const checkIcon = container.querySelector(
        'svg path[d*="M5 13l4 4L19 7"]',
      );
      expect(checkIcon).toBeInTheDocument();
    });
  });

  describe('badge', () => {
    it('renders badge when provided', () => {
      render(
        <PricingCardCatto
          name="Pro"
          price={29}
          features={defaultFeatures}
          badge="Most Popular"
        />,
      );
      expect(screen.getByText('Most Popular')).toBeInTheDocument();
    });

    it('does not render badge when not provided', () => {
      render(
        <PricingCardCatto name="Pro" price={29} features={defaultFeatures} />,
      );
      expect(screen.queryByText('Most Popular')).not.toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('applies default variant styles', () => {
      render(
        <PricingCardCatto
          name="Pro"
          price={29}
          features={defaultFeatures}
          data-testid="card"
        />,
      );
      const card = screen.getByTestId('card');
      expect(card.className).toContain('border-theme-border');
    });

    it('applies featured variant styles', () => {
      render(
        <PricingCardCatto
          name="Pro"
          price={29}
          features={defaultFeatures}
          variant="featured"
          data-testid="card"
        />,
      );
      const card = screen.getByTestId('card');
      expect(card.className).toContain('border-orange-500');
    });

    it('applies enterprise variant styles', () => {
      render(
        <PricingCardCatto
          name="Pro"
          price={29}
          features={defaultFeatures}
          variant="enterprise"
          data-testid="card"
        />,
      );
      const card = screen.getByTestId('card');
      expect(card.className).toContain('bg-gradient-to-br');
    });
  });

  describe('highlighted', () => {
    it('applies highlight styles', () => {
      render(
        <PricingCardCatto
          name="Pro"
          price={29}
          features={defaultFeatures}
          highlighted
          data-testid="card"
        />,
      );
      const card = screen.getByTestId('card');
      expect(card.className).toContain('shadow-xl');
    });
  });

  describe('CTA button', () => {
    it('renders default CTA text', () => {
      render(
        <PricingCardCatto name="Pro" price={29} features={defaultFeatures} />,
      );
      expect(
        screen.getByRole('button', { name: 'Get Started' }),
      ).toBeInTheDocument();
    });

    it('renders custom CTA text', () => {
      render(
        <PricingCardCatto
          name="Pro"
          price={29}
          features={defaultFeatures}
          ctaText="Subscribe Now"
        />,
      );
      expect(
        screen.getByRole('button', { name: 'Subscribe Now' }),
      ).toBeInTheDocument();
    });

    it('calls onCtaClick when clicked', () => {
      const handleClick = vi.fn();
      render(
        <PricingCardCatto
          name="Pro"
          price={29}
          features={defaultFeatures}
          onCtaClick={handleClick}
        />,
      );

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disables button when ctaDisabled', () => {
      render(
        <PricingCardCatto
          name="Pro"
          price={29}
          features={defaultFeatures}
          ctaDisabled
        />,
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows loading state', () => {
      render(
        <PricingCardCatto
          name="Pro"
          price={29}
          features={defaultFeatures}
          ctaLoading
        />,
      );
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('disables button when loading', () => {
      render(
        <PricingCardCatto
          name="Pro"
          price={29}
          features={defaultFeatures}
          ctaLoading
        />,
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('className', () => {
    it('applies custom className', () => {
      render(
        <PricingCardCatto
          name="Pro"
          price={29}
          features={defaultFeatures}
          className="my-pricing-card"
          data-testid="card"
        />,
      );
      const card = screen.getByTestId('card');
      expect(card.className).toContain('my-pricing-card');
    });
  });
});
