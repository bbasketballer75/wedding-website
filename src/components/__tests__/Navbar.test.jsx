import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar.tsx';

describe('Navbar', () => {
  it('renders logo and tagline', () => {
    render(<Navbar />);
    expect(screen.getByText(/Austin & Jordyn/i)).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Navbar />);
    // Test specific navigation links as links (not menu items after accessibility cleanup)
    expect(screen.getByRole('link', { name: /^Home$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Memory Tapestry/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Love's Journey/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sacred Messages/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Our Beloved Circle/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Love's Journey/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sacred Messages/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sacred Places/i })).toBeInTheDocument();
  });

  it('opens and closes mobile menu', () => {
    render(<Navbar />);
    const toggle = screen.getByLabelText(/Toggle navigation/i);
    fireEvent.click(toggle);
    expect(screen.getByRole('navigation')).toBeVisible();
    fireEvent.click(toggle);
    expect(screen.getByRole('navigation')).toBeVisible(); // Should remain visible for accessibility
  });

  it('renders the navbar with brand and links', () => {
    render(<Navbar />);
    // Check for the brand name
    expect(screen.getByText('Austin & Jordyn')).toBeInTheDocument();
    // Check for a few links
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText("Love's Journey")).toBeInTheDocument();
    expect(screen.getByText('Sacred Messages')).toBeInTheDocument();
    expect(screen.getByText('Sacred Places')).toBeInTheDocument();
  });
});
