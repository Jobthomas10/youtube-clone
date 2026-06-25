import React from 'react';
import { Stack, Button, Box } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import SchoolIcon from '@mui/icons-material/School';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';

export const categories = [
  { name: 'Home', icon: <HomeIcon /> },
  { name: 'Music', icon: <MusicNoteIcon /> },
  { name: 'Gaming', icon: <SportsEsportsIcon /> },
  { name: 'Sports', icon: <EmojiEventsIcon /> },
  { name: 'News', icon: <NewspaperIcon /> },
  { name: 'Movies', icon: <OndemandVideoIcon /> },
  { name: 'Education', icon: <SchoolIcon /> },
  { name: 'Technology', icon: <DeveloperModeIcon /> },
];

const Sidebar = ({ selectedCategory, setSelectedCategory, isMobile, onCloseMobileDrawer }) => {
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    if (isMobile && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  return (
    <Stack
      direction={{ xs: 'row', md: 'column' }}
      sx={{
        overflowY: 'auto',
        height: { xs: 'auto', md: '92vh' },
        width: { xs: '100%', md: '240px' },
        borderRight: (theme) => 
          isMobile ? 'none' : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        backgroundColor: 'background.default',
        py: 2,
        px: { xs: 1, md: 2 },
        flexShrink: 0,
        gap: 0.5,
        scrollbarWidth: 'none', // Firefox
        '&::-webkit-scrollbar': {
          display: 'none', // Safari & Chrome
        },
      }}
    >
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
              minWidth: { xs: '120px', md: 'auto' },
              '&:hover': {
                backgroundColor: (theme) => 
                  theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.03)',
              },
              // Text layout
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
    </Stack>
  );
};

export default Sidebar;
