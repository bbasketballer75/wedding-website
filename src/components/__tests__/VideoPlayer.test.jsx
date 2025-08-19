/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import StateOfTheArtEnhancedVideoPlayer from '../media/StateOfTheArtEnhancedVideoPlayer';

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => React.createElement('div', props, children),
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn(),
  },
}));

// Mock the audio system
vi.mock('../AmbientSoundSystem', () => ({
  useInteractionSounds: () => ({
    playClick: vi.fn(),
    playHover: vi.fn(),
  }),
}));

// Mock the UI components used by StateOfTheArtEnhancedVideoPlayer
vi.mock('../ui/StateOfTheArtButton', () => ({
  __esModule: true,
  default: ({ children, onClick, className, ...props }) =>
    React.createElement('button', { onClick, className, ...props, 'data-testid': 'state-of-art-button' }, children),
}));

vi.mock('../ui/StateOfTheArtCard', () => ({
  __esModule: true,
  default: ({ children, className, ...props }) =>
    React.createElement('div', { className, ...props, 'data-testid': 'state-of-art-card' }, children),
}));

// Mock CSS modules
vi.mock('../../styles/components/StateOfTheArtVideoPlayer.module.css', () => ({
  default: {
    videoPlayer: 'video-player',
    videoElement: 'video-element',
    loadingOverlay: 'loading-overlay',
    loadingSpinner: 'loading-spinner',
    playOverlay: 'play-overlay',
    bigPlayButton: 'big-play-button',
    controlsOverlay: 'controls-overlay',
    controlsCard: 'controls-card',
    progressContainer: 'progress-container',
    progressBar: 'progress-bar',
    progressFill: 'progress-fill',
    progressHandle: 'progress-handle',
    timeDisplay: 'time-display',
    controlsRow: 'controls-row',
    leftControls: 'left-controls',
    centerControls: 'center-controls',
    rightControls: 'right-controls',
    volumeControl: 'volume-control',
    volumeSlider: 'volume-slider',
    volumeRange: 'volume-range',
    chapterInfo: 'chapter-info',
    chapterTitle: 'chapter-title',
    chapterMenu: 'chapter-menu',
    chapterCard: 'chapter-card',
    chapterHeader: 'chapter-header',
    chapterList: 'chapter-list',
    chapterItem: 'chapter-item',
    chapterNumber: 'chapter-number',
    chapterDetails: 'chapter-details',
    chapterEmoji: 'chapter-emoji',
    active: 'active',
    errorContainer: 'error-container',
    errorContent: 'error-content',
    fullscreen: 'fullscreen',
  },
}));

// Mock for HTMLMediaElement methods
Object.defineProperty(globalThis.HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(globalThis.HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: vi.fn(() => Promise.resolve()),
});

Object.defineProperty(globalThis.HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: vi.fn(),
});

// Mock video properties
Object.defineProperty(globalThis.HTMLMediaElement.prototype, 'currentTime', {
  writable: true,
  value: 0,
});

Object.defineProperty(globalThis.HTMLMediaElement.prototype, 'duration', {
  writable: true,
  value: 120, // 2 minutes
});

Object.defineProperty(globalThis.HTMLMediaElement.prototype, 'volume', {
  writable: true,
  value: 1,
});

Object.defineProperty(globalThis.HTMLMediaElement.prototype, 'muted', {
  writable: true,
  value: false,
});

describe('StateOfTheArtEnhancedVideoPlayer', () => {
  const defaultProps = {
    src: 'https://example.com/wedding-video.mp4',
    title: 'Test Wedding Video',
    posterSrc: 'https://example.com/poster.jpg',
  };

  const sampleChapters = [
    {
      title: 'Ceremony',
      startTime: 0,
      description: 'The wedding ceremony',
      emoji: '💒',
    },
    {
      title: 'Reception',
      startTime: 60,
      description: 'The wedding reception',
      emoji: '🎉',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with loading state initially', () => {
    render(<StateOfTheArtEnhancedVideoPlayer {...defaultProps}
      />);

    expect(screen.getByText('Loading your wedding film...')).toBeInTheDocument();
  });

  it('renders video element with correct props', () => {
    render(<StateOfTheArtEnhancedVideoPlayer {...defaultProps}
      />);

    const video = screen.getByRole('application');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('aria-label', 'Test Wedding Video - Enhanced video player');
  });

  it('displays error state when video fails to load', async () => {
    render(<StateOfTheArtEnhancedVideoPlayer {...defaultProps}
      />);

    const video = document.querySelector('video');

    // First trigger loadstart to clear loading, then error
    fireEvent.loadStart(video);
    fireEvent.error(video);

    await waitFor(() => {
      expect(screen.getByText('Unable to Load Video')).toBeInTheDocument();
      expect(screen.getByText(/Unable to load the wedding video/)).toBeInTheDocument();
    });
  });

  it('shows retry button in error state', async () => {
    render(<StateOfTheArtEnhancedVideoPlayer {...defaultProps}
      />);

    const video = document.querySelector('video');
    fireEvent.loadStart(video);
    fireEvent.error(video);

    await waitFor(() => {
      const retryButton = screen.getByText('Try Again');
      expect(retryButton).toBeInTheDocument();
    });
  });

  it('handles retry after error', async () => {
    render(<StateOfTheArtEnhancedVideoPlayer {...defaultProps}
      />);

    const video = document.querySelector('video');
    fireEvent.loadStart(video);
    fireEvent.error(video);

    // Wait for error state to show
    await waitFor(() => {
      expect(screen.getByText('Unable to Load Video')).toBeInTheDocument();
    });

    // Click retry button - should reset to loading state
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    // Verify loading state is shown after retry
    await waitFor(() => {
      expect(screen.getByText('Loading your wedding film...')).toBeInTheDocument();
    });
  });

  it('renders with chapters when provided', () => {
    render(
      <StateOfTheArtEnhancedVideoPlayer
        {...defaultProps}
        chapters={sampleChapters}
        showChapters={true}
      />
    );

    // Component should render without errors
    expect(screen.getByRole('application')).toBeInTheDocument();
  });

  it('handles missing src gracefully', () => {
    // Should not crash when src is undefined
    expect(() => {
      render(<StateOfTheArtEnhancedVideoPlayer title="Test Video"
      />);
    }).not.toThrow();
  });

  it('handles missing title gracefully', () => {
    render(<StateOfTheArtEnhancedVideoPlayer src="test.mp4"
      />);

    const video = screen.getByRole('application');
    expect(video).toHaveAttribute('aria-label', 'Austin & Jordyn\'s Wedding Film - Enhanced video player');
  });

  it('applies correct CSS classes for different states', () => {
    render(<StateOfTheArtEnhancedVideoPlayer {...defaultProps} className="custom-class"
      />);

    const container = screen.getByRole('application');
    expect(container).toHaveClass('video-player');
    expect(container).toHaveClass('custom-class');
  });

  it('can be imported without errors', () => {
    expect(StateOfTheArtEnhancedVideoPlayer).toBeDefined();
    expect(typeof StateOfTheArtEnhancedVideoPlayer).toBe('function');
  });
});
