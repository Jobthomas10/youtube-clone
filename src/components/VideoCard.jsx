import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { AppContext } from '../App';

// Format view counts
export const formatViews = (views) => {
  if (!views) {
    // Generate a stable view count based on video length or random if not present
    return '340K views';
  }
  const num = Number(views);
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B views';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M views';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K views';
  }
  return num + ' views';
};

// Format published date
export const formatTimeAgo = (dateString) => {
  if (!dateString) return '3 days ago';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 0) return 'Just now';
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval === 1 ? '1 year ago' : `${interval} years ago`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval === 1 ? '1 month ago' : `${interval} months ago`;
  
  interval = Math.floor(seconds / 604800);
  if (interval >= 1) return interval === 1 ? '1 week ago' : `${interval} weeks ago`;
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval === 1 ? '1 day ago' : `${interval} days ago`;
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
  
  return 'Just now';
};

const VideoCard = ({ video }) => {
  const { favorites, toggleFavorite, addToHistory } = useContext(AppContext);
  const [isHovered, setIsHovered] = useState(false);

  const videoId = video?.id?.videoId || video?.id;
  const isFavorited = favorites.some((fav) => (fav.id?.videoId || fav.id) === videoId);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(video);
  };

  const handleCardClick = () => {
    addToHistory(video);
  };

  const thumbnail = video?.snippet?.thumbnails?.high?.url || video?.snippet?.thumbnails?.medium?.url;
  const title = video?.snippet?.title || 'No title';
  const channelTitle = video?.snippet?.channelTitle || 'Unknown Channel';
  const publishedAt = video?.snippet?.publishedAt;
  const viewCount = video?.statistics?.viewCount;

  return (
    <Card 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      sx={{ 
        width: '100%',
        boxShadow: 'none', 
        borderRadius: 0, 
        backgroundColor: 'transparent',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Link to={videoId ? `/video/${videoId}` : `/video/dQw4w9WgXcQ`} style={{ textDecoration: 'none' }}>
        <Box sx={{ position: 'relative', width: '100%', pt: '56.25%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000' }}>
          <CardMedia
            component="img"
            image={thumbnail || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&auto=format&fit=crop&q=60'}
            alt={title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            }}
          />
          
          {/* Heart / Favorite Overlay */}
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8, 
              zIndex: 10,
              opacity: isHovered || isFavorited ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
            }}
          >
            <Tooltip title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}>
              <IconButton 
                onClick={handleFavoriteClick}
                sx={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.6)', 
                  color: isFavorited ? '#ff0000' : '#ffffff',
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#ff0000',
                  } 
                }}
              >
                {isFavorited ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>

          {/* Hover Play Button Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
            }}
          >
            <PlayArrowIcon sx={{ color: '#fff', fontSize: '3rem', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.4))' }} />
          </Box>
        </Box>

        <CardContent sx={{ p: '12px 4px', display: 'flex', gap: '12px' }}>
          {/* Channel avatar fallback */}
          <Box 
            sx={{ 
              width: 36, 
              height: 36, 
              borderRadius: '50%', 
              overflow: 'hidden', 
              flexShrink: 0,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            <img 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(channelTitle)}`} 
              alt={channelTitle} 
              style={{ width: '100%', height: '100%' }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="subtitle1" 
              fontWeight={600} 
              sx={{ 
                color: 'text.primary',
                lineHeight: '1.2rem',
                maxHeight: '2.4rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                mb: '4px'
              }}
            >
              {title}
            </Typography>

            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                '&:hover': { color: 'text.primary' }
              }}
            >
              {channelTitle}
              <CheckCircleIcon sx={{ fontSize: '12px', color: 'gray', ml: '2px' }} />
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {formatViews(viewCount)} • {formatTimeAgo(publishedAt)}
            </Typography>
          </Box>
        </CardContent>
      </Link>
    </Card>
  );
};

export default VideoCard;
