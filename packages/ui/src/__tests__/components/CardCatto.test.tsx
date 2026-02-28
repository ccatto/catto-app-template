// @catto/ui - CardCatto Tests
import { describe, expect, it, vi } from 'vitest';
import CardCatto from '../../components/Card/CardCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('CardCatto', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<CardCatto>Content</CardCatto>);

      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('renders title in header', () => {
      render(<CardCatto title="Card Title">Content</CardCatto>);

      expect(screen.getByText('Card Title')).toBeInTheDocument();
    });

    it('renders description in header', () => {
      render(
        <CardCatto title="Title" description="Card description">
          Content
        </CardCatto>,
      );

      expect(screen.getByText('Card description')).toBeInTheDocument();
    });

    it('renders children in body', () => {
      render(
        <CardCatto>
          <span data-testid="child-content">Body content</span>
        </CardCatto>,
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('renders icon in header when provided', () => {
      render(
        <CardCatto
          title="With Icon"
          icon={<span data-testid="card-icon">icon</span>}
        >
          Content
        </CardCatto>,
      );

      expect(screen.getByTestId('card-icon')).toBeInTheDocument();
    });

    it('renders footer when provided', () => {
      render(
        <CardCatto footer={<span data-testid="card-footer">Footer</span>}>
          Content
        </CardCatto>,
      );

      expect(screen.getByTestId('card-footer')).toBeInTheDocument();
    });

    it('renders headerComponent when provided', () => {
      render(
        <CardCatto
          headerComponent={
            <span data-testid="custom-header">Custom Header</span>
          }
        >
          Content
        </CardCatto>,
      );

      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('applies default variant styles', () => {
      render(<CardCatto>Default</CardCatto>);

      const card = screen.getByRole('article');
      // Uses semantic theme token
      expect(card.className).toContain('bg-theme-surface');
    });

    it('applies primary variant styles', () => {
      render(<CardCatto variant="primary">Primary</CardCatto>);

      const card = screen.getByRole('article');
      // Uses semantic theme token
      expect(card.className).toContain('bg-theme-primary-subtle');
    });

    it('applies success variant styles', () => {
      render(<CardCatto variant="success">Success</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('bg-green-900/20');
    });

    it('applies warning variant styles', () => {
      render(<CardCatto variant="warning">Warning</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('bg-yellow-900/20');
    });

    it('applies danger variant styles', () => {
      render(<CardCatto variant="danger">Danger</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('bg-red-900/20');
    });

    it('applies glass variant styles', () => {
      render(<CardCatto variant="glass">Glass</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('backdrop-blur');
    });

    it('applies gradient variant styles', () => {
      render(<CardCatto variant="gradient">Gradient</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('bg-gradient-to-br');
    });
  });

  describe('width', () => {
    it('applies medium width by default', () => {
      render(<CardCatto>Content</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('md:max-w-md');
    });

    it('applies small width', () => {
      render(<CardCatto width="sm">Small</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('md:max-w-sm');
    });

    it('applies large width', () => {
      render(<CardCatto width="lg">Large</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('md:max-w-lg');
    });

    it('applies full width', () => {
      render(<CardCatto width="full">Full</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('w-full');
    });
  });

  describe('elevation', () => {
    it('applies medium elevation by default', () => {
      render(<CardCatto>Content</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('shadow-md');
    });

    it('applies no elevation', () => {
      render(<CardCatto elevation="none">No Shadow</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).not.toContain('shadow-');
    });

    it('applies small elevation', () => {
      render(<CardCatto elevation="sm">Small Shadow</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('shadow-sm');
    });

    it('applies large elevation', () => {
      render(<CardCatto elevation="lg">Large Shadow</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('shadow-lg');
    });
  });

  describe('collapsible', () => {
    it('toggles collapse on click when collapsible', () => {
      const { container } = render(
        <CardCatto title="Collapsible Card" collapsible>
          <span data-testid="body-content">Body</span>
        </CardCatto>,
      );

      // Initially expanded - content wrapper has max-h-[5000px]
      const contentWrapper = container.querySelector('.max-h-\\[5000px\\]');
      expect(contentWrapper).toBeInTheDocument();

      // Click the collapse button to collapse
      fireEvent.click(screen.getByRole('button', { name: 'Collapse content' }));

      // Should be collapsed - has max-h-0
      const collapsedWrapper = container.querySelector('.max-h-0');
      expect(collapsedWrapper).toBeInTheDocument();
    });

    it('starts collapsed when defaultCollapsed is true', () => {
      const { container } = render(
        <CardCatto title="Collapsed Card" collapsible defaultCollapsed>
          <span data-testid="body-content">Body</span>
        </CardCatto>,
      );

      // Should be collapsed - has max-h-0 class
      const collapsedWrapper = container.querySelector('.max-h-0');
      expect(collapsedWrapper).toBeInTheDocument();
    });

    it('expands collapsed card on click', () => {
      const { container } = render(
        <CardCatto title="Collapsed Card" collapsible defaultCollapsed>
          <span data-testid="body-content">Body</span>
        </CardCatto>,
      );

      // Click the expand button
      fireEvent.click(screen.getByRole('button', { name: 'Expand content' }));

      // Should be expanded now
      const expandedWrapper = container.querySelector('.max-h-\\[5000px\\]');
      expect(expandedWrapper).toBeInTheDocument();
    });

    it('calls onCollapseChange when toggled', () => {
      const handleCollapseChange = vi.fn();
      render(
        <CardCatto
          title="Collapsible"
          collapsible
          onCollapseChange={handleCollapseChange}
        >
          Body
        </CardCatto>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Collapse content' }));

      expect(handleCollapseChange).toHaveBeenCalledTimes(1);
      expect(handleCollapseChange).toHaveBeenCalledWith(true);
    });

    it('toggles on Enter key', () => {
      const { container } = render(
        <CardCatto title="Keyboard Collapsible" collapsible>
          <span data-testid="body-content">Body</span>
        </CardCatto>,
      );

      const header = container.querySelector('[role="button"][tabindex="0"]');
      if (header) {
        fireEvent.keyDown(header, { key: 'Enter' });
      }

      // Should be collapsed now
      const collapsedWrapper = container.querySelector('.max-h-0');
      expect(collapsedWrapper).toBeInTheDocument();
    });

    it('toggles on Space key', () => {
      const { container } = render(
        <CardCatto title="Keyboard Collapsible" collapsible>
          <span data-testid="body-content">Body</span>
        </CardCatto>,
      );

      const header = container.querySelector('[role="button"][tabindex="0"]');
      if (header) {
        fireEvent.keyDown(header, { key: ' ' });
      }

      // Should be collapsed now
      const collapsedWrapper = container.querySelector('.max-h-0');
      expect(collapsedWrapper).toBeInTheDocument();
    });

    it('shows collapse button with correct aria-label', () => {
      render(
        <CardCatto title="Collapsible" collapsible>
          Body
        </CardCatto>,
      );

      expect(
        screen.getByRole('button', { name: 'Collapse content' }),
      ).toBeInTheDocument();
    });

    it('applies collapsed styles to footer wrapper when collapsed', () => {
      const { container } = render(
        <CardCatto
          title="Collapsible"
          collapsible
          defaultCollapsed
          footer={<span data-testid="footer">Footer</span>}
        >
          Body
        </CardCatto>,
      );

      // Footer is in a collapsed wrapper with max-h-0
      const collapsedWrapper = container.querySelector('.max-h-0');
      expect(collapsedWrapper).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('shows loading state when isLoading', () => {
      const { container } = render(<CardCatto isLoading>Content</CardCatto>);

      const loadingElement = container.querySelector('.animate-pulse');
      expect(loadingElement).toBeInTheDocument();
    });

    it('hides children when loading', () => {
      render(
        <CardCatto isLoading>
          <span data-testid="content">Content</span>
        </CardCatto>,
      );

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('renders custom loading component when provided', () => {
      render(
        <CardCatto
          isLoading
          loadingComponent={<span data-testid="custom-loader">Loading...</span>}
        >
          Content
        </CardCatto>,
      );

      expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('applies disabled styling when disabled', () => {
      render(<CardCatto disabled>Disabled</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('opacity-60');
      expect(card.className).toContain('cursor-not-allowed');
    });

    it('prevents onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <CardCatto disabled onClick={handleClick}>
          Disabled
        </CardCatto>,
      );

      fireEvent.click(screen.getByRole('article'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('prevents collapse toggle when disabled', () => {
      render(
        <CardCatto title="Disabled Collapsible" collapsible disabled>
          <span data-testid="body-content">Body</span>
        </CardCatto>,
      );

      const header = screen.getByText('Disabled Collapsible');
      fireEvent.click(header);

      expect(screen.getByTestId('body-content')).toBeInTheDocument();
    });
  });

  describe('interactive', () => {
    it('applies hover effect when interactive', () => {
      render(<CardCatto interactive>Interactive</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('hover:-translate-y-1');
    });

    it('does not apply hover effect when interactive but disabled', () => {
      render(
        <CardCatto interactive disabled>
          Interactive Disabled
        </CardCatto>,
      );

      const card = screen.getByRole('article');
      expect(card.className).not.toContain('hover:-translate-y-1');
    });
  });

  describe('onClick', () => {
    it('calls onClick when card is clicked', () => {
      const handleClick = vi.fn();
      render(<CardCatto onClick={handleClick}>Clickable</CardCatto>);

      fireEvent.click(screen.getByRole('article'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies cursor-pointer when onClick provided', () => {
      const handleClick = vi.fn();
      render(<CardCatto onClick={handleClick}>Clickable</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('cursor-pointer');
    });
  });

  describe('badge', () => {
    it('renders badge when provided', () => {
      render(<CardCatto badge={{ text: 'New' }}>Content</CardCatto>);

      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('badge has correct aria-label', () => {
      render(<CardCatto badge={{ text: 'Featured' }}>Content</CardCatto>);

      expect(
        screen.getByRole('status', { name: 'Featured' }),
      ).toBeInTheDocument();
    });
  });

  describe('border', () => {
    it('shows border by default', () => {
      render(<CardCatto>Content</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('border');
    });

    it('hides border when showBorder is false', () => {
      render(<CardCatto showBorder={false}>Content</CardCatto>);

      const card = screen.getByRole('article');
      const classNames = card.className.split(' ');
      expect(classNames).not.toContain('border');
    });
  });

  describe('centering', () => {
    it('centers card by default', () => {
      render(<CardCatto>Content</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('mx-auto');
    });

    it('does not center when center is false', () => {
      render(<CardCatto center={false}>Content</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).not.toContain('mx-auto');
    });
  });

  describe('custom className', () => {
    it('merges custom className with variant classes', () => {
      render(<CardCatto className="my-custom-class">Custom</CardCatto>);

      const card = screen.getByRole('article');
      expect(card.className).toContain('my-custom-class');
      expect(card.className).toContain('bg-theme-surface');
    });
  });
});
