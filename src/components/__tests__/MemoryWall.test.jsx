import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import MemoryWall from '../MemoryWall.jsx';

// Mock URL.createObjectURL
window.URL.createObjectURL = vi.fn(() => 'mock-url');

describe('MemoryWall', () => {
  test('renders memory wall with initial memories', () => {
    render(<MemoryWall />);

    expect(screen.getByText('Tapestry of Cherished Moments')).toBeInTheDocument();
    expect(screen.getByText('Such a beautiful day! Congrats!')).toBeInTheDocument();
    expect(screen.getByText('Wishing you a lifetime of happiness!')).toBeInTheDocument();
    expect(screen.getByText('Emily')).toBeInTheDocument();
    expect(screen.getByText('Michael')).toBeInTheDocument();
  });

  test('renders memory form with required fields', () => {
    render(<MemoryWall />);

    expect(screen.getByPlaceholderText('Your name (if you wish to sign)')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Share a treasured memory or heartfelt message...')
    ).toBeInTheDocument();
    expect(screen.getByText('Add to Our Story')).toBeInTheDocument();
  });

  test('submit button is disabled when message is empty', () => {
    render(<MemoryWall />);

    const submitBtn = screen.getByRole('button', { name: /add to our story/i });
    expect(submitBtn).toBeDisabled();
  });

  test('submit button is enabled when message is filled', () => {
    render(<MemoryWall />);

    const messageInput = screen.getByPlaceholderText(
      'Share a treasured memory or heartfelt message...'
    );
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    const submitBtn = screen.getByRole('button', { name: /add to our story/i });
    expect(submitBtn).not.toBeDisabled();
  });

  test('can add a new memory', async () => {
    render(<MemoryWall />);

    const nameInput = screen.getByPlaceholderText('Your name (if you wish to sign)');
    const messageInput = screen.getByPlaceholderText(
      'Share a treasured memory or heartfelt message...'
    );
    const submitBtn = screen.getByRole('button', { name: /add to our story/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(messageInput, { target: { value: 'Test memory message' } });
    fireEvent.click(submitBtn);

    // Should show "Weaving into our tapestry..." during submission
    expect(screen.getByText('Weaving into our tapestry...')).toBeInTheDocument();

    // Wait for the new memory to appear
    await waitFor(
      () => {
        expect(screen.getByText('Test memory message')).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  test('displays emoji reaction buttons', () => {
    render(<MemoryWall />);

    // Check for emoji buttons
    expect(screen.getAllByText('❤️').length).toBeGreaterThan(0);
    expect(screen.getAllByText('😂').length).toBeGreaterThan(0);
    expect(screen.getAllByText('🥰').length).toBeGreaterThan(0);
    expect(screen.getAllByText('🎉').length).toBeGreaterThan(0);
  });

  test('can react with emojis', () => {
    render(<MemoryWall />);

    // Find the first heart emoji button and click it
    const heartButtons = screen.getAllByRole('button', { name: /react with ❤️/i });
    fireEvent.click(heartButtons[0]);

    // The reaction count should increase (Emily's memory should go from 2 to 3)
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('handles file upload for image preview', async () => {
    const { container } = render(<MemoryWall />);
    // Select the specific file input for memory wall (not the guest photo upload)
    const fileInput = container.querySelector('input[id="memory-image"]');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Should show preview image after file selection
    await waitFor(() => {
      expect(screen.getByAltText('Preview of uploaded memory')).toBeInTheDocument();
    });
  });
});
