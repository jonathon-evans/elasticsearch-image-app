import React, { useState } from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';

interface DateRangePickerProps {
  startDate: DateTime | null;
  endDate: DateTime | null;
  onStartDateChange: (date: DateTime | null) => void;
  onEndDateChange: (date: DateTime | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleStartDateChange = (date: DateTime | null) => {
    if (date && endDate && date > endDate) {
      setError('Start date should be before end date');
    } else {
      setError(null);
      onStartDateChange(date);
    }
  };

  const handleEndDateChange = (date: DateTime | null) => {
    if (date && startDate && date < startDate) {
      setError('End date should be after start date');
    } else {
      setError(null);
      onEndDateChange(date);
    }
  };

  const isDateInPast = (date: DateTime | null) => {
    return date && date < DateTime.now();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Box display="flex" flexDirection="row" gap={2}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          shouldDisableDate={(date) => !isDateInPast(date)}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange}
          shouldDisableDate={(date) => !isDateInPast(date)}
        />
      </Box>
      {error && <Typography color="error">{error}</Typography>}
    </LocalizationProvider>
  );
};

export default DateRangePicker;
