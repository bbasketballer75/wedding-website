import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AdminPage from '../admin/AdminPage.jsx';

describe('AdminPage', () => {
  it('renders password prompt if no adminKey', async () => {
    sessionStorage.removeItem('adminKey');
    await act(async () => {
      render(<AdminPage />);
    });
    expect(screen.getByPlaceholderText('Enter admin key')).toBeInTheDocument();
  });

  it('renders dashboard if adminKey is present', async () => {
    sessionStorage.setItem('adminKey', 'test-key');
    await act(async () => {
      render(<AdminPage />);
    });
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
  });
});
