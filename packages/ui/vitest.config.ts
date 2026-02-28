import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    // Server deps for SSR handling
    server: {
      deps: {
        inline: ['react-hook-form', '@hookform/resolvers'],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/components/**/*.tsx',
        'src/hooks/**/*.ts',
        'src/utils/**/*.ts',
      ],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/**/*.stories.{ts,tsx}',
        'src/**/index.ts',
      ],
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 60,
        lines: 60,
      },
    },
    // Use threads for better Windows compatibility with paths containing spaces
    pool: 'threads',
    testTimeout: 10000,
  },
});
