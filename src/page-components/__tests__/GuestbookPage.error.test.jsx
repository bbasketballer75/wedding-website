import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as api from '../../services/api';
import GuestbookPage from '../interactive/GuestbookPage.jsx';

vi.spyOn(api, 'getGuestbookEntries').mockResolvedValue({ data: [] });
vi.spyOn(api, 'createGuestbookEntry').mockImplementation(({ message }) => {
  if (!message.trim()) {
    return Promise.reject(new Error('Message is required.'));
  }
  return Promise.resolve({});
});

describe('GuestbookPage Error States', () => {
  it('shows error for empty message submission', async () => {
    render(<GuestbookPage />);
    // Use more specific selector for guestbook name field to avoid conflicts with photo upload
    await screen.findByLabelText(/Name \(optional\)/i);
    fireEvent.change(screen.getByLabelText(/Name \(optional\)/i), {
      target: { value: 'Test User' },
    });
    const textarea = screen.getByPlaceholderText(
      'Pour your heart into words... share a magical memory, offer wisdom for our journey, or simply bless us with your love!'
    );
    fireEvent.change(textarea, { target: { value: '' } });
    // eslint-disable-next-line no-console
    // ...existing code...
    const form = document.querySelector('.guestbook-form'); // More specific form selector
    await act(async () => {
      fireEvent.submit(form);
    });
    // eslint-disable-next-line no-console
    // ...existing code...
    await waitFor(() => {
      expect(
        screen.getByText(
          /We long to hear the whispers of your heart! Please share a beautiful message with us./i
        )
      ).toBeInTheDocument();
    });
  });
});
