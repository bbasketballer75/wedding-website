import { act, render, screen, waitFor } from '@testing-library/react';

import MapPage from '../interactive/MapPage.jsx';

vi.mock('../../services/api', () => ({
  getMapLocations: vi.fn(() => Promise.reject(new Error('Map service unavailable'))),
}));

describe('MapPage', () => {
  it('shows loading and then error message', async () => {
    await act(async () => {
      render(<MapPage />);
    });

    // Wait for loading to finish and error to appear
    await waitFor(() =>
      expect(screen.queryByText(/Mapping all the love/i)).not.toBeInTheDocument()
    );

    // Check for error message with alert role
    expect(screen.getByRole('alert')).toHaveTextContent(/We can't load the love map right now/i);
  });

  it('renders map container with heading', async () => {
    await act(async () => {
      render(<MapPage />);
    });
    await waitFor(() =>
      expect(screen.queryByText(/Mapping all the love/i)).not.toBeInTheDocument()
    );

    // Should render the main heading even with error
    expect(screen.getByRole('heading', { name: /Love Traveled Far & Wide/i })).toBeInTheDocument();
  });
});
