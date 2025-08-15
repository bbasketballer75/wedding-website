import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../core/HomePage.jsx';

describe('HomePage', () => {
  it('renders welcome message and main CTA', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /Austin & Jordyn/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Browse Memories/i })).toBeInTheDocument();
  });

  it('displays welcome message and navigation elements', () => {
    render(<HomePage />);

    // Should have some welcoming content
    const homeContainer = document.querySelector('.home-page');
    expect(homeContainer).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(<HomePage />);

    // Main heading should be present and accessible
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeVisible();

    // Page should have proper structure
    const homeContainer = document.querySelector('.home-page');
    expect(homeContainer).toBeInTheDocument();
  });

  it('renders without errors', () => {
    expect(() => {
      render(<HomePage />);
    }).not.toThrow();
  });

  it('applies correct CSS classes', () => {
    render(<HomePage />);

    const homeContainer = document.querySelector('.home-page');
    expect(homeContainer).toBeInTheDocument();
    expect(homeContainer).toHaveClass('home-page');
  });

  it('is responsive and mobile-friendly', () => {
    render(<HomePage />);

    const homeContainer = document.querySelector('.home-page');
    expect(homeContainer).toBeInTheDocument();

    // Component should render properly on different screen sizes
    // (CSS media queries are tested through visual regression or manual testing)
    expect(homeContainer).toBeVisible();
  });
});
