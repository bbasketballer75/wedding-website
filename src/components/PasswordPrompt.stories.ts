import type { Meta, StoryObj } from '@storybook/react';
import PasswordPrompt from './PasswordPrompt';

const meta: Meta<typeof PasswordPrompt> = {
  title: 'Wedding Website/Components/PasswordPrompt',
  component: PasswordPrompt,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    docs: {
      description: {
        component: 'A password prompt component for admin access to the wedding website.',
      },
    },
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    onPasswordSubmit: { action: 'password-submitted' },
    isError: { control: 'boolean' },
    message: { control: 'text' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {},
};

// Accessibility test
export const AccessibilityTest: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'label',
            enabled: true,
          },
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};
