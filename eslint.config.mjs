import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      // Test files and directories
      '**/__tests__/**',
      '**/*.test.{js,jsx,ts,tsx}',
      '**/*.spec.{js,jsx,ts,tsx}',
      '**/test-*.{js,jsx,ts,tsx}',
      '**/setupTests.{js,jsx,ts,tsx}',
      '**/test-globals.{js,jsx,ts,tsx}',
      '**/*.stories.{js,jsx,ts,tsx}',
      'stories/**',
      'cypress/**',
      'coverage/**',

      // Build and deployment directories
      'dist/**',
      'build/**',
      '.next/**',
      'out/**',
      '.vercel/**',
      'node_modules/**',

      // Configuration files
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'babel.config.*',
      'jest.config.*',
      'vitest.config.*',
      'cypress.config.*',
      'postcss.config.*',

      // Storybook
      '.storybook/**',

      // Backend directory (has its own linting)
      'backend/**',

      // Scripts directory
      'scripts/**',

      // Legacy ESLint configs (PREVENTION)
      '.eslintrc.json',
      '.eslintrc.js',
      '.eslintrc.yml',
      '.eslintrc.yaml',
      '.eslintrc',

      // Other files to ignore
      'public/**',
      'logs/**',
      '*.log',
      '.eslintcache',
      '.tsbuildinfo',
      'tsconfig.tsbuildinfo',
    ],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Node globals
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',

        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        screen: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',

        // Web APIs
        fetch: 'readonly',
        FormData: 'readonly',
        URLSearchParams: 'readonly',
        AbortController: 'readonly',
        RequestInit: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        Headers: 'readonly',
        URL: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        Image: 'readonly',
        Audio: 'readonly',
        CustomEvent: 'readonly',
        Event: 'readonly',
        EventTarget: 'readonly',

        // Performance APIs
        performance: 'readonly',
        PerformanceObserver: 'readonly',
        IntersectionObserver: 'readonly',
        MutationObserver: 'readonly',
        ResizeObserver: 'readonly',

        // Timers
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',

        // CSS
        CSS: 'readonly',
        CSSStyleSheet: 'readonly',

        // Alert functions (though we should avoid these)
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',

        // Analytics (if using)
        gtag: 'readonly',

        // Test globals (for jest/vitest)
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        vi: 'readonly',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      '@next/next': nextPlugin,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'warn',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-function': 'off',

      // Accessibility rules
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'jsx-a11y/click-events-have-key-events': 'off', // Too strict for our use case
      'jsx-a11y/no-static-element-interactions': 'off', // Too strict for our use case

      // General rules
      'no-unused-vars': 'off', // Use TypeScript version instead
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-empty': 'warn',

      // Next.js rules
      '@next/next/no-img-element': 'warn',
      '@next/next/no-html-link-for-pages': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/__tests__/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    ignores: [
      // Global ignore patterns - LEGACY CONFIG PREVENTION
      '.eslintrc.json',
      '.eslintrc.js',
      '.eslintrc.yml',
      '.eslintrc.yaml',
      '.eslintrc',

      // Standard ignores
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      '.vercel/**',
      'public/**',
      'scripts/**',
      'backend/**',
      '.storybook/**',
      'cypress/**',
      'stories/**',
      'logs/**',
      '*.log',
      '.eslintcache',
      '.tsbuildinfo',
      'tsconfig.tsbuildinfo',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'babel.config.*',
      'jest.config.*',
      'vitest.config.*',
      'cypress.config.*',
      'postcss.config.*',
    ],
  },
];
