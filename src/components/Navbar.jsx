import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Stack, IconButton, Badge, Typography, Tooltip, useTheme } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import SearchBar from './SearchBar';
import { AppContext } from '../App';

const Navbar = ({ onToggleMobileSidebar }) => {
  const theme = useTheme();
  const { 
    favorites, darkMode, toggleTheme, setFavoritesOpen, setHistoryOpen 
  } = useContext(AppContext);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      sx={{
        position: 'sticky',
        background: theme.palette.mode === 'dark' ? '#0f0f0f' : '#ffffff',
        top: 0,
        zIndex: 100,
        borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
      }}
    >
      {/* Left: Menu & Logo */}
      <Stack direction="row" alignItems="center" gap={1}>
        <IconButton 
          onClick={onToggleMobileSidebar} 
          sx={{ color: 'text.primary', display: { xs: 'flex', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          {/* Authentic YouTube Logo SVG */}
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#FF0000">
            <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.389-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <Typography 
            variant="h6" 
            fontWeight={800} 
            sx={{ 
              color: 'text.primary', 
              letterSpacing: '-1px',
              fontFamily: '"Outfit", sans-serif',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            YouTube
          </Typography>
        </Link>
      </Stack>

      {/* Middle: SearchBar */}
      <SearchBar />

      {/* Right: Actions (Hidden on mobile to preserve layout integrity) */}
      <Stack 
        direction="row" 
        alignItems="center" 
        gap={{ xs: 0.5, sm: 1.5 }}
        sx={{ display: { xs: 'none', sm: 'flex' } }}
      >
        {/* Theme Toggle */}
        <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <IconButton onClick={toggleTheme} sx={{ color: 'text.primary' }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>

        {/* Watch History Trigger */}
        <Tooltip title="Watch History">
          <IconButton onClick={() => setHistoryOpen(true)} sx={{ color: 'text.primary' }}>
            <HistoryIcon />
          </IconButton>
        </Tooltip>

        {/* Favorites Trigger */}
        <Tooltip title="Favorite Videos">
          <IconButton onClick={() => setFavoritesOpen(true)} sx={{ color: 'text.primary' }}>
            <Badge badgeContent={favorites.length} color="error">
              <FavoriteIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default Navbar;
