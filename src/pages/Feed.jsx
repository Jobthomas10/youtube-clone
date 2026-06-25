import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Stack, Typography, Alert } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Videos from '../components/Videos';
import { fetchFromApi } from '../services/youtubeApi';

const Feed = ({ selectedCategory, setSelectedCategory }) => {
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prevent double trigger on scroll
  const isLoadingRef = useRef(false);
  isLoadingRef.current = isLoading;

  const fetchVideos = useCallback(async (pageToken = '') => {
    setIsLoading(true);
    setError(null);
    try {
      let data;
      // Define parameters
      const params = {
        maxResults: 12,
      };

      if (pageToken) {
        params.pageToken = pageToken;
      }

      if (selectedCategory === 'Home') {
        // Fetch most popular videos
        data = await fetchFromApi('videos', {
          part: 'snippet,statistics',
          chart: 'mostPopular',
          ...params
        });
      } else {
        // Fetch search results for selected category
        data = await fetchFromApi('search', {
          part: 'snippet',
          q: selectedCategory,
          type: 'video',
          ...params
        });
      }

      if (data?.items) {
        if (pageToken) {
          setVideos((prev) => [...prev, ...data.items]);
        } else {
          setVideos(data.items);
        }
        setNextPageToken(data.nextPageToken || '');
      } else {
        if (!pageToken) {
          setVideos([]);
        }
      }
    } catch (err) {
      console.error('Error fetching feed videos:', err);
      setError('Failed to fetch videos. Please check your network or API key configuration.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  // Initial load when category changes
  useEffect(() => {
    setVideos([]);
    setNextPageToken('');
    fetchVideos();
  }, [selectedCategory, fetchVideos]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingRef.current || !nextPageToken) return;

      const threshold = 150; // pixels from the bottom to trigger fetch
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;

      if (windowHeight + scrollY >= docHeight - threshold) {
        fetchVideos(nextPageToken);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [nextPageToken, fetchVideos]);

  return (
    <Stack sx={{ flexDirection: { sx: 'column', md: 'row' }, minHeight: '92vh' }}>
      {/* Sidebar: Visible on desktop, hidden on mobile */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Sidebar 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
          isMobile={false}
        />
      </Box>

      {/* Main Video Area */}
      <Box 
        p={3} 
        sx={{ 
          overflowY: 'auto', 
          flex: 1, 
          backgroundColor: 'background.default',
        }}
      >
        <Typography 
          variant="h5" 
          fontWeight="bold" 
          mb={3} 
          sx={{ 
            color: 'text.primary',
            fontFamily: '"Outfit", sans-serif'
          }}
        >
          {selectedCategory} <span style={{ color: '#ff0000' }}>Videos</span>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <Videos videos={videos} isLoading={isLoading} />
      </Box>
    </Stack>
  );
};

export default Feed;
