import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FotografenFilter from '../../src/app/components/FotografenFilter';

describe('FotografenFilter', () => {
  const mockOnFotografenChange = jest.fn();
  const mockList = ['Dalton Evans', 'Taylor Cobb'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the FotografenFilter component', () => {
    render(
      <FotografenFilter
        selectedFotografen=""
        fotografenList={mockList}
        onFotografenChange={mockOnFotografenChange}
      />
    );

    expect(screen.getByLabelText('Fotografen')).toBeInTheDocument();
  });

  it('should display the list of fotografen options', () => {
    render(
      <FotografenFilter
        selectedFotografen=""
        fotografenList={mockList}
        onFotografenChange={mockOnFotografenChange}
      />
    );

    fireEvent.mouseDown(screen.getByLabelText('Fotografen'));
    expect(screen.getByText(mockList[1])).toBeInTheDocument();
    expect(screen.getByText(mockList[0])).toBeInTheDocument();
  });

  it('should handle fotografen change', () => {
    render(
      <FotografenFilter
        selectedFotografen=""
        fotografenList={mockList}
        onFotografenChange={mockOnFotografenChange}
      />
    );

    fireEvent.mouseDown(screen.getByLabelText('Fotografen'));
    fireEvent.click(screen.getByText(mockList[0]));

    expect(mockOnFotografenChange).toHaveBeenCalledWith(mockList[0]);
  });
});
