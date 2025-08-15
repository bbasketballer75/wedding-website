import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import AdminPage from '../admin/AdminPage.jsx';

expect.extend(toHaveNoViolations);

describe('AdminPage accessibility', () => {
  it('should have no accessibility violations on load', async () => {
    const { container } = render(<AdminPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
