// Error Recovery & Edge Cases Test
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AlbumPage from '../page-components/gallery/AlbumPage.jsx';
import MapPage from '../page-components/interactive/MapPage.jsx';
import { getAlbumMedia, getMapLocations } from '../services/api';

// Mock the API functions directly
vi.mock('../services/api');

describe('Guest Error Recovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should recover from temporary network issues in album', async () => {
    let callCount = 0;
    getAlbumMedia.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error('Network error'));
      }
      return Promise.resolve({ data: [] });
    });

    render(React.createElement(AlbumPage));

    // Wait for error message
    const errorEl = await screen.findByText(
      /Our photo sanctuary is temporarily resting/i,
      {},
      { timeout: 3000 }
    );
    expect(errorEl).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryBtn);

    // Wait for error to disappear (successful retry)
    await waitFor(
      () =>
        expect(
          screen.queryByText(/Our photo sanctuary is temporarily resting/i)
        ).not.toBeInTheDocument(),
      { timeout: 3000 }
    );
  });

  it('should recover from temporary network issues in map', async () => {
    let callCount = 0;
    getMapLocations.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error('Network error'));
      }
      return Promise.resolve({ data: [] });
    });

    render(React.createElement(MapPage));

    // Wait for error message
    const errorEl = await screen.findByText(
      /We can't load the love map right now/i,
      {},
      { timeout: 3000 }
    );
    expect(errorEl).toBeInTheDocument();
  });
});
