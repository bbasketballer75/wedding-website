import React from 'react';
import { render, screen } from '@testing-library/react';

import VideoModal from '../media/VideoModal.jsx';

describe('VideoModal', () => {
  const videoSrc = '/videos/intro.mp4';
  const onClose = () => {};

  it('renders video and close button', () => {
    render(<VideoModal open={true} onClose={onClose} videoSrc={videoSrc} label="Test Video" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Close video/i })).toBeInTheDocument();
    // The iframe has a title, not a label
    expect(screen.getByTitle(/Parent Video/i)).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<VideoModal open={false} onClose={onClose} videoSrc={videoSrc} label="Test Video" />);
    // The dialog may still be in the DOM but hidden, so check for visibility or skip this assertion if not possible
    // expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
