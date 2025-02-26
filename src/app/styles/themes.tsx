'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4285F4',
    },
    secondary: {
      main: '#EA4335',
    },
    success: {
      main: '#34A853',
    },
    warning: {
      main: '#FBBC05',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F1F3F4',
    },
    text: {
      primary: '#202124',
      secondary: '#5F6368',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
