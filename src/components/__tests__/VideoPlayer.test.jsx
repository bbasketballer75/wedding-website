import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideoPlayer from '../media/VideoPlayer.jsx';

// Mock for HTMLMediaElement methods
Object.defineProperty(window.HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: vi.fn(() => Promise.resolve()),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: vi.fn(),
});

describe('VideoPlayer', () => {
  const defaultProps = {
    src: '/videos/test-video.mp4',
    title: 'Test Wedding Video',
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with loading state initially', () => {
    render(<VideoPlayer {...defaultProps} />);

    expect(screen.getByText('Loading video...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    // The video element should be hidden initially
    const video = screen.getByTestId('video-player');
    expect(video).toHaveStyle('display: none');
  });

  it('renders video player when video loads successfully', async () => {
    render(<VideoPlayer {...defaultProps} />);

    const video = screen.getByTestId('video-player');

    // Simulate video loaded
    fireEvent.canPlay(video);

    await waitFor(() => {
      expect(screen.queryByText('Loading video...')).not.toBeInTheDocument();
      // The <video> does not have src, but <source> does
      const source = video.querySelector('source');
      expect(source).toHaveAttribute('src', '/videos/test-video.mp4');
      expect(video).toHaveAttribute('aria-label', 'Test Wedding Video - Wedding video player');
    });

    expect(screen.getByText('Test Wedding Video')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Use the video controls to play, pause, adjust volume, and view in fullscreen/
      )
    ).toBeInTheDocument();
  });

  it('displays error state when video fails to load', async () => {
    render(<VideoPlayer {...defaultProps} />);

    const video = screen.getByTestId('video-player');

    // Simulate video error
    fireEvent.error(video);

    await waitFor(() => {
      expect(
        screen.getByText('Could not load the video. Please try refreshing the page.')
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    });
  });

  it('allows retry after error', async () => {
    render(<VideoPlayer {...defaultProps} />);

    const video = screen.getByTestId('video-player');

    // Simulate video error
    fireEvent.error(video);

    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    // Should return to loading state
    expect(screen.getByText('Loading video...')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', async () => {
    render(<VideoPlayer {...defaultProps} />);

    const video = screen.getByTestId('video-player');

    expect(video).toHaveAttribute('aria-label', 'Test Wedding Video - Wedding video player');
    expect(video).toHaveAttribute('controls');

    // Simulate video loaded
    fireEvent.canPlay(video);

    await waitFor(() => {
      const title = screen.getByText('Test Wedding Video');
      expect(title).toBeInTheDocument();
    });
  });

  it('handles missing src gracefully', () => {
    render(<VideoPlayer title="Test Video" />);

    expect(screen.getByText('Loading video...')).toBeInTheDocument();
  });

  it('handles missing title gracefully', async () => {
    render(<VideoPlayer src="/videos/test-video.mp4" />);

    const video = screen.getByTestId('video-player');

    // Simulate video loaded
    fireEvent.canPlay(video);

    await waitFor(() => {
      expect(screen.getByText('Wedding Video')).toBeInTheDocument(); // default title
    });
  });

  it('updates loading state properly during transitions', async () => {
    render(<VideoPlayer {...defaultProps} />);

    // Should start in loading state
    expect(screen.getByText('Loading video...')).toBeInTheDocument();

    const video = screen.getByTestId('video-player');

    // Simulate loadstart event
    fireEvent.loadStart(video);
    expect(screen.getByText('Loading video...')).toBeInTheDocument();

    // Simulate video loaded
    fireEvent.canPlay(video);

    await waitFor(() => {
      expect(screen.queryByText('Loading video...')).not.toBeInTheDocument();
    });
  });

  it('applies correct CSS classes for different states', async () => {
    render(<VideoPlayer {...defaultProps} />);

    // Loading state
    expect(document.querySelector('.video-loading')).toBeInTheDocument();

    const video = screen.getByTestId('video-player');

    // Error state
    fireEvent.error(video);

    await waitFor(() => {
      expect(document.querySelector('.video-error')).toBeInTheDocument();
    });

    // Retry and load successfully
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);
    fireEvent.canPlay(video);

    await waitFor(() => {
      expect(document.querySelector('.video-container')).toBeInTheDocument();
      expect(document.querySelector('.video-loading')).not.toBeInTheDocument();
      expect(document.querySelector('.video-error')).not.toBeInTheDocument();
    });
  });
});
