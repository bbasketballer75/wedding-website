// End-to-End Guest Journey Test (Next.js App Router compatible)

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../page-components/core/HomePage';

// Mock Next.js router for testing
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

describe('Complete Guest Journey', () => {
  it('should allow a guest to view album, sign guestbook, and explore wedding party', async () => {
    render(<HomePage />);

    // Wait for landing page and enter site
    const enterButton = await screen.findByRole(
      'button',
      { name: /enter wedding site/i },
      { timeout: 2000 }
    );
    fireEvent.click(enterButton);

    // Album: Navigate to album section
    const albumNav = screen.getByRole('link', { name: /album/i });
    fireEvent.click(albumNav);
    await waitFor(() => {
      expect(screen.getByText(/photo & video album/i)).toBeInTheDocument();
    });

    // Guestbook: Navigate to guestbook section
    const guestbookNav = screen.getByRole('link', { name: /guestbook/i });
    fireEvent.click(guestbookNav);
    await waitFor(() => {
      expect(screen.getByText(/guestbook/i)).toBeInTheDocument();
    });

    // Fill out and submit guestbook form
    fireEvent.change(screen.getByPlaceholderText(/your name/i), {
      target: { value: 'Test Guest' },
    });
    fireEvent.change(screen.getByPlaceholderText(/share your favorite memory/i), {
      target: { value: 'Congrats!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign|post|submit/i }));
    await waitFor(() => {
      expect(screen.getByText(/thank you for signing/i)).toBeInTheDocument();
    });

    // Wedding Party: Navigate to wedding party section
    const partyNav = screen.getByRole('link', { name: /wedding party/i });
    fireEvent.click(partyNav);
    await waitFor(() => {
      expect(screen.getByText(/the wedding party/i)).toBeInTheDocument();
    });
  });
});
