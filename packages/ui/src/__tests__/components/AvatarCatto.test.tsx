// @catto/ui - AvatarCatto Tests
import { describe, expect, it, vi } from 'vitest';
import AvatarCatto from '../../components/Avatar/AvatarCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('AvatarCatto', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<AvatarCatto />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies data-testid', () => {
      render(<AvatarCatto data-testid="avatar" />);
      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('renders as div by default', () => {
      const { container } = render(<AvatarCatto />);
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('renders as button when onClick provided', () => {
      render(<AvatarCatto onClick={() => {}} name="John" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('image', () => {
    it('renders image when src provided', () => {
      render(<AvatarCatto src="/avatar.jpg" alt="User" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', '/avatar.jpg');
      expect(img).toHaveAttribute('alt', 'User');
    });

    it('falls back to initials on image error', () => {
      render(<AvatarCatto src="/broken.jpg" name="John Doe" />);
      const img = screen.getByRole('img');

      fireEvent.error(img);

      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  describe('initials', () => {
    it('shows single initial for single name', () => {
      render(<AvatarCatto name="John" />);
      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('shows two initials for full name', () => {
      render(<AvatarCatto name="John Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('shows first and last initials for multi-part names', () => {
      render(<AvatarCatto name="John Michael Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('handles names with extra whitespace', () => {
      render(<AvatarCatto name="  John   Doe  " />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('uppercases initials', () => {
      render(<AvatarCatto name="john doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  describe('fallback', () => {
    it('renders custom fallback over initials', () => {
      render(
        <AvatarCatto
          name="John"
          fallback={<span data-testid="custom">?</span>}
        />,
      );
      expect(screen.getByTestId('custom')).toBeInTheDocument();
      expect(screen.queryByText('J')).not.toBeInTheDocument();
    });

    it('shows default icon when no name or fallback', () => {
      const { container } = render(<AvatarCatto />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('applies xs size', () => {
      render(<AvatarCatto size="xs" name="J" />);
      const avatar = screen.getByText('J').closest('div');
      expect(avatar?.className).toContain('h-6');
      expect(avatar?.className).toContain('w-6');
    });

    it('applies sm size', () => {
      render(<AvatarCatto size="sm" name="J" />);
      const avatar = screen.getByText('J').closest('div');
      expect(avatar?.className).toContain('h-8');
      expect(avatar?.className).toContain('w-8');
    });

    it('applies md size by default', () => {
      render(<AvatarCatto name="J" />);
      const avatar = screen.getByText('J').closest('div');
      expect(avatar?.className).toContain('h-10');
      expect(avatar?.className).toContain('w-10');
    });

    it('applies lg size', () => {
      render(<AvatarCatto size="lg" name="J" />);
      const avatar = screen.getByText('J').closest('div');
      expect(avatar?.className).toContain('h-12');
      expect(avatar?.className).toContain('w-12');
    });

    it('applies xl size', () => {
      render(<AvatarCatto size="xl" name="J" />);
      const avatar = screen.getByText('J').closest('div');
      expect(avatar?.className).toContain('h-16');
      expect(avatar?.className).toContain('w-16');
    });

    it('applies 2xl size', () => {
      render(<AvatarCatto size="2xl" name="J" />);
      const avatar = screen.getByText('J').closest('div');
      expect(avatar?.className).toContain('h-20');
      expect(avatar?.className).toContain('w-20');
    });
  });

  describe('shapes', () => {
    it('applies circle shape by default', () => {
      render(<AvatarCatto name="J" />);
      const avatar = screen.getByText('J').closest('div');
      expect(avatar?.className).toContain('rounded-full');
    });

    it('applies rounded shape', () => {
      render(<AvatarCatto shape="rounded" name="J" />);
      const avatar = screen.getByText('J').closest('div');
      expect(avatar?.className).toContain('rounded-lg');
    });

    it('applies square shape', () => {
      render(<AvatarCatto shape="square" name="J" />);
      const avatar = screen.getByText('J').closest('div');
      expect(avatar?.className).toContain('rounded-none');
    });
  });

  describe('status', () => {
    it('shows no status indicator by default', () => {
      const { container } = render(<AvatarCatto name="J" />);
      const statusIndicators = container.querySelectorAll('.absolute');
      expect(statusIndicators.length).toBe(0);
    });

    it('shows online status', () => {
      const { container } = render(<AvatarCatto name="J" status="online" />);
      const status = container.querySelector('.bg-green-500');
      expect(status).toBeInTheDocument();
    });

    it('shows offline status', () => {
      const { container } = render(<AvatarCatto name="J" status="offline" />);
      const status = container.querySelector('.bg-gray-400');
      expect(status).toBeInTheDocument();
    });

    it('shows away status', () => {
      const { container } = render(<AvatarCatto name="J" status="away" />);
      const status = container.querySelector('.bg-yellow-500');
      expect(status).toBeInTheDocument();
    });

    it('shows busy status', () => {
      const { container } = render(<AvatarCatto name="J" status="busy" />);
      const status = container.querySelector('.bg-red-500');
      expect(status).toBeInTheDocument();
    });

    it('status has aria-label', () => {
      const { container } = render(<AvatarCatto name="J" status="online" />);
      const status = container.querySelector('[aria-label="Status: online"]');
      expect(status).toBeInTheDocument();
    });
  });

  describe('ring', () => {
    it('applies ring when enabled', () => {
      render(<AvatarCatto name="J" ring />);
      const avatar = screen.getByText('J').closest('div');
      expect(avatar?.className).toContain('ring-2');
    });

    it('applies custom ring color', () => {
      render(<AvatarCatto name="J" ring ringColor="ring-orange-500" />);
      const avatar = screen.getByText('J').closest('div');
      expect(avatar?.className).toContain('ring-orange-500');
    });
  });

  describe('onClick', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<AvatarCatto name="John" onClick={handleClick} />);

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies interactive styles', () => {
      render(<AvatarCatto name="J" onClick={() => {}} />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('cursor-pointer');
    });

    it('has type button', () => {
      render(<AvatarCatto name="J" onClick={() => {}} />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });
  });

  describe('accessibility', () => {
    it('has aria-label from alt', () => {
      render(<AvatarCatto alt="User avatar" />);
      expect(screen.getByLabelText('User avatar')).toBeInTheDocument();
    });

    it('has aria-label from name when no alt', () => {
      render(<AvatarCatto name="John Doe" />);
      expect(screen.getByLabelText('John Doe')).toBeInTheDocument();
    });
  });

  describe('className', () => {
    it('applies custom className', () => {
      render(<AvatarCatto name="J" className="my-avatar" />);
      const avatar = screen.getByText('J').closest('div');
      expect(avatar?.className).toContain('my-avatar');
    });
  });

  describe('consistent colors', () => {
    it('generates consistent color for same name', () => {
      const { container: c1 } = render(<AvatarCatto name="John" />);
      const { container: c2 } = render(<AvatarCatto name="John" />);

      const avatar1 = c1.querySelector('[aria-label="John"]');
      const avatar2 = c2.querySelector('[aria-label="John"]');

      // Same name should produce same background color class
      expect(avatar1?.className).toEqual(avatar2?.className);
    });
  });
});
