import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { glob } from 'glob';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    'react',
    'react-dom',
    'next',
    'next/link',
    '@tanstack/react-table',
  ],
  async onSuccess() {
    // Prepend "use client" to all JS files after build
    const jsFiles = await glob('dist/**/*.{js,cjs}');
    for (const file of jsFiles) {
      const content = readFileSync(file, 'utf-8');
      if (!content.startsWith('"use client"')) {
        writeFileSync(file, `"use client";\n${content}`);
      }
    }
    console.log('Added "use client" directive to all output files');

    // Copy theme CSS files to dist/themes
    const themesDir = 'dist/themes';
    if (!existsSync(themesDir)) {
      mkdirSync(themesDir, { recursive: true });
    }

    const cssFiles = await glob('src/themes/*.css');
    for (const file of cssFiles) {
      const fileName = file.split(/[/\\]/).pop(); // Get just the filename
      const destFile = `dist/themes/${fileName}`;
      copyFileSync(file, destFile);
      console.log(`Copied ${file} -> ${destFile}`);
    }
    console.log('Theme CSS files copied to dist/themes');
  },
});
