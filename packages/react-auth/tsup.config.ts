import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    server: 'src/server/index.ts',
  },
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
    'next/headers',
    'next/server',
    'better-auth',
    'better-auth/react',
    'better-auth/adapters/prisma',
    'better-auth/next-js',
    'better-auth/api',
    'better-auth/cookies',
    'zustand',
    '@apollo/client',
    '@capacitor/core',
    '@capacitor/preferences',
    '@simplewebauthn/browser',
    'graphql',
  ],
  async onSuccess() {
    // Prepend "use client" to client entry files only (NOT server entry)
    const jsFiles = await glob('dist/index.{js,cjs}');
    for (const file of jsFiles) {
      const content = readFileSync(file, 'utf-8');
      if (!content.startsWith('"use client"')) {
        writeFileSync(file, `"use client";\n${content}`);
      }
    }
    console.log('Added "use client" directive to client entry files');
    // Note: server.js and server.cjs intentionally do NOT get "use client"
  },
});
