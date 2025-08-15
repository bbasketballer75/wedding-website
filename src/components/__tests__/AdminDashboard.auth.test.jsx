import { act, render, screen } from '@testing-library/react';
import * as api from '../../services/api';
import AdminDashboard from '../admin/AdminDashboard.jsx';

describe('AdminDashboard Unauthorized Access', () => {
  beforeAll(() => {
    vi.spyOn(api, 'getAllAlbumMedia').mockRejectedValue({
      response: { data: { message: 'Could not fetch media. Is the admin key correct?' } },
    });
  });

  it('shows error if adminKey is missing or invalid', async () => {
    await act(async () => {
      render(<AdminDashboard adminKey={null} />);
    });
    expect(await screen.findByRole('alert')).toHaveTextContent(/Invalid admin key/i);
  });
});
