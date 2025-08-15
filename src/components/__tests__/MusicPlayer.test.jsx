import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import MusicPlayer from '../media/MusicPlayer.jsx';

// Mock HTMLAudioElement
window.HTMLAudioElement.prototype.play = vi.fn();
window.HTMLAudioElement.prototype.pause = vi.fn();
window.HTMLAudioElement.prototype.load = vi.fn();

describe('MusicPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('does not render when isEnabled is false', () => {
    render(<MusicPlayer isEnabled={false} />);
    expect(screen.queryByText('🎵')).not.toBeInTheDocument();
  });

  test('renders music player when enabled', () => {
    render(<MusicPlayer isEnabled={true} />);
    expect(screen.getByText('First Time (Acoustic)')).toBeInTheDocument();
    expect(screen.getByText('Custom Upload')).toBeInTheDocument();
  });

  test('displays play/pause controls', () => {
    render(<MusicPlayer isEnabled={true} />);
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous track/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next track/i })).toBeInTheDocument();
  });

  test('can minimize and expand player', () => {
    render(<MusicPlayer isEnabled={true} />);

    // Should show full player initially
    expect(screen.getByText('First Time (Acoustic)')).toBeInTheDocument();

    // Click minimize
    const minimizeBtn = screen.getByRole('button', { name: /minimize music player/i });
    fireEvent.click(minimizeBtn);

    // Should show minimized state
    expect(screen.getByRole('button', { name: /expand music player/i })).toBeInTheDocument();
    expect(screen.queryByText('First Time (Acoustic)')).not.toBeInTheDocument();

    // Click expand
    const expandBtn = screen.getByRole('button', { name: /expand music player/i });
    fireEvent.click(expandBtn);

    // Should show full player again
    expect(screen.getByText('First Time (Acoustic)')).toBeInTheDocument();
  });

  test('has volume control', () => {
    render(<MusicPlayer isEnabled={true} />);
    const volumeSlider = screen.getByRole('slider', { name: /volume control/i });
    expect(volumeSlider).toBeInTheDocument();
    expect(volumeSlider).toHaveAttribute('min', '0');
    expect(volumeSlider).toHaveAttribute('max', '1');
  });

  test('applies correct position class', () => {
    const { container } = render(<MusicPlayer isEnabled={true} position="bottom-right" />);
    expect(container.querySelector('.music-player.bottom-right')).toBeInTheDocument();
  });
});
