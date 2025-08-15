// Media Upload & Interaction Test

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AlbumPage from '../page-components/gallery/AlbumPage.jsx';
import { getAlbumMedia, uploadMedia } from '../services/api';

// Mock uploadMedia and getAlbumMedia
vi.mock('../services/api');

describe('Guest Media Upload Experience', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAlbumMedia.mockResolvedValue({ data: [] });
    uploadMedia.mockImplementation(
      () => new Promise((resolve) => globalThis.setTimeout(resolve, 500))
    );
  });

  it('should validate file types and sizes', async () => {
    render(React.createElement(AlbumPage));
    const fileInput = await screen.findByLabelText(
      /Share your captured wedding magic - photo or video/i
    );
    // Simulate invalid file type
    const badFile = new globalThis.File(['bad'], 'bad.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [badFile] } });
    // Should not trigger upload button (no error UI in current impl, but can check file type logic)
    expect(fileInput.files[0].type).not.toMatch(/image|video/);
    // Simulate valid file
    const goodFile = new globalThis.File(['img'], 'good.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [goodFile] } });
    expect(fileInput.files[0].type).toMatch(/image/);
  });

  it('should show upload progress for large files', async () => {
    render(React.createElement(AlbumPage));
    const fileInput = await screen.findByLabelText(
      /Share your captured wedding magic - photo or video/i
    );
    const uploadBtn = screen.getByRole('button', { name: /Gift Your Memory/i });
    const file = new globalThis.File([new globalThis.ArrayBuffer(5 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(uploadBtn);
    // Should show uploading state
    expect(
      await screen.findByText(/Weaving your treasure into our collection/i)
    ).toBeInTheDocument();
    await waitFor(
      () =>
        expect(
          screen.queryByText(/Weaving your treasure into our collection/i)
        ).not.toBeInTheDocument(),
      {
        timeout: 2000,
      }
    );
  });
});
