import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Stack, Box, IconButton, Badge, Drawer, Typography, List, ListItem, 
  ListItemButton, ListItemText, Button, Tooltip, Divider, useTheme
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';

import SearchBar from './SearchBar';
import { AppContext } from '../App';

const Navbar = ({ onToggleMobileSidebar }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { 
    favorites, toggleFavorite, watchHistory, clearHistory, darkMode, toggleTheme 
  } = useContext(AppContext);

  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleVideoDrawerClick = (videoId) => {
    setFavoritesOpen(false);
    setHistoryOpen(false);
    navigate(`/video/${videoId}`);
  };

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

      {/* Right: Actions */}
      <Stack direction="row" alignItems="center" gap={{ xs: 0.5, sm: 1.5 }}>
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

      {/* FAVORITES DRAWER */}
      <Drawer
        anchor="right"
        open={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        PaperProps={{
          sx: { width: { xs: '280px', sm: '380px' }, p: 3 }
        }}
      >
        <Typography variant="h6" fontWeight={700} gutterBottom display="flex" alignItems="center" gap={1}>
          <FavoriteIcon sx={{ color: '#ff0000' }} /> Favorite Videos
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        {favorites.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="70vh" gap={2}>
            <FavoriteIcon sx={{ fontSize: '4rem', color: 'action.disabled' }} />
            <Typography variant="body1" color="text.secondary">No favorites saved yet.</Typography>
          </Box>
        ) : (
          <List sx={{ overflowY: 'auto', flex: 1 }}>
            {favorites.map((video) => {
              const id = video.id?.videoId || video.id;
              const thumbnail = video.snippet?.thumbnails?.medium?.url;
              return (
                <ListItem 
                  key={id} 
                  disablePadding
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => toggleFavorite(video)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                  sx={{ mb: 1.5, borderBottom: '1px solid rgba(0,0,0,0.05)', pb: 1 }}
                >
                  <ListItemButton 
                    onClick={() => handleVideoDrawerClick(id)}
                    sx={{ p: 0.5, borderRadius: '8px', gap: 1.5 }}
                  >
                    <Box sx={{ width: 100, height: 56, borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={thumbnail} alt={video.snippet?.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <ListItemText 
                      primary={video.snippet?.title} 
                      primaryTypographyProps={{ 
                        variant: 'body2', 
                        fontWeight: 600,
                        noWrap: true,
                        sx: { color: 'text.primary' }
                      }}
                      secondary={video.snippet?.channelTitle}
                      secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Drawer>

      {/* WATCH HISTORY DRAWER */}
      <Drawer
        anchor="right"
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        PaperProps={{
          sx: { width: { xs: '280px', sm: '380px' }, p: 3 }
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" gutterBottom>
          <Typography variant="h6" fontWeight={700} display="flex" alignItems="center" gap={1}>
            <HistoryIcon sx={{ color: 'primary.main' }} /> Watch History
          </Typography>
          {watchHistory.length > 0 && (
            <Button 
              size="small" 
              color="error" 
              startIcon={<ClearAllIcon />}
              onClick={clearHistory}
            >
              Clear
            </Button>
          )}
        </Stack>
        <Divider sx={{ my: 2 }} />

        {watchHistory.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="70vh" gap={2}>
            <HistoryIcon sx={{ fontSize: '4rem', color: 'action.disabled' }} />
            <Typography variant="body1" color="text.secondary">No watch history available.</Typography>
          </Box>
        ) : (
          <List sx={{ overflowY: 'auto', flex: 1 }}>
            {watchHistory.map((video, idx) => {
              const id = video.id?.videoId || video.id;
              const thumbnail = video.snippet?.thumbnails?.medium?.url;
              return (
                <ListItem 
                  key={`${id}-${idx}`} 
                  disablePadding
                  sx={{ mb: 1.5, borderBottom: '1px solid rgba(0,0,0,0.05)', pb: 1 }}
                >
                  <ListItemButton 
                    onClick={() => handleVideoDrawerClick(id)}
                    sx={{ p: 0.5, borderRadius: '8px', gap: 1.5 }}
                  >
                    <Box sx={{ width: 100, height: 56, borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={thumbnail} alt={video.snippet?.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <ListItemText 
                      primary={video.snippet?.title} 
                      primaryTypographyProps={{ 
                        variant: 'body2', 
                        fontWeight: 600,
                        noWrap: true,
                        sx: { color: 'text.primary' }
                      }}
                      secondary={video.snippet?.channelTitle}
                      secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Drawer>
    </Stack>
  );
};

export default Navbar;
