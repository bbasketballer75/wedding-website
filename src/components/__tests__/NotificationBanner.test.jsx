import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import NotificationBanner from '../NotificationBanner.jsx';

describe('NotificationBanner', () => {
  test('does not render when message is empty', () => {
    render(<NotificationBanner message="" onClose={vi.fn()} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('does not render when message is null', () => {
    render(<NotificationBanner message={null} onClose={vi.fn()} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('renders notification with message', () => {
    const testMessage = 'Welcome! Enjoy the music and explore the memories.';
    render(<NotificationBanner message={testMessage} onClose={vi.fn()} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  test('has close button', () => {
    render(<NotificationBanner message="Test message" onClose={vi.fn()} />);

    const closeButton = screen.getByRole('button', { name: /close notification/i });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveTextContent('×');
  });

  test('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn();
    render(<NotificationBanner message="Test message" onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /close notification/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('has correct accessibility attributes', () => {
    render(<NotificationBanner message="Test message" onClose={vi.fn()} />);

    const notification = screen.getByRole('status');
    expect(notification).toHaveAttribute('aria-live', 'polite');
  });
});
