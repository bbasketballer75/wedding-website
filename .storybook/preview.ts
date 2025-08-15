import type { Preview } from '@storybook/react';
import React from 'react';

const preview: Preview = {
  decorators: [
    (Story) =>
      React.createElement(
        'div',
        {
          style: {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          },
        },
        React.createElement(Story)
      ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Actions addon configuration
    actions: { argTypesRegex: '^on[A-Z].*' },
    // Docs configuration
    docs: {
      story: {
        inline: true,
      },
    },
    // A11y addon configuration
    a11y: {
      config: {},
      options: {
        checks: { 'color-contrast': { options: { noScroll: true } } },
        restoreScroll: true,
      },
    },
    // Backgrounds addon configuration for testing different themes
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#333333',
        },
      ],
    },
  },
};

export default preview;
