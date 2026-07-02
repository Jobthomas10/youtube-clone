import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack, Typography, Avatar, Button, Paper, Divider, Grid } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { fetchFromApi } from '../services/youtubeApi';
import Videos from '../components/Videos';
import Loader from '../components/Loader';
import { AppContext } from '../App';
import { formatViews, formatTimeAgo, decodeHtmlEntities } from '../components/VideoCard';

const VideoDetail = () => {
  const { id } = useParams();
  const { favorites, toggleFavorite, addToHistory } = useContext(AppContext);

  const [videoDetail, setVideoDetail] = useState(null);
  const [channelDetail, setChannelDetail] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isFavorited = favorites.some((fav) => (fav.id?.videoId || fav.id) === id);

  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Video Details
        const videoData = await fetchFromApi('videos', { part: 'snippet,statistics', id: id });
        const videoItem = videoData?.items?.[0];
        
        if (videoItem) {
          setVideoDetail(videoItem);
          // Add to watch history when successfully loaded
          addToHistory(videoItem);

          // 2. Fetch Channel Details (need the channelId from video details)
          const channelId = videoItem.snippet?.channelId;
          if (channelId) {
            const channelData = await fetchFromApi('channels', { part: 'snippet,statistics', id: channelId });
            setChannelDetail(channelData?.items?.[0]);
          }

          // 3. Fetch Related Videos
          // Fallback to searching the first two words of the title if relatedToVideoId fails
          let relatedData;
          try {
            relatedData = await fetchFromApi('search', {
              part: 'snippet',
              relatedToVideoId: id,
              type: 'video',
              maxResults: 15
            });
          } catch (e) {
            console.warn('Direct related videos fetch failed, falling back to keyword search.');
          }

          if (!relatedData?.items?.length) {
            // Keyword search fallback
            const searchWords = videoItem.snippet?.title.split(' ').slice(0, 3).join(' ') || 'Tech';
            relatedData = await fetchFromApi('search', {
              part: 'snippet',
              q: searchWords,
              type: 'video',
              maxResults: 12
            });
          }

          setRelatedVideos(relatedData?.items || []);
        }
      } catch (err) {
        console.error('Error loading video details page:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
    // Scroll to top on video change
    window.scrollTo(0, 0);
    setIsDescExpanded(false);
  }, [id]);

  if (isLoading) return <Loader />;

  if (!videoDetail) {
    return (
      <Box minHeight="92vh" p={3} display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h6" color="text.secondary">Video details could not be loaded.</Typography>
      </Box>
    );
  }

  const { title: rawTitle, channelTitle: rawChannelTitle, description: rawDescription, publishedAt } = videoDetail.snippet;
  const title = decodeHtmlEntities(rawTitle);
  const channelTitle = decodeHtmlEntities(rawChannelTitle);
  const description = decodeHtmlEntities(rawDescription);
  const { viewCount, likeCount } = videoDetail.statistics || {};
  const channelAvatar = channelDetail?.snippet?.thumbnails?.default?.url;
  const subscriberCount = channelDetail?.statistics?.subscriberCount;

  return (
    <Box minHeight="92vh" sx={{ backgroundColor: 'background.default', p: { xs: 2, md: 4 } }}>
      <Grid container spacing={3}>
        {/* Left Column: Player & Metadata */}
        <Grid item xs={12} lg={8.5}>
          {/* Responsive Player Wrapper */}
          <Box 
            sx={{ 
              width: '100%', 
              aspectRatio: '16/9', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              backgroundColor: '#000',
              mb: 2
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
              title={title}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>

          {/* Video Title */}
          <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary', mb: 2, fontSize: { xs: '1.15rem', md: '1.4rem' } }}>
            {title}
          </Typography>

          {/* Channel Info & Action Buttons Bar */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            gap={2}
            sx={{ mb: 3 }}
          >
            {/* Channel Details */}
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Avatar 
                src={channelAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(channelTitle)}`} 
                alt={channelTitle} 
                sx={{ width: 44, height: 44 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'text.primary', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {channelTitle}
                  <CheckCircleIcon sx={{ fontSize: '14px', color: 'gray' }} />
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>
                  {formatViews(subscriberCount)} subscribers
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                sx={{ 
                  ml: 2, 
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#0f0f0f', 
                  color: (theme) => theme.palette.mode === 'dark' ? '#0f0f0f' : '#fff',
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#e6e6e6' : '#272727', 
                  },
                  px: 3,
                  borderRadius: '20px'
                }}
              >
                Subscribe
              </Button>
            </Stack>

            {/* Like and Favorite Controls */}
            <Stack direction="row" gap={1.5} width={{ xs: '100%', sm: 'auto' }} justifyContent={{ xs: 'space-between', sm: 'flex-end' }}>
              {/* Likes Counter */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  px: 2, 
                  py: 1, 
                  borderRadius: '20px', 
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'
                }}
              >
                <ThumbUpIcon fontSize="small" sx={{ color: 'text.primary' }} />
                <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary' }}>
                  {formatViews(likeCount).replace(' views', '')}
                </Typography>
              </Box>

              {/* Add to Favorites Button */}
              <Button
                variant="text"
                startIcon={isFavorited ? <FavoriteIcon sx={{ color: '#ff0000' }} /> : <FavoriteBorderIcon />}
                onClick={() => toggleFavorite(videoDetail)}
                sx={{
                  px: 2.5,
                  py: 1,
                  borderRadius: '20px',
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                  }
                }}
              >
                {isFavorited ? 'Favorited' : 'Favorite'}
              </Button>
            </Stack>
          </Stack>

          {/* Collapsible Video Description Block */}
          <Paper 
            sx={{ 
              p: 2, 
              borderRadius: '12px', 
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              boxShadow: 'none',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              }
            }}
            onClick={() => setIsDescExpanded(!isDescExpanded)}
          >
            <Stack direction="row" gap={1.5} sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                {formatViews(viewCount)}
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                {formatTimeAgo(publishedAt)}
              </Typography>
            </Stack>

            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.primary',
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: isDescExpanded ? 'unset' : 3,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word',
                lineHeight: 1.5
              }}
            >
              {description}
            </Typography>
            
            <Typography variant="body2" fontWeight="bold" sx={{ color: 'primary.main', mt: 1, display: 'inline-block' }}>
              {isDescExpanded ? 'Show less' : '... Show more'}
            </Typography>
          </Paper>
        </Grid>

        {/* Right Column: Related Videos Section */}
        <Grid item xs={12} lg={3.5}>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            mb={2} 
            sx={{ 
              color: 'text.primary',
              fontFamily: '"Outfit", sans-serif'
            }}
          >
            Up Next
          </Typography>
          
          {/* Related videos responsive grid/column stack */}
          <Videos videos={relatedVideos} isLoading={false} layout="related" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoDetail;
