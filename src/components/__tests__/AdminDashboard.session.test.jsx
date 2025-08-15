import { act, render, screen } from '@testing-library/react';
import * as api from '../../services/api';
import AdminDashboard from '../admin/AdminDashboard.jsx';

describe('AdminDashboard Session', () => {
  it('persists admin session after refresh', async () => {
    sessionStorage.setItem('adminKey', 'test-key');
    await act(async () => {
      render(<AdminDashboard adminKey={sessionStorage.getItem('adminKey')} />);
    });
    expect(await screen.findByLabelText('Admin moderation dashboard')).toBeInTheDocument();
  });
});
vi.spyOn(api, 'getAllAlbumMedia').mockResolvedValue({ data: [] });
