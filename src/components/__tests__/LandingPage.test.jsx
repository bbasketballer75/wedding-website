import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import LandingPage from '../LandingPage.jsx';

describe('LandingPage', () => {
  test('renders landing page with correct content', () => {
    const mockOnEnter = vi.fn();
    render(<LandingPage onEnter={mockOnEnter} />);

    expect(screen.getByText('Austin & Jordyn')).toBeInTheDocument();
    expect(screen.getByText('Our Wedding Celebration')).toBeInTheDocument();
    expect(screen.getByText('Thank you for celebrating with us')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /enter wedding site with music and video/i })
    ).toBeInTheDocument();
  });

  test('calls onEnter when enter button is clicked', () => {
    const mockOnEnter = vi.fn();
    render(<LandingPage onEnter={mockOnEnter} />);

    const enterButton = screen.getByRole('button', {
      name: /enter wedding site with music and video/i,
    });
    fireEvent.click(enterButton);

    expect(mockOnEnter).toHaveBeenCalledTimes(1);
  });

  test('displays wedding hero image', () => {
    const mockOnEnter = vi.fn();
    render(<LandingPage onEnter={mockOnEnter} />);

    const heroImage = screen.getByAltText('Austin & Jordyn Wedding');
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('src', '/images/wedding-hero.jpg');
  });

  test('has correct button text and subtitle', () => {
    const mockOnEnter = vi.fn();
    render(<LandingPage onEnter={mockOnEnter} />);

    expect(screen.getByText('Enter Our Celebration')).toBeInTheDocument();
    expect(screen.getByText('Click to enable music & video')).toBeInTheDocument();
  });
});
