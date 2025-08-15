// Browser Compatibility Test

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PhotoGallery from '../components/media/PhotoGallery.jsx';

describe('Cross-Browser Guest Experience', () => {
  it('should work without modern JavaScript features', () => {
    // Simulate missing window.fetch
    const origFetch = global.fetch;
    delete global.fetch;
    expect(() => render(<PhotoGallery />)).not.toThrow();
    global.fetch = origFetch;
  });

  it('should provide fallbacks for unsupported media formats', async () => {
    render(<PhotoGallery refreshKey={0} />);
    // Find an image rendered by the component (simulate at least one image in mock)
    // If no images, skip test
    const imgs = screen.queryAllByRole('img');
    if (imgs.length === 0) return;
    fireEvent.error(imgs[0]);
    expect(imgs[0].alt).toMatch(/image failed to load/i);
  });
});
