import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  esbuild: {
    jsx: 'automatic',
    target: 'node14',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-globals.js', './src/setupTests.js'],
    exclude: [
      'backend/**/*',
      'node_modules/**/*',
      'coverage/**/*',
      'cypress/**/*',
      'dist/**/*',
      '.next/**/*',
      '*.config.js',
      '*.config.ts',
    ],
    include: ['src/**/*.test.{js,jsx,ts,tsx}'],
  },
});
