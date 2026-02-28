// @catto/ui - BottomNavCatto Tests
import { describe, expect, it, vi } from 'vitest';
import BottomNavCatto, {
  type BottomNavItem,
} from '../../components/BottomNav/BottomNavCatto';
import { fireEvent, render, screen } from '../test-utils';

const mockItems: BottomNavItem[] = [
  {
    key: 'home',
    icon: <span data-testid="icon-home">H</span>,
    label: 'Home',
    href: '/',
  },
  {
    key: 'search',
    icon: <span data-testid="icon-search">S</span>,
    label: 'Search',
    href: '/search',
  },
  {
    key: 'profile',
    icon: <span data-testid="icon-profile">P</span>,
    label: 'Profile',
    href: '/profile',
  },
];

describe('BottomNavCatto', () => {
  describe('rendering', () => {
    it('renders nav element', () => {
      render(<BottomNavCatto items={mockItems} />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders all nav items', () => {
      render(<BottomNavCatto items={mockItems} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Search')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('renders icons for each item', () => {
      render(<BottomNavCatto items={mockItems} />);

      expect(screen.getByTestId('icon-home')).toBeInTheDocument();
      expect(screen.getByTestId('icon-search')).toBeInTheDocument();
      expect(screen.getByTestId('icon-profile')).toBeInTheDocument();
    });

    it('renders items as links by default', () => {
      render(<BottomNavCatto items={mockItems} />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(3);
    });

    it('applies correct href to links', () => {
      render(<BottomNavCatto items={mockItems} />);

      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveAttribute('href', '/');
      expect(links[1]).toHaveAttribute('href', '/search');
      expect(links[2]).toHaveAttribute('href', '/profile');
    });
  });

  describe('active state', () => {
    it('applies active styles to active item', () => {
      const itemsWithActive: BottomNavItem[] = [
        {
          key: 'home',
          icon: <span>H</span>,
          label: 'Home',
          href: '/',
          isActive: true,
        },
        {
          key: 'search',
          icon: <span>S</span>,
          label: 'Search',
          href: '/search',
        },
      ];

      render(<BottomNavCatto items={itemsWithActive} />);

      const links = screen.getAllByRole('link');
      expect(links[0].className).toContain('text-orange-600');
      expect(links[1].className).not.toContain('text-orange-600');
    });

    it('applies inactive styles to non-active items', () => {
      const itemsWithActive: BottomNavItem[] = [
        {
          key: 'home',
          icon: <span>H</span>,
          label: 'Home',
          href: '/',
          isActive: true,
        },
        {
          key: 'search',
          icon: <span>S</span>,
          label: 'Search',
          href: '/search',
        },
      ];

      render(<BottomNavCatto items={itemsWithActive} />);

      const links = screen.getAllByRole('link');
      expect(links[1].className).toContain('text-gray-600');
    });
  });

  describe('rightSlot', () => {
    it('renders rightSlot content', () => {
      render(
        <BottomNavCatto
          items={mockItems}
          rightSlot={<button data-testid="hamburger">Menu</button>}
        />,
      );

      expect(screen.getByTestId('hamburger')).toBeInTheDocument();
    });
  });

  describe('onItemClick', () => {
    it('renders items as buttons when onItemClick provided', () => {
      const handleClick = vi.fn();
      render(<BottomNavCatto items={mockItems} onItemClick={handleClick} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    it('calls onItemClick when item clicked', () => {
      const handleClick = vi.fn();
      render(<BottomNavCatto items={mockItems} onItemClick={handleClick} />);

      fireEvent.click(screen.getByText('Home'));

      expect(handleClick).toHaveBeenCalledWith(mockItems[0]);
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
        <BottomNavCatto items={mockItems} LinkComponent={CustomLink} />,
      );

      const customLinks = container.querySelectorAll(
        '[data-custom-link="true"]',
      );
      expect(customLinks.length).toBe(3);
    });
  });

  describe('accessibility', () => {
    it('has aria-label for navigation', () => {
      render(<BottomNavCatto items={mockItems} />);

      expect(screen.getByRole('navigation')).toHaveAttribute(
        'aria-label',
        'Bottom navigation',
      );
    });

    it('uses custom aria-label when provided', () => {
      render(<BottomNavCatto items={mockItems} aria-label="Main navigation" />);

      expect(screen.getByRole('navigation')).toHaveAttribute(
        'aria-label',
        'Main navigation',
      );
    });
  });

  describe('styling', () => {
    it('is fixed to bottom', () => {
      render(<BottomNavCatto items={mockItems} />);

      const nav = screen.getByRole('navigation');
      expect(nav.className).toContain('fixed');
      expect(nav.className).toContain('bottom-0');
    });

    it('applies custom className', () => {
      render(<BottomNavCatto items={mockItems} className="my-custom-class" />);

      const nav = screen.getByRole('navigation');
      expect(nav.className).toContain('my-custom-class');
    });

    it('applies custom zIndex', () => {
      render(<BottomNavCatto items={mockItems} zIndex={100} />);

      const nav = screen.getByRole('navigation');
      expect(nav.style.zIndex).toBe('100');
    });

    it('uses default zIndex of 40', () => {
      render(<BottomNavCatto items={mockItems} />);

      const nav = screen.getByRole('navigation');
      expect(nav.style.zIndex).toBe('40');
    });
  });

  describe('hideOnScroll', () => {
    it('is visible by default', () => {
      render(<BottomNavCatto items={mockItems} />);

      const nav = screen.getByRole('navigation');
      expect(nav.className).toContain('translate-y-0');
    });

    it('has transition classes for smooth hide/show', () => {
      render(<BottomNavCatto items={mockItems} />);

      const nav = screen.getByRole('navigation');
      expect(nav.className).toContain('transition-transform');
      expect(nav.className).toContain('duration-300');
    });
  });
});
