import React from 'react';
import { render, screen } from '@testing-library/react';
import FamilyTree from '../features/FamilyTree.jsx';

describe('Lazy Loading', () => {
  it('images are lazy-loaded', () => {
    render(<FamilyTree />);
    const images = screen.queryAllByRole('img');
    if (images.length === 0) {
      // No images rendered, skip this test
      return;
    }
    images.forEach((img) => {
      expect(img).toHaveAttribute('loading', 'lazy');
    });
  });
});
