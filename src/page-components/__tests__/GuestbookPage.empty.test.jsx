import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import GuestbookPage from '../interactive/GuestbookPage.jsx';

describe('GuestbookPage Empty State', () => {
  it('shows empty state when no entries are available', async () => {
    render(<GuestbookPage />);
    await waitFor(() =>
      expect(
        screen.getByText(
          /This sacred space awaits the first beautiful blessing. Will you be the one to begin our memory book?/i
        )
      ).toBeInTheDocument()
    );
  });
});
