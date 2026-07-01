import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm.trim()}`);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleFormSubmit}
      sx={{
        borderRadius: '40px',
        border: (theme) =>
          theme.palette.mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.15)'
            : '1px solid #ccc',
        pl: 2,
        boxShadow: 'none',
        display: 'flex',
        alignItems: 'center',
        width: { xs: '100%', sm: '300px', md: '450px', lg: '600px' },
        maxWidth: { xs: '200px', sm: '100%' },
        height: '40px',
        overflow: 'hidden',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#121212' : '#ffffff',
        '&:focus-within': {
          border: '1px solid #1c62b9', // YouTube Blue Focus Border
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
        },
        transition: 'width 0.2s ease, border-color 0.15s ease',
      }}
    >
      <InputBase
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          ml: 1,
          flex: 1,
          fontSize: '0.95rem',
          color: 'text.primary',
          '& input::placeholder': {
            opacity: 1,
            color: (theme) =>
              theme.palette.mode === 'dark' ? '#888' : '#717171',
          },
        }}
      />
      <IconButton
        type="submit"
        sx={{
          p: '10px 20px',
          color: 'text.primary',
          height: '100%',
          borderLeft: (theme) =>
            theme.palette.mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.15)'
              : '1px solid #ccc',
          borderRadius: 0,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f8f8f8',
          '&:hover': {
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#f0f0f0',
          },
        }}
        aria-label="search button"
      >
        <SearchIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
