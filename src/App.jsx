import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  ThemeProvider, CssBaseline, Box, Drawer, Typography, List, ListItem, 
  ListItemButton, ListItemText, Button, Divider, Stack, IconButton 
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';

import { lightTheme, darkTheme } from './theme';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './pages/Feed';
import SearchFeed from './pages/SearchFeed';
import VideoDetail from './pages/VideoDetail';

// Create Global Context
export const AppContext = createContext();

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Local Storage State Syncing
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('yt_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [watchHistory, setWatchHistory] = useState(() => {
    const saved = localStorage.getItem('yt_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('yt_dark_mode');
    return saved !== 'false'; // Default to dark mode (true)
  });

  const [selectedCategory, setSelectedCategory] = useState('Home');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Drawer open states
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('yt_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('yt_history', JSON.stringify(watchHistory));
  }, [watchHistory]);

  useEffect(() => {
    localStorage.setItem('yt_dark_mode', darkMode.toString());
  }, [darkMode]);

  // Context utility handlers
  const toggleFavorite = (video) => {
    const videoId = video.id?.videoId || video.id;
    setFavorites((prev) => {
      const exists = prev.some((item) => (item.id?.videoId || item.id) === videoId);
      if (exists) {
        return prev.filter((item) => (item.id?.videoId || item.id) !== videoId);
      } else {
        return [video, ...prev];
      }
    });
  };

  const addToHistory = (video) => {
    const videoId = video.id?.videoId || video.id;
    setWatchHistory((prev) => {
      const filtered = prev.filter((item) => (item.id?.videoId || item.id) !== videoId);
      return [video, ...filtered].slice(0, 50); // Keep last 50 watched
    });
  };

  const clearHistory = () => {
    setWatchHistory([]);
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const handleVideoDrawerClick = (videoId) => {
    setFavoritesOpen(false);
    setHistoryOpen(false);
    navigate(`/video/${videoId}`);
  };

  // Navigates to home and switches category
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <AppContext.Provider
      value={{
        favorites,
        toggleFavorite,
        watchHistory,
        addToHistory,
        clearHistory,
        darkMode,
        toggleTheme,
        favoritesOpen,
        setFavoritesOpen,
        historyOpen,
        setHistoryOpen
      }}
    >
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
          {/* Top Sticky Header */}
          <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
          
          {/* Main Routing Views */}
          <Routes>
            <Route 
              path="/" 
              element={
                <Feed 
                  selectedCategory={selectedCategory} 
                  setSelectedCategory={setSelectedCategory} 
                />
              } 
            />
            <Route path="/video/:id" element={<VideoDetail />} />
            <Route path="/search/:searchTerm" element={<SearchFeed />} />
          </Routes>

          {/* Responsive Left Temporary Sidebar Drawer for Mobile */}
          <Drawer
            anchor="left"
            open={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
            PaperProps={{
              sx: { 
                width: 240, 
                backgroundColor: 'background.default',
                backgroundImage: 'none',
                boxShadow: 'none'
              }
            }}
          >
            <Sidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategoryChange}
              isMobile={true}
              onCloseMobileDrawer={() => setMobileSidebarOpen(false)}
            />
          </Drawer>

          {/* FAVORITES DRAWER */}
          <Drawer
            anchor="right"
            open={favoritesOpen}
            onClose={() => setFavoritesOpen(false)}
            PaperProps={{
              sx: { width: { xs: '280px', sm: '380px' }, p: 3, backgroundImage: 'none' }
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
                      sx={{ mb: 1.5, borderBottom: '1px solid rgba(128,128,128,0.1)', pb: 1 }}
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
              sx: { width: { xs: '280px', sm: '380px' }, p: 3, backgroundImage: 'none' }
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
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
                      sx={{ mb: 1.5, borderBottom: '1px solid rgba(128,128,128,0.1)', pb: 1 }}
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
        </Box>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
