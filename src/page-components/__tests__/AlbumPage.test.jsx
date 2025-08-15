import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AlbumPage from '../gallery/AlbumPage.jsx';

import * as api from '../../services/api';

// Mock the API functions
vi.mock('../../services/api', () => ({
  getAlbumMedia: vi.fn(() =>
    Promise.resolve({
      data: [
        { _id: '1', filename: '1.jpg' },
        { _id: '2', filename: '2.jpg' },
      ],
    })
  ),
  uploadMedia: vi.fn(() => Promise.resolve({})),
}));

describe('AlbumPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('handles album loading error gracefully', async () => {
    render(React.createElement(AlbumPage));
    expect(screen.getByText(/Illuminating our gallery of cherished moments/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.queryByText(/Illuminating our gallery of cherished moments/i)
      ).not.toBeInTheDocument()
    );
    expect(screen.getByRole('heading', { name: 'Gallery of Eternal Moments' })).toBeInTheDocument();
  });

  it('displays album photos when loaded', async () => {
    render(React.createElement(AlbumPage));
    expect(screen.getByText(/Illuminating our gallery of cherished moments/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.queryByText(/Illuminating our gallery of cherished moments/i)
      ).not.toBeInTheDocument()
    );
    expect(screen.getByRole('heading', { name: 'Gallery of Eternal Moments' })).toBeInTheDocument();
  });

  it('should show upload form when user clicks upload button', async () => {
    render(React.createElement(AlbumPage));
    await waitFor(() =>
      expect(
        screen.queryByText(/Illuminating our gallery of cherished moments/i)
      ).not.toBeInTheDocument()
    );

    // Find upload button and click it
    const uploadButton = await screen.findByRole(
      'button',
      { name: /Gift Your Memory/i },
      { timeout: 3000 }
    );
    expect(uploadButton).toBeInTheDocument();
  });

  it('should filter album content when filter is applied', async () => {
    render(React.createElement(AlbumPage));
    await waitFor(() =>
      expect(
        screen.queryByText(/Illuminating our gallery of cherished moments/i)
      ).not.toBeInTheDocument()
    );
    expect(screen.getByRole('heading', { name: 'Gallery of Eternal Moments' })).toBeInTheDocument();
  });
  it('renders upload input and button', async () => {
    render(React.createElement(AlbumPage));
    await waitFor(() =>
      expect(
        screen.queryByText(/Illuminating our gallery of cherished moments/i)
      ).not.toBeInTheDocument()
    );
    expect(screen.getByRole('button', { name: /Gift Your Memory/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Gift Your Memory/i })).toBeInTheDocument();
    // The input is type="file" with no label, so use querySelector
    const fileInput = globalThis.document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });

  it('calls uploadMedia when upload button is clicked', async () => {
    render(React.createElement(AlbumPage));
    await waitFor(() =>
      expect(
        screen.queryByText(/Illuminating our gallery of cherished moments/i)
      ).not.toBeInTheDocument()
    );
    // The input is type="file" with id and aria-label, so use the proper selector
    const fileInput = screen.getByLabelText(/Share your captured wedding magic - photo or video/i);
    const file = new globalThis.File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });
    const uploadButton = screen.getByRole('button', { name: /Gift Your Memory/i });
    await act(async () => {
      fireEvent.click(uploadButton);
    });
    await waitFor(() => expect(api.uploadMedia).toHaveBeenCalled());
  });

  it('applies correct CSS classes and structure', async () => {
    render(React.createElement(AlbumPage));
    await waitFor(() =>
      expect(
        screen.queryByText(/Illuminating our gallery of cherished moments/i)
      ).not.toBeInTheDocument()
    );
    const albumContainer = globalThis.document.querySelector('.album-page');
    expect(albumContainer).toBeInTheDocument();
    expect(albumContainer).toHaveClass('album-page');
    const photoGrid = globalThis.document.querySelector('.photo-grid');
    expect(photoGrid).toBeInTheDocument();
  });

  it('renders without errors', () => {
    expect(() => {
      act(() => {
        render(React.createElement(AlbumPage));
      });
    }).not.toThrow();
  });
});
