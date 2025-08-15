import { StateOfTheArtButton } from '../src/components/ui/StateOfTheArtButton';

export default {
  title: 'Design System/Button',
  component: StateOfTheArtButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'xl'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
  },
};

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Ghost = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Danger = {
  args: {
    variant: 'danger',
    children: 'Delete Item',
  },
};

export const AllSizes = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <StateOfTheArtButton variant="primary" size="small">
        Small
      </StateOfTheArtButton>
      <StateOfTheArtButton variant="primary" size="medium">
        Medium
      </StateOfTheArtButton>
      <StateOfTheArtButton variant="primary" size="large">
        Large
      </StateOfTheArtButton>
      <StateOfTheArtButton variant="primary" size="xl">
        XL
      </StateOfTheArtButton>
    </div>
  ),
};

export const Loading = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <StateOfTheArtButton variant="primary" loading>
        Loading...
      </StateOfTheArtButton>
      <StateOfTheArtButton variant="secondary" loading>
        Processing
      </StateOfTheArtButton>
    </div>
  ),
};

export const WeddingActions = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, #f6f9f4 0%, #eaf2e4 100%)',
        borderRadius: '16px',
        maxWidth: '400px',
      }}
    >
      <StateOfTheArtButton variant="primary" size="large">
        ▶️ Watch Wedding Video
      </StateOfTheArtButton>
      <StateOfTheArtButton variant="secondary" size="medium">
        📖 Sign Guestbook
      </StateOfTheArtButton>
      <StateOfTheArtButton variant="ghost" size="medium">
        📸 View Gallery
      </StateOfTheArtButton>
    </div>
  ),
};
