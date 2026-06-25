import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Drawer } from '@mui/material';

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
        toggleTheme
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
        </Box>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
