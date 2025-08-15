import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UploadForm from '../forms/UploadForm.jsx';

describe('UploadForm Error States', () => {
  it('shows error for unsupported file type', async () => {
    render(<UploadForm />);
    const fileInput = screen.getByLabelText(/Select image or video to upload/i);
    const uploadButton = screen.getByRole('button', { name: /Upload File/i });
    const file = new File(['dummy'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(uploadButton);
    expect(await screen.findByRole('alert')).toHaveTextContent(/please select a file first/i);
  });
});
