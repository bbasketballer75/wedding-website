import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import WeddingPartyPage from '../interactive/WeddingPartyPage.jsx';

expect.extend(toHaveNoViolations);

describe('WeddingPartyPage accessibility', () => {
  it('should have no accessibility violations on load', async () => {
    const { container } = render(<WeddingPartyPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
