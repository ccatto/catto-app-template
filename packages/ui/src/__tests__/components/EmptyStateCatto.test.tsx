// @catto/ui - EmptyStateCatto Tests
import { describe, expect, it, vi } from 'vitest';
import EmptyStateCatto from '../../components/EmptyState/EmptyStateCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('EmptyStateCatto', () => {
  describe('rendering', () => {
    it('renders title', () => {
      render(<EmptyStateCatto title="No Results Found" />);

      expect(
        screen.getByRole('heading', { name: 'No Results Found' }),
      ).toBeInTheDocument();
    });

    it('renders description when provided', () => {
      render(
        <EmptyStateCatto
          title="No Teams"
          description="Create your first team to get started."
        />,
      );

      expect(
        screen.getByText('Create your first team to get started.'),
      ).toBeInTheDocument();
    });

    it('does not render description when not provided', () => {
      const { container } = render(<EmptyStateCatto title="No Teams" />);

      expect(container.querySelectorAll('p')).toHaveLength(0);
    });

    it('renders children when provided', () => {
      render(
        <EmptyStateCatto title="Empty">
          <span data-testid="child-content">Custom content</span>
        </EmptyStateCatto>,
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
  });

  describe('icons', () => {
    it('renders default icon when no iconType specified', () => {
      const { container } = render(<EmptyStateCatto title="Empty" />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders teams icon when iconType is teams', () => {
      const { container } = render(
        <EmptyStateCatto title="No Teams" iconType="teams" />,
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders tournaments icon when iconType is tournaments', () => {
      const { container } = render(
        <EmptyStateCatto title="No Tournaments" iconType="tournaments" />,
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders search icon when iconType is search', () => {
      const { container } = render(
        <EmptyStateCatto title="No Search Results" iconType="search" />,
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders error icon when iconType is error', () => {
      const { container } = render(
        <EmptyStateCatto title="Error" iconType="error" variant="error" />,
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders custom icon when provided', () => {
      const customIcon = <span data-testid="custom-icon">Custom Icon</span>;
      render(<EmptyStateCatto title="Custom" icon={customIcon} />);

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('custom icon overrides preset icon', () => {
      const customIcon = <span data-testid="custom-icon">Custom Icon</span>;
      render(
        <EmptyStateCatto title="Custom" icon={customIcon} iconType="teams" />,
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('action button', () => {
    it('renders action button when action provided with onClick', () => {
      const handleClick = vi.fn();
      render(
        <EmptyStateCatto
          title="No Teams"
          action={{ label: 'Create Team', onClick: handleClick }}
        />,
      );

      expect(
        screen.getByRole('button', { name: 'Create Team' }),
      ).toBeInTheDocument();
    });

    it('calls onClick when action button clicked', () => {
      const handleClick = vi.fn();
      render(
        <EmptyStateCatto
          title="No Teams"
          action={{ label: 'Create Team', onClick: handleClick }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Create Team' }));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders action as link when href provided', () => {
      render(
        <EmptyStateCatto
          title="No Teams"
          action={{ label: 'View All Teams', href: '/teams' }}
        />,
      );

      const link = screen.getByRole('link', { name: 'View All Teams' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/teams');
    });
  });

  describe('secondary action', () => {
    it('renders secondary action as link', () => {
      render(
        <EmptyStateCatto
          title="No Results"
          secondaryAction={{ label: 'Go Back', href: '/' }}
        />,
      );

      const link = screen.getByRole('link', { name: 'Go Back' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });

    it('renders both primary and secondary actions', () => {
      const handleClick = vi.fn();
      render(
        <EmptyStateCatto
          title="No Teams"
          action={{ label: 'Create Team', onClick: handleClick }}
          secondaryAction={{ label: 'Learn More', href: '/help' }}
        />,
      );

      expect(
        screen.getByRole('button', { name: 'Create Team' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Learn More' }),
      ).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('applies default variant styles', () => {
      const { container } = render(<EmptyStateCatto title="Default" />);

      const wrapper = container.firstChild as HTMLElement;
      // Uses explicit Tailwind colors
      expect(wrapper.className).toContain('from-orange-500/10');
    });

    it('applies noResults variant styles', () => {
      const { container } = render(
        <EmptyStateCatto title="No Results" variant="noResults" />,
      );

      const wrapper = container.firstChild as HTMLElement;
      // Uses explicit Tailwind colors
      expect(wrapper.className).toContain('bg-slate-200');
    });

    it('applies error variant styles', () => {
      const { container } = render(
        <EmptyStateCatto title="Error" variant="error" />,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('bg-red-50');
    });

    it('applies subtle variant styles', () => {
      const { container } = render(
        <EmptyStateCatto title="Subtle" variant="subtle" />,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('bg-transparent');
    });

    it('applies primary variant styles', () => {
      const { container } = render(
        <EmptyStateCatto title="Primary" variant="primary" />,
      );

      const wrapper = container.firstChild as HTMLElement;
      // Uses explicit Tailwind colors
      expect(wrapper.className).toContain('from-blue-600/10');
    });
  });

  describe('sizes', () => {
    it('applies small size styles', () => {
      const { container } = render(<EmptyStateCatto title="Small" size="sm" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('p-4');
    });

    it('applies medium size styles', () => {
      const { container } = render(
        <EmptyStateCatto title="Medium" size="md" />,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('p-6');
    });

    it('applies large size styles by default', () => {
      const { container } = render(<EmptyStateCatto title="Large" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('p-8');
    });

    it('applies xl size styles', () => {
      const { container } = render(<EmptyStateCatto title="XL" size="xl" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('p-12');
    });
  });

  describe('custom className', () => {
    it('merges custom className with variant classes', () => {
      const { container } = render(
        <EmptyStateCatto title="Custom" className="my-custom-class" />,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('my-custom-class');
      expect(wrapper.className).toContain('from-orange-500/10');
    });
  });
});
