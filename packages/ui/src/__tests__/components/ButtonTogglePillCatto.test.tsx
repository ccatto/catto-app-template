// @catto/ui - ButtonTogglePillCatto Tests
import { describe, expect, it, vi } from 'vitest';
import ButtonTogglePillCatto from '../../components/ButtonTogglePill/ButtonTogglePillCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('ButtonTogglePillCatto', () => {
  describe('rendering', () => {
    it('renders the toggle button', () => {
      render(<ButtonTogglePillCatto onToggle={vi.fn()} />);

      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('renders sun and moon icons', () => {
      const { container } = render(
        <ButtonTogglePillCatto onToggle={vi.fn()} />,
      );

      // Should have two SVG icons (Moon and Sun from lucide-react)
      const icons = container.querySelectorAll('svg');
      expect(icons).toHaveLength(2);
    });

    it('starts in left position by default', () => {
      render(<ButtonTogglePillCatto onToggle={vi.fn()} />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('starts in right position when initialState is false', () => {
      render(<ButtonTogglePillCatto onToggle={vi.fn()} initialState={false} />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('toggle behavior', () => {
    it('calls onToggle when clicked', () => {
      const handleToggle = vi.fn();
      render(<ButtonTogglePillCatto onToggle={handleToggle} />);

      fireEvent.click(screen.getByRole('switch'));

      expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it('toggles from left to right on click', () => {
      const handleToggle = vi.fn();
      render(
        <ButtonTogglePillCatto onToggle={handleToggle} initialState={true} />,
      );

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'true');

      fireEvent.click(toggle);

      expect(toggle).toHaveAttribute('aria-checked', 'false');
      expect(handleToggle).toHaveBeenCalledWith(false);
    });

    it('toggles from right to left on click', () => {
      const handleToggle = vi.fn();
      render(
        <ButtonTogglePillCatto onToggle={handleToggle} initialState={false} />,
      );

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'false');

      fireEvent.click(toggle);

      expect(toggle).toHaveAttribute('aria-checked', 'true');
      expect(handleToggle).toHaveBeenCalledWith(true);
    });

    it('can toggle multiple times', () => {
      const handleToggle = vi.fn();
      render(<ButtonTogglePillCatto onToggle={handleToggle} />);

      const toggle = screen.getByRole('switch');

      fireEvent.click(toggle);
      expect(handleToggle).toHaveBeenLastCalledWith(false);

      fireEvent.click(toggle);
      expect(handleToggle).toHaveBeenLastCalledWith(true);

      fireEvent.click(toggle);
      expect(handleToggle).toHaveBeenLastCalledWith(false);

      expect(handleToggle).toHaveBeenCalledTimes(3);
    });
  });

  describe('keyboard navigation', () => {
    it('toggles on Enter key', () => {
      const handleToggle = vi.fn();
      render(<ButtonTogglePillCatto onToggle={handleToggle} />);

      const toggle = screen.getByRole('switch');
      fireEvent.keyDown(toggle, { key: 'Enter' });

      expect(handleToggle).toHaveBeenCalledTimes(1);
      expect(handleToggle).toHaveBeenCalledWith(false);
    });

    it('toggles on Space key', () => {
      const handleToggle = vi.fn();
      render(<ButtonTogglePillCatto onToggle={handleToggle} />);

      const toggle = screen.getByRole('switch');
      fireEvent.keyDown(toggle, { key: ' ' });

      expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it('does not toggle on other keys', () => {
      const handleToggle = vi.fn();
      render(<ButtonTogglePillCatto onToggle={handleToggle} />);

      const toggle = screen.getByRole('switch');
      fireEvent.keyDown(toggle, { key: 'Tab' });
      fireEvent.keyDown(toggle, { key: 'Escape' });
      fireEvent.keyDown(toggle, { key: 'a' });

      expect(handleToggle).not.toHaveBeenCalled();
    });

    it('has tabIndex for keyboard focus', () => {
      render(<ButtonTogglePillCatto onToggle={vi.fn()} />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('accessibility', () => {
    it('has switch role', () => {
      render(<ButtonTogglePillCatto onToggle={vi.fn()} />);

      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('has aria-checked attribute', () => {
      render(<ButtonTogglePillCatto onToggle={vi.fn()} />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked');
    });

    it('updates aria-checked on toggle', () => {
      render(<ButtonTogglePillCatto onToggle={vi.fn()} initialState={true} />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'true');

      fireEvent.click(toggle);

      expect(toggle).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('visual states', () => {
    it('highlights left icon when in left position', () => {
      const { container } = render(
        <ButtonTogglePillCatto onToggle={vi.fn()} initialState={true} />,
      );

      const iconContainers = container.querySelectorAll('.z-10');
      // First icon container (Moon) should be fully visible
      expect(iconContainers[0].className).toContain('opacity-100');
      // Second icon container (Sun) should be dimmed
      expect(iconContainers[1].className).toContain('opacity-50');
    });

    it('highlights right icon when in right position', () => {
      const { container } = render(
        <ButtonTogglePillCatto onToggle={vi.fn()} initialState={false} />,
      );

      const iconContainers = container.querySelectorAll('.z-10');
      // First icon container (Moon) should be dimmed
      expect(iconContainers[0].className).toContain('opacity-50');
      // Second icon container (Sun) should be fully visible
      expect(iconContainers[1].className).toContain('opacity-100');
    });

    it('moves sliding circle based on position', () => {
      const { container } = render(
        <ButtonTogglePillCatto onToggle={vi.fn()} initialState={true} />,
      );

      let slidingCircle = container.querySelector('.rounded-full.absolute');
      expect(slidingCircle?.className).toContain('translate-x-0');

      // Toggle to right position by clicking
      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);

      slidingCircle = container.querySelector('.rounded-full.absolute');
      expect(slidingCircle?.className).toContain('translate-x-13');
    });
  });

  describe('custom className', () => {
    it('merges custom className', () => {
      const { container } = render(
        <ButtonTogglePillCatto
          onToggle={vi.fn()}
          className="my-custom-class"
        />,
      );

      const toggle = screen.getByRole('switch');
      expect(toggle.className).toContain('my-custom-class');
    });
  });

  describe('cursor style', () => {
    it('has cursor-pointer', () => {
      render(<ButtonTogglePillCatto onToggle={vi.fn()} />);

      const toggle = screen.getByRole('switch');
      expect(toggle.className).toContain('cursor-pointer');
    });
  });
});
