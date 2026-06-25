import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Alert } from '@mui/material';
import Videos from '../components/Videos';
import { fetchFromApi } from '../services/youtubeApi';

const SearchFeed = () => {
  const { searchTerm } = useParams();
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isLoadingRef = useRef(false);
  isLoadingRef.current = isLoading;

  const fetchSearchVideos = useCallback(async (pageToken = '') => {
    if (!searchTerm) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchFromApi('search', {
        part: 'snippet',
        q: searchTerm,
        type: 'video',
        maxResults: 12,
        pageToken: pageToken
      });

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
      console.error('Error fetching search results:', err);
      setError('Failed to load search results. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  // Reload search when search term changes
  useEffect(() => {
    setVideos([]);
    setNextPageToken('');
    fetchSearchVideos();
  }, [searchTerm, fetchSearchVideos]);

  // Infinite Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingRef.current || !nextPageToken) return;

      const threshold = 150;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;

      if (windowHeight + scrollY >= docHeight - threshold) {
        fetchSearchVideos(nextPageToken);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [nextPageToken, fetchSearchVideos]);

  return (
    <Box 
      p={3} 
      sx={{ 
        overflowY: 'auto', 
        minHeight: '92vh', 
        backgroundColor: 'background.default',
        width: '100%'
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
        Search Results for: <span style={{ color: '#ff0000' }}>{decodeURIComponent(searchTerm)}</span>
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

      {/* Grid of Search Video Results */}
      {!isLoading && videos.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No videos found matching your search. Try searching for "React", "Gaming", "Despacito", or "SpaceX".
        </Typography>
      ) : (
        <Videos videos={videos} isLoading={isLoading} />
      )}
    </Box>
  );
};

export default SearchFeed;
