import { render, screen, waitFor } from '@testing-library/react';
import AlbumPage from '../../page-components/gallery/AlbumPage.jsx';

import * as api from '../../services/api';

vi.spyOn(api, 'getAlbumMedia').mockResolvedValue({ data: [] });

describe('AlbumPage Empty State', () => {
  it('shows empty state when no media is available', async () => {
    render(<AlbumPage />);
    await waitFor(() =>
      expect(
        screen.getByText(
          /This sacred gallery awaits your beautiful treasures! Be the first to grace our collection with a precious moment from our celebration./i
        )
      ).toBeInTheDocument()
    );
  });
});
