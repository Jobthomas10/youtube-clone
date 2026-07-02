import React, { useContext } from 'react';
import { Stack, Button, Box, Divider, Typography } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';

import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { AppContext } from '../App';

export const categories = [
  { name: 'Home', icon: <HomeIcon /> },
  { name: 'Music', icon: <MusicNoteIcon /> },
  { name: 'Gaming', icon: <SportsEsportsIcon /> },
  { name: 'News', icon: <NewspaperIcon /> },
  { name: 'Sports', icon: <EmojiEventsIcon /> },
  { name: 'Coding', icon: <CodeIcon /> },
  { name: 'Education', icon: <SchoolIcon /> },
];

const Sidebar = ({ selectedCategory, setSelectedCategory, isMobile, onCloseMobileDrawer }) => {
  const { setFavoritesOpen, setHistoryOpen, darkMode, toggleTheme } = useContext(AppContext);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    if (isMobile && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  const handleLibraryAction = (action) => {
    if (isMobile && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
    
    // Tiny delay to let the mobile sidebar close smoothly before drawer pops up
    setTimeout(() => {
      if (action === 'favorites') setFavoritesOpen(true);
      if (action === 'history') setHistoryOpen(true);
      if (action === 'theme') toggleTheme();
    }, 150);
  };

  return (
    <Stack
      direction="column"
      sx={{
        overflowY: 'auto',
        position: isMobile ? 'static' : 'sticky',
        top: isMobile ? 'auto' : '73px',
        height: isMobile ? '100%' : 'calc(100vh - 73px)',
        width: isMobile ? '100%' : '240px',
        borderRight: (theme) => 
          isMobile ? 'none' : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        backgroundColor: 'background.default',
        py: 2,
        px: 2,
        flexShrink: 0,
        gap: 0.5,
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      {/* Category Section */}
      {categories.map((category) => {
        const isSelected = category.name === selectedCategory;

        return (
          <Button
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            startIcon={
              <Box 
                sx={{ 
                  color: isSelected ? '#ff0000' : 'text.primary',
                  mr: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {category.icon}
              </Box>
            }
            sx={{
              justifyContent: 'flex-start',
              px: 2,
              py: 1.2,
              borderRadius: '10px',
              backgroundColor: isSelected 
                ? (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                : 'transparent',
              color: 'text.primary',
              fontWeight: isSelected ? 'bold' : 'normal',
              width: '100%',
              '&:hover': {
                backgroundColor: (theme) => 
                  theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.03)',
              },
              fontSize: '0.9rem',
              '& .MuiButton-startIcon': {
                margin: 0,
              }
            }}
          >
            {category.name}
          </Button>
        );
      })}

      <Divider sx={{ my: 2, borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

      {/* Library Section */}
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', px: 2, mb: 1, letterSpacing: '0.5px' }}>
        LIBRARY
      </Typography>

      <Button
        onClick={() => handleLibraryAction('favorites')}
        startIcon={
          <Box sx={{ color: 'text.primary', mr: 1.5, display: 'flex', alignItems: 'center' }}>
            <FavoriteIcon />
          </Box>
        }
        sx={{
          justifyContent: 'flex-start',
          px: 2,
          py: 1.2,
          borderRadius: '10px',
          color: 'text.primary',
          width: '100%',
          '&:hover': {
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.03)',
          },
          fontSize: '0.9rem',
          '& .MuiButton-startIcon': { margin: 0 }
        }}
      >
        Favorites
      </Button>

      <Button
        onClick={() => handleLibraryAction('history')}
        startIcon={
          <Box sx={{ color: 'text.primary', mr: 1.5, display: 'flex', alignItems: 'center' }}>
            <HistoryIcon />
          </Box>
        }
        sx={{
          justifyContent: 'flex-start',
          px: 2,
          py: 1.2,
          borderRadius: '10px',
          color: 'text.primary',
          width: '100%',
          '&:hover': {
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.03)',
          },
          fontSize: '0.9rem',
          '& .MuiButton-startIcon': { margin: 0 }
        }}
      >
        Watch History
      </Button>

      {/* Theme toggle item (especially useful inside mobile drawer overlay) */}
      <Button
        onClick={() => handleLibraryAction('theme')}
        startIcon={
          <Box sx={{ color: 'text.primary', mr: 1.5, display: 'flex', alignItems: 'center' }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </Box>
        }
        sx={{
          justifyContent: 'flex-start',
          px: 2,
          py: 1.2,
          borderRadius: '10px',
          color: 'text.primary',
          width: '100%',
          '&:hover': {
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.03)',
          },
          fontSize: '0.9rem',
          '& .MuiButton-startIcon': { margin: 0 }
        }}
      >
        {darkMode ? 'Light Theme' : 'Dark Theme'}
      </Button>
    </Stack>
  );
};

export default Sidebar;
