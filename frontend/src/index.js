import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Suzuki Brand Theme
const theme = createTheme({
  palette: {
    primary: { main: '#e30613' }, // Suzuki Red
    secondary: { main: '#003399' }, // Suzuki Blue
  },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", "Arial", sans-serif',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Default path loads Variant A */}
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);