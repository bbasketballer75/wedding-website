import { defineConfig } from 'vitest/config';

export default defineConfig({
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
