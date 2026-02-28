// @catto/ui - NavLinkGroupCatto Tests
import { describe, expect, it, vi } from 'vitest';
import NavLinkGroupCatto, {
  type NavLinkItem,
} from '../../components/NavLinkGroup/NavLinkGroupCatto';
import { fireEvent, render, screen } from '../test-utils';

const mockItems: NavLinkItem[] = [
  {
    key: 'home',
    icon: <span data-testid="icon-home">H</span>,
    label: 'Home',
    href: '/',
  },
  {
    key: 'about',
    icon: <span data-testid="icon-about">A</span>,
    label: 'About',
    href: '/about',
  },
  { key: 'contact', label: 'Contact', href: '/contact' },
];

describe('NavLinkGroupCatto', () => {
  describe('rendering', () => {
    it('renders all nav items', () => {
      render(<NavLinkGroupCatto items={mockItems} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('renders icons when provided', () => {
      render(<NavLinkGroupCatto items={mockItems} />);

      expect(screen.getByTestId('icon-home')).toBeInTheDocument();
      expect(screen.getByTestId('icon-about')).toBeInTheDocument();
    });

    it('renders items as links when href provided', () => {
      render(<NavLinkGroupCatto items={mockItems} />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(3);
    });

    it('applies correct href to links', () => {
      render(<NavLinkGroupCatto items={mockItems} />);

      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveAttribute('href', '/');
      expect(links[1]).toHaveAttribute('href', '/about');
      expect(links[2]).toHaveAttribute('href', '/contact');
    });
  });

  describe('title', () => {
    it('does not render title when not provided', () => {
      const { container } = render(<NavLinkGroupCatto items={mockItems} />);

      const title = container.querySelector('p.uppercase');
      expect(title).not.toBeInTheDocument();
    });

    it('renders title when provided', () => {
      render(<NavLinkGroupCatto items={mockItems} title="Navigation" />);

      expect(screen.getByText('Navigation')).toBeInTheDocument();
    });

    it('renders titleIcon when provided', () => {
      render(
        <NavLinkGroupCatto
          items={mockItems}
          title="Main"
          titleIcon={<span data-testid="title-icon">*</span>}
        />,
      );

      expect(screen.getByTestId('title-icon')).toBeInTheDocument();
    });

    it('applies default title variant styling', () => {
      const { container } = render(
        <NavLinkGroupCatto items={mockItems} title="Navigation" />,
      );

      const titleContainer = container.querySelector('.text-gray-500');
      expect(titleContainer).toBeInTheDocument();
    });

    it('applies accent title variant styling', () => {
      const { container } = render(
        <NavLinkGroupCatto
          items={mockItems}
          title="Navigation"
          titleVariant="accent"
        />,
      );

      const titleContainer = container.querySelector('.text-orange-600');
      expect(titleContainer).toBeInTheDocument();
    });
  });

  describe('active state', () => {
    it('applies active styles to active item', () => {
      const itemsWithActive: NavLinkItem[] = [
        { key: 'home', label: 'Home', href: '/', isActive: true },
        { key: 'about', label: 'About', href: '/about' },
      ];

      render(<NavLinkGroupCatto items={itemsWithActive} />);

      const links = screen.getAllByRole('link');
      expect(links[0].className).toContain('bg-orange-100');
      expect(links[0].className).toContain('text-orange-700');
    });

    it('applies inactive styles to non-active items', () => {
      const itemsWithActive: NavLinkItem[] = [
        { key: 'home', label: 'Home', href: '/', isActive: true },
        { key: 'about', label: 'About', href: '/about' },
      ];

      render(<NavLinkGroupCatto items={itemsWithActive} />);

      const links = screen.getAllByRole('link');
      expect(links[1].className).toContain('text-gray-700');
    });
  });

  describe('onClick', () => {
    it('renders item as button when onClick provided', () => {
      const handleClick = vi.fn();
      const itemsWithClick: NavLinkItem[] = [
        { key: 'action', label: 'Action', onClick: handleClick },
      ];

      render(<NavLinkGroupCatto items={itemsWithClick} />);

      expect(
        screen.getByRole('button', { name: 'Action' }),
      ).toBeInTheDocument();
    });

    it('calls onClick when button clicked', () => {
      const handleClick = vi.fn();
      const itemsWithClick: NavLinkItem[] = [
        { key: 'action', label: 'Action', onClick: handleClick },
      ];

      render(<NavLinkGroupCatto items={itemsWithClick} />);

      fireEvent.click(screen.getByRole('button', { name: 'Action' }));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('LinkComponent', () => {
    it('uses custom LinkComponent when provided', () => {
      const CustomLink = ({
        href,
        children,
        className,
      }: {
        href: string;
        children: React.ReactNode;
        className?: string;
      }) => (
        <a href={href} className={className} data-custom-link="true">
          {children}
        </a>
      );

      const { container } = render(
        <NavLinkGroupCatto items={mockItems} LinkComponent={CustomLink} />,
      );

      const customLinks = container.querySelectorAll(
        '[data-custom-link="true"]',
      );
      expect(customLinks.length).toBe(3);
    });
  });

  describe('fallback rendering', () => {
    it('renders as div when no href or onClick', () => {
      const itemsNoNav: NavLinkItem[] = [
        { key: 'static', label: 'Static Item' },
      ];

      const { container } = render(<NavLinkGroupCatto items={itemsNoNav} />);

      // Should not have link or button role
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      // But text should still be visible
      expect(screen.getByText('Static Item')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('has space-y-1 container', () => {
      const { container } = render(<NavLinkGroupCatto items={mockItems} />);

      expect(container.firstChild).toHaveClass('space-y-1');
    });

    it('applies custom className to container', () => {
      const { container } = render(
        <NavLinkGroupCatto items={mockItems} className="my-custom-class" />,
      );

      expect(container.firstChild).toHaveClass('my-custom-class');
    });

    it('applies custom itemClassName to items', () => {
      render(
        <NavLinkGroupCatto items={mockItems} itemClassName="item-custom" />,
      );

      const links = screen.getAllByRole('link');
      expect(links[0].className).toContain('item-custom');
    });

    it('items have rounded-lg styling', () => {
      render(<NavLinkGroupCatto items={mockItems} />);

      const links = screen.getAllByRole('link');
      expect(links[0].className).toContain('rounded-lg');
    });

    it('items have padding', () => {
      render(<NavLinkGroupCatto items={mockItems} />);

      const links = screen.getAllByRole('link');
      expect(links[0].className).toContain('px-3');
      expect(links[0].className).toContain('py-2.5');
    });
  });
});
