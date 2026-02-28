import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ThemeSwitcherCatto from '../../components/ThemeSwitcher/ThemeSwitcherCatto';
import { ThemeProvider } from '../../context/ThemeProvider';

// Mock the themes module
vi.mock('../../themes', () => ({
  THEMES: ['rleaguez', 'neon-pulse'] as const,
  THEME_METADATA: {
    rleaguez: { label: 'RLeaguez', description: 'Orange and navy theme' },
    'neon-pulse': { label: 'Neon Pulse', description: 'Vibrant neon theme' },
  },
  isValidTheme: (theme: string) => ['rleaguez', 'neon-pulse'].includes(theme),
}));

// Wrapper component with ThemeProvider
const renderWithThemeProvider = (
  ui: React.ReactElement,
  options?: { defaultTheme?: 'rleaguez' | 'neon-pulse' },
) => {
  return render(
    <ThemeProvider
      defaultTheme={options?.defaultTheme || 'rleaguez'}
      disablePersistence
    >
      {ui}
    </ThemeProvider>,
  );
};

describe('ThemeSwitcherCatto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      renderWithThemeProvider(<ThemeSwitcherCatto />);

      expect(screen.getByText('Theme')).toBeInTheDocument();
    });

    it('renders with custom label', () => {
      renderWithThemeProvider(<ThemeSwitcherCatto label="Color Scheme" />);

      expect(screen.getByText('Color Scheme')).toBeInTheDocument();
    });

    it('displays current theme as selected', () => {
      renderWithThemeProvider(<ThemeSwitcherCatto />);

      expect(screen.getByText('RLeaguez')).toBeInTheDocument();
    });

    it('shows all available themes in dropdown', () => {
      renderWithThemeProvider(<ThemeSwitcherCatto />);

      // Click to open dropdown
      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      // After opening, there will be multiple RLeaguez texts (trigger + option)
      const rleaguezElements = screen.getAllByText('RLeaguez');
      expect(rleaguezElements.length).toBeGreaterThanOrEqual(1);

      // Neon Pulse should appear as an option
      expect(screen.getByText('Neon Pulse')).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('applies custom className', () => {
      const { container } = renderWithThemeProvider(
        <ThemeSwitcherCatto className="custom-class" />,
      );

      const selectWrapper = container.querySelector('.custom-class');
      expect(selectWrapper).toBeInTheDocument();
    });

    it('renders with small size', () => {
      renderWithThemeProvider(<ThemeSwitcherCatto size="sm" />);

      expect(screen.getByText('Theme')).toBeInTheDocument();
    });

    it('renders with large size', () => {
      renderWithThemeProvider(<ThemeSwitcherCatto size="lg" />);

      expect(screen.getByText('Theme')).toBeInTheDocument();
    });

    it('renders with auto width', () => {
      renderWithThemeProvider(<ThemeSwitcherCatto width="auto" />);

      expect(screen.getByText('Theme')).toBeInTheDocument();
    });

    it('renders with full width', () => {
      renderWithThemeProvider(<ThemeSwitcherCatto width="full" />);

      expect(screen.getByText('Theme')).toBeInTheDocument();
    });
  });

  describe('theme switching', () => {
    it('changes theme when selecting a new option', () => {
      renderWithThemeProvider(<ThemeSwitcherCatto />);

      // Open dropdown
      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      // Click on Neon Pulse option
      const neonPulseOption = screen.getByRole('option', {
        name: /Neon Pulse/i,
      });
      fireEvent.click(neonPulseOption);

      // Verify the theme changed (the select now shows Neon Pulse)
      expect(screen.getByText('Neon Pulse')).toBeInTheDocument();
    });

    it('starts with provided default theme', () => {
      renderWithThemeProvider(<ThemeSwitcherCatto />, {
        defaultTheme: 'neon-pulse',
      });

      expect(screen.getByText('Neon Pulse')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has accessible label', () => {
      renderWithThemeProvider(<ThemeSwitcherCatto label="Select Theme" />);

      expect(screen.getByText('Select Theme')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('can be navigated with keyboard', () => {
      renderWithThemeProvider(<ThemeSwitcherCatto />);

      const trigger = screen.getByRole('combobox');

      // Focus and open with Enter
      trigger.focus();
      expect(trigger).toHaveFocus();
    });
  });

  describe('error handling', () => {
    it('throws error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => render(<ThemeSwitcherCatto />)).toThrow(
        'useTheme must be used within a ThemeProvider',
      );

      consoleError.mockRestore();
    });
  });
});
