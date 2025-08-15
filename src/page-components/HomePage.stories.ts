import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import HomePage from './HomePage';

const meta = {
  title: 'Wedding Website/Pages/HomePage',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The main homepage component featuring wedding highlights, photo galleries, and navigation.',
      },
    },
  },
  // Mock any required props or context
  decorators: [
    (Story: React.ComponentType) =>
      React.createElement(
        'div',
        {
          style: {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh',
          },
        },
        React.createElement(Story)
      ),
  ],
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const LoadingState: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Homepage in loading state while content is being fetched.',
      },
    },
  },
};

export const WithContent: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Homepage with fully loaded content and images.',
      },
    },
  },
};
