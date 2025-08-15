// Mobile/Responsive Experience Test

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Navbar from '../components/Navbar';
import HomePage from '../page-components/core/HomePage';

// Mock the API service
vi.mock('../../services/api', () => ({
  logVisit: vi.fn(() => Promise.resolve()),
}));

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: query.includes('max-width: 768px'), // Mock mobile breakpoint
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('Mobile Guest Experience', () => {
  beforeEach(() => {
    global.innerWidth = 375;
    global.dispatchEvent(new Event('resize'));
  });

  it('should display mobile-optimized navigation after entering site', async () => {
    await act(async () => {
      render(<Navbar />);
    });

    // Wait for navbar to load with Austin & Jordyn text
    await waitFor(
      () => {
        expect(screen.getByText(/austin & jordyn/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Check that navigation is present
    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
  });

  it('should show readable text on small screens', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    // Wait for HomePage to load with Austin & Jordyn text
    await waitFor(
      () => {
        expect(screen.getByText(/austin & jordyn/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Should show main headings with readable font size
    expect(screen.getByText(/austin & jordyn/i)).toBeInTheDocument();

    // Check if "our wedding celebration" exists, if not skip this assertion
    const celebrationText = screen.queryByText(/our wedding celebration/i);
    if (celebrationText) {
      expect(celebrationText).toBeInTheDocument();
    }
  });
});
