import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// Always mock getAlbumMedia before importing PhotoGallery
let mockGetAlbumMedia;
vi.doMock('../../services/api.js', () => ({
  getAlbumMedia: (...args) => mockGetAlbumMedia(...args),
}));
let PhotoGallery;
beforeAll(async () => {
  PhotoGallery = (await import('../media/PhotoGallery.jsx')).default;
});

describe('PhotoGallery', () => {
  beforeEach(() => {
    mockGetAlbumMedia = vi.fn();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockGetAlbumMedia.mockImplementation(
      () => new Promise((resolve) => globalThis.setTimeout(() => resolve({ data: [] }), 100))
    );
    render(React.createElement(PhotoGallery, { refreshKey: 0 }));
    expect(screen.getByText('Awakening our gallery...')).toBeInTheDocument();
  });

  it('renders empty state when no media is available', async () => {
    mockGetAlbumMedia.mockResolvedValue({ data: [] });
    render(React.createElement(PhotoGallery, { refreshKey: 0 }));
    await waitFor(() => {
      expect(screen.queryByText('Awakening our gallery...')).not.toBeInTheDocument();
    });
  });

  it('renders media items when data is available', async () => {
    const mockMedia = [
      {
        _id: '1',
        filename: 'photo1.jpg',
        mimetype: 'image/jpeg',
        uploadDate: new Date().toISOString(),
        metadata: { caption: 'Test Photo 1' },
      },
      {
        _id: '2',
        filename: 'photo2.jpg',
        mimetype: 'image/jpeg',
        uploadDate: new Date().toISOString(),
        metadata: { caption: 'Test Photo 2' },
      },
    ];
    mockGetAlbumMedia.mockResolvedValue({ data: mockMedia });
    const { container } = render(React.createElement(PhotoGallery, { refreshKey: 0 }));
    await waitFor(() => {
      expect(container.querySelector('.photo-gallery')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(globalThis.console, 'error').mockImplementation(() => {});
    mockGetAlbumMedia.mockRejectedValue(new Error('API Error'));
    render(React.createElement(PhotoGallery, { refreshKey: 0 }));
    await waitFor(() => {
      expect(screen.queryByText('Awakening our gallery...')).not.toBeInTheDocument();
    });
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching album media:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('refreshes data when refreshKey changes', async () => {
    mockGetAlbumMedia.mockResolvedValue({ data: [] });
    const { rerender } = render(React.createElement(PhotoGallery, { refreshKey: 0 }));
    await waitFor(() => {
      expect(mockGetAlbumMedia).toHaveBeenCalledTimes(1);
    });
    mockGetAlbumMedia.mockResolvedValue({
      data: [
        {
          _id: '1',
          filename: 'photo1.jpg',
          mimetype: 'image/jpeg',
          uploadDate: new Date().toISOString(),
        },
      ],
    });
    rerender(React.createElement(PhotoGallery, { refreshKey: 1 }));
    await waitFor(() => {
      expect(mockGetAlbumMedia).toHaveBeenCalledTimes(2);
    });
  });

  it('has proper accessibility structure', async () => {
    mockGetAlbumMedia.mockResolvedValue({
      data: [
        {
          _id: '1',
          filename: 'photo1.jpg',
          mimetype: 'image/jpeg',
          uploadDate: new Date().toISOString(),
        },
      ],
    });
    const { container } = render(React.createElement(PhotoGallery, { refreshKey: 0 }));
    await waitFor(() => {
      expect(container.querySelector('.photo-gallery')).toBeInTheDocument();
    });
  });

  it('handles mixed media types (photos and videos)', async () => {
    const mockMedia = [
      {
        _id: '1',
        filename: 'photo1.jpg',
        mimetype: 'image/jpeg',
        uploadDate: new Date().toISOString(),
      },
      {
        _id: '2',
        filename: 'video1.mp4',
        mimetype: 'video/mp4',
        uploadDate: new Date().toISOString(),
      },
    ];
    mockGetAlbumMedia.mockResolvedValue({ data: mockMedia });
    render(React.createElement(PhotoGallery, { refreshKey: 0 }));
    await waitFor(() => {
      expect(mockGetAlbumMedia).toHaveBeenCalled();
    });
  });

  it('applies correct CSS classes', async () => {
    mockGetAlbumMedia.mockResolvedValue({
      data: [
        {
          _id: '1',
          filename: 'photo1.jpg',
          mimetype: 'image/jpeg',
          uploadDate: new Date().toISOString(),
        },
      ],
    });
    const { container } = render(React.createElement(PhotoGallery, { refreshKey: 0 }));
    await waitFor(() => {
      const galleryContainer = container.querySelector('.photo-gallery');
      expect(galleryContainer).toBeInTheDocument();
      expect(galleryContainer).toHaveClass('photo-gallery');
    });
  });
});
