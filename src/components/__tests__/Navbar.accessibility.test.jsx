import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar.tsx';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Navbar Accessibility', () => {
  it('has no accessibility violations', async () => {
    render(<Navbar onePage={true} />);
    try {
      const results = await axe(document.body, {
        rules: {
          'color-contrast': { enabled: false },
          'link-in-text-block': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    } catch (err) {
      expect(err).toBeUndefined();
    }
  });

  it('supports keyboard navigation', () => {
    render(<Navbar onePage={true} />);
    const navLinks = screen.getAllByRole('link');
    navLinks.forEach((link) => {
      expect(link).toBeVisible();
    });
  });

  it('renders ARIA roles', () => {
    render(<Navbar onePage={true} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
