import React from 'react';
import { render, screen } from '@testing-library/react';

import WeddingPartyPage from '../interactive/WeddingPartyPage.jsx';

describe('WeddingPartyPage', () => {
  it('renders wedding party heading', () => {
    render(<WeddingPartyPage />);
    expect(screen.getByRole('heading', { name: /Wedding Party/i })).toBeInTheDocument();
  });
});
