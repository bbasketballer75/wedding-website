import React from 'react';

describe('PasswordPrompt', () => {
  it('renders password input and submit button', () => {
    render(<PasswordPrompt open={true} onSubmit={() => {}} onClose={() => {}} />);
    expect(screen.getByPlaceholderText(/Enter admin key/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Unlock/i })).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<PasswordPrompt open={false} onSubmit={() => {}} onClose={() => {}} />);
    expect(screen.queryByLabelText(/Password/i)).not.toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordPrompt from '../forms/PasswordPrompt.jsx';

describe('PasswordPrompt', () => {
  it('renders the password prompt and calls onCorrectPassword on submit', async () => {
    const onCorrectPassword = vi.fn();
    render(<PasswordPrompt onCorrectPassword={onCorrectPassword} />);

    const passwordInput = screen.getByPlaceholderText('Enter admin key');
    const submitButton = screen.getByText('Unlock');

    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    await userEvent.type(passwordInput, 'test-password');
    await userEvent.click(submitButton);

    expect(onCorrectPassword).toHaveBeenCalledWith('test-password');
  });
});
