import { readFileSync, writeFileSync } from 'fs';
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
    '@capacitor/core',
    '@capacitor/push-notifications',
  ],
  async onSuccess() {
    const jsFiles = await glob('dist/**/*.{js,cjs}');
    for (const file of jsFiles) {
      const content = readFileSync(file, 'utf-8');
      if (!content.startsWith('"use client"')) {
        writeFileSync(file, `"use client";\n${content}`);
      }
    }
    console.log('Added "use client" directive to all output files');
  },
});
