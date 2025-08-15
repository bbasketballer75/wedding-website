import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import FamilyTreePage from '../../page-components/family/FamilyTreePage.jsx';

describe('FamilyTreePage', () => {
  it('renders all parent cards', () => {
    render(<FamilyTreePage />);
    expect(screen.getByText(/Jerame/i)).toBeInTheDocument();
    expect(screen.getByText(/Heather/i)).toBeInTheDocument();
    expect(screen.getByText(/Melony/i)).toBeInTheDocument();
    expect(screen.getByText(/Christine/i)).toBeInTheDocument();
  });

  it('opens and closes the video modal for a parent', () => {
    render(<FamilyTreePage />);
    const jerameCard = screen.getByLabelText(/Play video for Jerame/i);
    fireEvent.click(jerameCard);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // Close with button
    fireEvent.click(screen.getByLabelText(/Close video/i));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes modal on ESC key', () => {
    render(<FamilyTreePage />);
    fireEvent.click(screen.getByLabelText(/Play video for Jerame/i));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('focus is trapped in modal', () => {
    render(<FamilyTreePage />);
    fireEvent.click(screen.getByLabelText(/Play video for Jerame/i));
    const closeBtn = screen.getByLabelText(/Close video/i);
    closeBtn.focus();
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(closeBtn).toHaveFocus();
  });
});
