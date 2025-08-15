import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

import OrientationOverlay from '../accessibility/OrientationOverlay.jsx';

// Mock window.matchMedia for jsdom
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: query.includes('portrait'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => {
  cleanup();
});

describe('OrientationOverlay', () => {
  it('renders overlay and button when show is true', () => {
    render(<OrientationOverlay />);
    expect(screen.getByText(/Please Rotate Your Device/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue Anyway/i })).toBeInTheDocument();
  });

  it('dismisses overlay when button is clicked', () => {
    render(<OrientationOverlay />);
    const button = screen.getByRole('button', { name: /Continue Anyway/i });
    fireEvent.click(button);
    expect(screen.queryByText(/Please Rotate Your Device/i)).not.toBeInTheDocument();
  });
});

beforeAll(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});
