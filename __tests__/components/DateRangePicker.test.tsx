import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DateTime } from 'luxon';
import DateRangePicker from '../../src/app/components/DateRangePicker';

describe('DateRangePicker', () => {
  const mockOnStartDateChange = jest.fn();
  const mockOnEndDateChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the DateRangePicker component', () => {
    render(
      <DateRangePicker
        startDate={null}
        endDate={null}
        onStartDateChange={mockOnStartDateChange}
        onEndDateChange={mockOnEndDateChange}
      />
    );

    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
  });

  it('should handle start date change', () => {
    render(
      <DateRangePicker
        startDate={null}
        endDate={null}
        onStartDateChange={mockOnStartDateChange}
        onEndDateChange={mockOnEndDateChange}
      />
    );

    const startDateInput = screen.getByLabelText('Start Date');
    fireEvent.change(startDateInput, { target: { value: '06/23/1999' } });
    const expectedDate = DateTime.fromISO('1999-06-23T00:00:00.000-05:00', {
      locale: 'en-US',
    });
    expect(mockOnStartDateChange).toHaveBeenCalledWith(expectedDate);
  });

  it('should handle end date change', () => {
    render(
      <DateRangePicker
        startDate={null}
        endDate={null}
        onStartDateChange={mockOnStartDateChange}
        onEndDateChange={mockOnEndDateChange}
      />
    );

    const endDateInput = screen.getByLabelText('End Date');
    fireEvent.change(endDateInput, { target: { value: '06/23/1999' } });
    const expectedDate = DateTime.fromISO('1999-06-23T00:00:00.000-05:00', {
      locale: 'en-US',
    });
    expect(mockOnEndDateChange).toHaveBeenCalledWith(expectedDate);
  });
});
