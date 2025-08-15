import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import GuestbookPage from '../interactive/GuestbookPage.jsx';

expect.extend(toHaveNoViolations);

describe('GuestbookPage accessibility', () => {
  it('should have no accessibility violations on load', async () => {
    const { container } = render(<GuestbookPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
