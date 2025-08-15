import { render, screen } from '@testing-library/react';
import PropTypes from 'prop-types';
import React from 'react';

import Home from '../app/page';

// Mock web-vitals library
vi.mock('web-vitals', () => ({
  getCLS: vi.fn((callback) =>
    callback({ name: 'CLS', value: 0.1, id: 'test', delta: 0, entries: [] })
  ),
  getFID: vi.fn((callback) =>
    callback({ name: 'FID', value: 50, id: 'test', delta: 0, entries: [] })
  ),
  getFCP: vi.fn((callback) =>
    callback({ name: 'FCP', value: 1500, id: 'test', delta: 0, entries: [] })
  ),
  getLCP: vi.fn((callback) =>
    callback({ name: 'LCP', value: 2000, id: 'test', delta: 0, entries: [] })
  ),
  getTTFB: vi.fn((callback) =>
    callback({ name: 'TTFB', value: 500, id: 'test', delta: 0, entries: [] })
  ),
}));

// Mock all the service calls
vi.mock('../../services/api.js', () => ({
  logVisit: vi.fn().mockResolvedValue({}),
  getAlbumMedia: vi.fn(() => Promise.resolve({ data: [] })),
}));

// Mock HTMLAudioElement
window.HTMLAudioElement.prototype.play = vi.fn();
window.HTMLAudioElement.prototype.pause = vi.fn();
window.HTMLAudioElement.prototype.load = vi.fn();

// Mock URL.createObjectURL
window.URL.createObjectURL = vi.fn(() => 'mock-url');

// Mock Next.js dynamic imports to return simple components
vi.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => {
    const MockComponent = () =>
      React.createElement('div', { 'data-testid': 'mock-component' }, 'Loading...');
    MockComponent.displayName = 'MockedDynamicComponent';
    return MockComponent;
  },
}));

// Mock all components being imported
vi.mock('../components/Navbar', () => ({
  __esModule: true,
  default: (props) =>
    React.createElement(
      'nav',
      {
        role: 'navigation',
        'data-testid': 'navbar',
      },
      'Navbar'
    ),
}));

vi.mock('../components/ThankYouSection', () => ({
  __esModule: true,
  default: () =>
    React.createElement(
      'section',
      {
        'data-testid': 'thank-you-section',
      },
      'Thank You Section'
    ),
}));

vi.mock('../../components/ui/LoadingScreen', () => ({
  __esModule: true,
  default: (props) =>
    React.createElement(
      'div',
      {
        'data-testid': 'loading-screen',
      },
      props?.message || 'Loading...'
    ),
}));

vi.mock('../components/StayInTouchSection', () => ({
  __esModule: true,
  default: () =>
    React.createElement(
      'section',
      {
        'data-testid': 'stay-in-touch-section',
      },
      'Stay In Touch'
    ),
}));

// Mock scroll fade in function
vi.mock('../scrollFadeIn', () => ({
  setupSectionFadeIn: vi.fn(),
}));

// Mock the AudioProvider and ToastProvider to avoid context issues
vi.mock('../components/AmbientSoundSystem', () => ({
  __esModule: true,
  AudioProvider: function AudioProvider(props) {
    AudioProvider.propTypes = { children: PropTypes.node };
    return React.createElement('div', { 'data-testid': 'audio-provider' }, props.children);
  },
  AudioControls: function AudioControls() {
    return React.createElement('div', { 'data-testid': 'audio-controls' }, 'Audio Controls');
  },
  useInteractionSounds: () => ({
    playClick: vi.fn(),
    playHover: vi.fn(),
    playSuccess: vi.fn(),
    playError: vi.fn(),
  }),
  default: () =>
    React.createElement('div', { 'data-testid': 'mock-ambient-sound' }, 'Audio Controls'),
}));

vi.mock('../components/MagicalToastSystem', () => ({
  __esModule: true,
  ToastProvider: function ToastProvider(props) {
    ToastProvider.propTypes = { children: PropTypes.node };
    return React.createElement('div', { 'data-testid': 'toast-provider' }, props.children);
  },
  default: () => React.createElement('div', { 'data-testid': 'mock-toast-system' }, 'Toast System'),
}));

// Mock all the other magical components
vi.mock('../components/RealTimeActivityFeed', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', { 'data-testid': 'real-time-activity-feed' }, 'Activity Feed'),
}));

vi.mock('../components/InteractiveLoveTimeline', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', { 'data-testid': 'interactive-love-timeline' }, 'Love Timeline'),
}));

describe('App (Next.js Home Page)', () => {
  test('renders main app structure', () => {
    render(React.createElement(Home));

    // Should have skip link
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();

    // Should have main content area
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('renders app container with proper class', () => {
    render(React.createElement(Home));

    // Should have modern app container
    const appContainer = document.querySelector('.modern-app');
    expect(appContainer).toBeInTheDocument();
  });

  test('contains proper accessibility structure', () => {
    render(React.createElement(Home));

    // Should have skip link with proper href
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toHaveAttribute('href', '#main-content');

    // Should have main navigation
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
