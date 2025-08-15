import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import FamilyTreePage from '../family/FamilyTreePage.jsx';

expect.extend(toHaveNoViolations);

describe('FamilyTreePage accessibility', () => {
  it('should have no accessibility violations on load', async () => {
    const { container } = render(<FamilyTreePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
