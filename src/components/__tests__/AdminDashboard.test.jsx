import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import AdminDashboard from '../admin/AdminDashboard.jsx';

// Mock the api service
vi.mock('../../services/api.js', () => ({
  getAllAlbumMedia: vi.fn(
    () => new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
  ),
  moderateMedia: vi.fn(),
}));

describe('AdminDashboard', () => {
  it('renders loading state initially', () => {
    render(<AdminDashboard adminKey="test-key" />);
    expect(screen.getByText('Loading submissions...')).toBeInTheDocument();
  });

  it('renders empty state when no submissions', async () => {
    render(<AdminDashboard adminKey="test-key" />);
    // Wait for loading to finish
    await screen.findByText('No submissions to moderate.');
    expect(screen.getByText('No submissions to moderate.')).toBeInTheDocument();
  });
});
