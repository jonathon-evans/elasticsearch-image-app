'use client';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Container,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Box,
  Grid,
} from '@mui/material';
import { DateTime } from 'luxon';
import ClearIcon from '@mui/icons-material/Clear';
import DateRangePicker from './DateRangePicker';
import FotografenFilter from './FotografenFilter';
import { ImageItemResult } from '@/api/images/route';
import ImageItem from './ImageItem';

const Lookup: React.FC = () => {
  const [searchString, setSearchString] = useState('');
  const [startDate, setStartDate] = useState<DateTime | null>(null);
  const [endDate, setEndDate] = useState<DateTime | null>(null);
  const [selectedFotografen, setSelectedFotografen] = useState<string>('');
  const [fotografenList, setFotografenList] = useState<string[]>([]);
  const [results, setResults] = useState<ImageItemResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFotografen();
  }, []);

  useEffect(() => {
    searchItems();
  }, [searchString, startDate, endDate, selectedFotografen]);

  const fetchFotografen = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/images/fotografen');
      setFotografenList(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching fotografen:', error);
      setIsLoading(false);
    }
  };

  const searchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/images`, {
        params: {
          searchString: searchString || undefined,
          startDate: startDate ? startDate.toISODate() : undefined,
          endDate: endDate ? endDate.toISODate() : undefined,
          fotografen: selectedFotografen || undefined,
        },
      });
      console.log('response', response);
      setResults(response.data);
      setError(null);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setResults([]);
      setError('Error fetching images');
      console.error(err);
    }
  }, [searchString, startDate, endDate, selectedFotografen]);

  const handleClearSearch = () => {
    setSearchString('');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Image Lookup
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box display="flex" flexDirection="row" gap={2} alignItems="center">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <FotografenFilter
          selectedFotografen={selectedFotografen}
          fotografenList={fotografenList}
          onFotografenChange={setSelectedFotografen}
        />
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {results.map((result, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ImageItem image={result} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Lookup;
