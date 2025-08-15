import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar.tsx';

describe('Navbar Responsive', () => {
  it('renders correctly on mobile', () => {
    window.innerWidth = 375;
    render(<Navbar onePage={true} />);
    expect(screen.getByRole('navigation')).toBeVisible();
  });

  it('renders correctly on desktop', () => {
    window.innerWidth = 1200;
    render(<Navbar onePage={true} />);
    expect(screen.getByRole('navigation')).toBeVisible();
  });
});
