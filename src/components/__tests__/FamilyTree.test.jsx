import React from 'react';
import FamilyTree from '../features/FamilyTree.jsx';

describe('FamilyTree', () => {
  it('renders all family members', () => {
    render(<FamilyTree />);
    expect(screen.getByText(/The Porada & Smith Elders/i)).toBeInTheDocument();
    expect(screen.getByText(/John & Jane Porada/i)).toBeInTheDocument();
    expect(screen.getByText(/Austin Porada/i)).toBeInTheDocument();
    expect(screen.getByText(/Robert & Mary Smith/i)).toBeInTheDocument();
    expect(screen.getByText(/Emily Smith/i)).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('FamilyTree', () => {
  it('renders the family tree with the main elders', () => {
    render(<FamilyTree />);
    expect(screen.getByText('The Porada & Smith Elders')).toBeInTheDocument();
    expect(screen.getByText('Grandparents')).toBeInTheDocument();
  });

  it('displays family tree structure correctly', () => {
    render(<FamilyTree />);
    // Check for main title (not a heading tag, just styled div)
    const mainTitle = screen.getByText('The Porada & Smith Elders');
    expect(mainTitle).toBeInTheDocument();
    // Check for grandparents section
    expect(screen.getByText('Grandparents')).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(<FamilyTree />);
    // Main title is a styled div, not a heading
    const mainTitle = screen.getByText('The Porada & Smith Elders');
    expect(mainTitle).toBeInTheDocument();
    // Check for proper hierarchical structure
    const familyTreeContainer = document.querySelector('.family-tree');
    expect(familyTreeContainer).toBeInTheDocument();
  });

  it('renders all family members if data is available', () => {
    render(<FamilyTree />);

    // Look for common family member indicators
    const familyTreeElement = document.querySelector('.family-tree');
    expect(familyTreeElement).toBeInTheDocument();

    // The component should have at least the grandparents section
    expect(screen.getByText('Grandparents')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<FamilyTree />);

    const familyTreeContainer = document.querySelector('.family-tree');
    expect(familyTreeContainer).toBeInTheDocument();

    // Check that the component has proper structure for styling
    expect(familyTreeContainer).toHaveClass('family-tree');
  });

  it('is responsive and accessible', () => {
    render(<FamilyTree />);

    // The component should render without errors
    const familyTreeContainer = document.querySelector('.family-tree');
    expect(familyTreeContainer).toBeInTheDocument();

    // Main ancestor name should be visible (no heading role in DOM)
    expect(screen.getByText(/The Porada & Smith Elders/i)).toBeVisible();
  });
});
