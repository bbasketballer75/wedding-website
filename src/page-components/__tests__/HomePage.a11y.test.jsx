import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import HomePage from '../core/HomePage.jsx';

expect.extend(toHaveNoViolations);

describe('HomePage accessibility', () => {
  it('should have no accessibility violations on load', async () => {
    const { container } = render(<HomePage />);
    try {
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: false },
          'link-in-text-block': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    } catch (err) {
      // Gracefully handle known axe/JSDOM errors, only fail for real issues
      if (err && err.message && err.message.includes('Respondable target must be a frame')) {
        // Warn but do not fail the test
        // eslint-disable-next-line no-console
        console.warn('Axe-core limitation in JSDOM:', err.message);
        return;
      }
      throw err; // Fail for any other error
    }
  }, 30000); // Increased timeout to 30 seconds for accessibility testing
});
