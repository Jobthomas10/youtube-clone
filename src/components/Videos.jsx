import React from 'react';
import { Grid, Box, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import VideoCard from './VideoCard';

const VideoSkeleton = ({ layout }) => {
  const isHorizontal = layout === 'horizontal' || layout === 'search';
  const isSearch = layout === 'search';

  if (isHorizontal) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: isSearch ? '16px' : '8px', mb: 1.5, width: '100%' }}>
        <Skeleton 
          variant="rectangular" 
          sx={{ 
            width: isSearch 
              ? { xs: '140px', sm: '240px', md: '280px', lg: '320px' }
              : { xs: '130px', sm: '150px', md: '160px' }, 
            pt: isSearch 
              ? { xs: '78.75px', sm: '135px', md: '157.5px', lg: '180px' }
              : { xs: '73px', sm: '84.37px', md: '90px' }, 
            borderRadius: '8px', 
            flexShrink: 0 
          }} 
        />
        <Box sx={{ flex: 1, minWidth: 0, pt: '2px' }}>
          <Skeleton variant="text" width="90%" height={isSearch ? 24 : 16} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="65%" height={isSearch ? 18 : 14} sx={{ mb: 0.5 }} />
          {isSearch && (
            <>
              {/* Channel avatar + title row skeleton */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', my: 1.5 }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width="30%" height={14} />
              </Box>
              <Skeleton variant="text" width="80%" height={14} sx={{ display: { xs: 'none', sm: 'block' } }} />
              <Skeleton variant="text" width="50%" height={14} sx={{ display: { xs: 'none', sm: 'block' } }} />
            </>
          )}
          {!isSearch && (
            <Skeleton variant="text" width="45%" height={12} />
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Skeleton 
        variant="rectangular" 
        sx={{ 
          width: '100%', 
          pt: '56.25%', // 16:9 Aspect Ratio
          borderRadius: '12px',
          mb: 1
        }} 
      />
      <Box sx={{ display: 'flex', gap: '12px', mt: 1.5 }}>
        <Skeleton variant="circular" width={36} height={36} sx={{ flexShrink: 0 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={16} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="45%" height={14} />
        </Box>
      </Box>
    </Box>
  );
};

const Videos = ({ videos, isLoading, layout = 'grid' }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Determine current card format (horizontal vs vertical)
  // Search layout is always horizontal. Related is horizontal on desktop and mobile, but grid on tablet.
  const useHorizontal = layout === 'horizontal' || layout === 'search' || (layout === 'related' && (isLargeScreen || isSmallScreen));
  
  // Calculate Grid columns dynamically based on layout settings and responsive breakpoints
  const getGridTemplateColumns = () => {
    if (useHorizontal) {
      return '1fr';
    }
    if (layout === 'related') {
      // Related videos grid for tablet: 2 columns on sm, 3 columns on md
      return {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      };
    }
    // Default Home Feed: 1 column on mobile, 2 on tablet, 3 on laptop, 4 on desktop, 5 on extra-large
    return {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(4, 1fr)',
      xl: 'repeat(5, 1fr)',
    };
  };

  const gridTemplateColumns = getGridTemplateColumns();
  const cardLayout = layout === 'search' ? 'search' : (useHorizontal ? 'horizontal' : 'vertical');
  const gap = useHorizontal ? (layout === 'search' ? '20px' : '12px') : '24px';

  if (isLoading && (!videos || videos.length === 0)) {
    return (
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: gridTemplateColumns,
          gap: gap,
          width: '100%'
        }}
      >
        {Array.from(new Array(8)).map((_, index) => (
          <VideoSkeleton key={index} layout={cardLayout} />
        ))}
      </Box>
    );
  }

  if (!videos?.length) return null;

  return (
    <Box 
      sx={{ 
        display: 'grid',
        gridTemplateColumns: gridTemplateColumns,
        gap: gap,
        width: '100%'
      }}
    >
      {videos.map((item, idx) => {
        // Fix: Extract string video ID. Skip objects without videoId (like channels/playlists)
        const videoId = typeof item.id === 'object' ? item.id?.videoId : item.id;
        if (!videoId) return null;

        return (
          <VideoCard video={item} key={`${videoId}-${idx}`} layout={cardLayout} />
        );
      })}

      {isLoading && (
        <>
          {Array.from(new Array(4)).map((_, index) => (
            <VideoSkeleton key={`loading-more-${index}`} layout={cardLayout} />
          ))}
        </>
      )}
    </Box>
  );
};

export default Videos;
