import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ThemeToggleCatto from '../../components/ThemeToggle/ThemeToggleCatto';

// Mock next-themes
const mockSetTheme = vi.fn();
let mockTheme = 'dark';

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeToggleCatto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme = 'dark';
  });

  describe('rendering', () => {
    it('renders after mounting', () => {
      render(<ThemeToggleCatto />);

      // Component renders the ButtonTogglePillCatto with role="switch"
      const toggle = screen.getByRole('switch');
      expect(toggle).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<ThemeToggleCatto className="custom-toggle" />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('custom-toggle');
    });
  });

  describe('theme state', () => {
    it('shows dark mode as active when theme is dark', () => {
      mockTheme = 'dark';
      render(<ThemeToggleCatto />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('shows light mode as active when theme is light', () => {
      mockTheme = 'light';
      render(<ThemeToggleCatto />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('theme switching', () => {
    it('calls setTheme when toggle is clicked', () => {
      mockTheme = 'dark';
      render(<ThemeToggleCatto />);

      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);

      // When clicking from dark mode (isLeft=true), it switches to light
      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('toggles between themes on click', () => {
      mockTheme = 'light';
      render(<ThemeToggleCatto />);

      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);

      // When clicking from light mode (isLeft=false), it switches to dark
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });
  });

  describe('accessibility', () => {
    it('has switch role', () => {
      render(<ThemeToggleCatto />);

      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('has aria-checked attribute', () => {
      render(<ThemeToggleCatto />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked');
    });

    it('can be activated with keyboard', () => {
      render(<ThemeToggleCatto />);

      const toggle = screen.getByRole('switch');
      toggle.focus();
      expect(toggle).toHaveFocus();

      // Activate with Enter key
      fireEvent.keyDown(toggle, { key: 'Enter' });
      expect(mockSetTheme).toHaveBeenCalled();
    });

    it('can be activated with Space key', () => {
      mockSetTheme.mockClear();
      render(<ThemeToggleCatto />);

      const toggle = screen.getByRole('switch');
      fireEvent.keyDown(toggle, { key: ' ' });

      expect(mockSetTheme).toHaveBeenCalled();
    });
  });

  describe('hydration', () => {
    it('renders consistently after hydration', () => {
      const { rerender } = render(<ThemeToggleCatto />);

      // Rerender to simulate hydration
      rerender(<ThemeToggleCatto />);

      expect(screen.getByRole('switch')).toBeInTheDocument();
    });
  });

  describe('icons', () => {
    it('renders moon and sun icons', () => {
      const { container } = render(<ThemeToggleCatto />);

      // Check for SVG icons (Moon and Sun from lucide-react)
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThanOrEqual(2);
    });
  });
});
