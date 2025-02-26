import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Lookup from '../../src/app/components/Lookup';

describe('Lookup', () => {
  it('should handle search input', () => {
    render(<Lookup />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    expect(searchInput).toHaveValue('test search');
  });
});
