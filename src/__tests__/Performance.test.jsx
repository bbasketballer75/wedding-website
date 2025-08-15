// Performance & Loading Test

import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import AlbumPage from '../page-components/gallery/AlbumPage.jsx';
import { getAlbumMedia } from '../services/api';

// Mock the API
vi.mock('../services/api');

// Extract helper functions to reduce nesting
const createDelayedResolver = (data, delay = 1000) => {
  return new Promise((resolve) => {
    const timeoutHandler = () => resolve(data);
    globalThis.setTimeout(timeoutHandler, delay);
  });
};

const createRejectionHandler = (errorMessage) => {
  return () => Promise.reject(new Error(errorMessage));
};

describe('Guest Performance Experience', () => {
  it('should show loading states during slow network', async () => {
    getAlbumMedia.mockImplementation(() => createDelayedResolver({ data: [] }));

    render(React.createElement(AlbumPage));
    await screen.findByText(/Illuminating our gallery of cherished moments/i);
    await waitFor(
      () => expect(screen.queryByText(/Loading our beautiful memories/i)).not.toBeInTheDocument(),
      {
        timeout: 2500,
      }
    );
  });

  it('should handle network failures gracefully', async () => {
    getAlbumMedia.mockImplementation(createRejectionHandler('Network error'));

    render(React.createElement(AlbumPage));
    // Wait for error message to appear
    await screen.findByText(
      /Our photo sanctuary is temporarily resting. Please return in a moment to view our treasures!/i,
      {},
      { timeout: 2500 }
    );
  });
});
