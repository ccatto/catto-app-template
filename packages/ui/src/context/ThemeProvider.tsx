'use client';

/**
 * @catto/ui ThemeProvider
 * =======================
 *
 * React context for runtime theme switching.
 * Manages theme state, localStorage persistence, and DOM updates.
 *
 * Usage:
 *   import { ThemeProvider, useTheme } from '@catto/ui';
 *
 *   // Wrap your app
 *   <ThemeProvider defaultTheme="rleaguez">
 *     <App />
 *   </ThemeProvider>
 *
 *   // Use in components
 *   const { theme, setTheme, availableThemes } = useTheme();
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { isValidTheme, THEMES, type ThemeName } from '../themes';

interface ThemeContextValue {
  /** Current active theme name */
  theme: ThemeName;
  /** Change the active theme */
  setTheme: (theme: ThemeName) => void;
  /** List of all available theme names */
  availableThemes: readonly ThemeName[];
  /** Whether the theme has been loaded from storage */
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  /** Default theme to use if none is saved */
  defaultTheme?: ThemeName;
  /** LocalStorage key for persisting theme choice */
  storageKey?: string;
  /** Disable localStorage persistence */
  disablePersistence?: boolean;
}

/**
 * ThemeProvider - Provides theme context to the app
 *
 * Features:
 * - Persists theme choice to localStorage
 * - Sets `data-theme` attribute on document root
 * - Prevents flash of wrong theme with isLoaded state
 */
export function ThemeProvider({
  children,
  defaultTheme = 'rleaguez',
  storageKey = 'catto-theme',
  disablePersistence = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(defaultTheme);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from storage on mount
  useEffect(() => {
    if (disablePersistence) {
      setIsLoaded(true);
      return;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && isValidTheme(stored)) {
        setThemeState(stored);
      }
    } catch (e) {
      // localStorage may not be available (SSR, privacy mode)
      console.warn('Failed to load theme from localStorage:', e);
    }
    setIsLoaded(true);
  }, [storageKey, disablePersistence]);

  // Apply theme to document when it changes
  useEffect(() => {
    if (!isLoaded) return;

    // Set data-theme attribute on document root
    document.documentElement.setAttribute('data-theme', theme);

    // Persist to localStorage
    if (!disablePersistence) {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (e) {
        console.warn('Failed to save theme to localStorage:', e);
      }
    }
  }, [theme, isLoaded, storageKey, disablePersistence]);

  const setTheme = useCallback((newTheme: ThemeName) => {
    if (isValidTheme(newTheme)) {
      setThemeState(newTheme);
    } else {
      console.warn(`Invalid theme name: ${newTheme}`);
    }
  }, []);

  const value: ThemeContextValue = {
    theme,
    setTheme,
    availableThemes: THEMES,
    isLoaded,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * useTheme - Hook to access theme context
 *
 * @throws Error if used outside ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * useThemeSafe - Hook that returns null if outside provider
 *
 * Useful for components that may or may not be inside a ThemeProvider
 */
export function useThemeSafe(): ThemeContextValue | null {
  return useContext(ThemeContext);
}
