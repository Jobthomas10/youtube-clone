import React from 'react';
import { Grid, Box, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import VideoCard from './VideoCard';

const VideoSkeleton = ({ layout }) => {
  const isHorizontal = layout === 'horizontal';

  if (isHorizontal) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px', mb: 1.5, width: '100%' }}>
        <Skeleton 
          variant="rectangular" 
          sx={{ 
            width: { xs: '130px', sm: '150px', md: '160px' }, 
            pt: { xs: '73px', sm: '84.37px', md: '90px' }, 
            borderRadius: '8px', 
            flexShrink: 0 
          }} 
        />
        <Box sx={{ flex: 1, minWidth: 0, pt: '2px' }}>
          <Skeleton variant="text" width="90%" height={16} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="65%" height={14} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="45%" height={12} />
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

  // Determine current card format (horizontal vs vertical)
  // If layout is 'related', we render horizontal list on desktop, vertical grid on mobile/tablet
  const useHorizontal = layout === 'horizontal' || (layout === 'related' && isLargeScreen);
  
  // Calculate Grid sizes dynamically based on screen and layout settings
  const getGridSizes = () => {
    if (useHorizontal) {
      // Horizontal cards take up 100% of the sidebar column width
      return { xs: 12 };
    }
    if (layout === 'related') {
      // On mobile/tablet, stack related videos in a 2-column or 3-column grid
      return { xs: 12, sm: 6, md: 4 };
    }
    // Default Home/Search Feed: 1 column on mobile, 2 on tablet, 3 on medium, 4 on desktop
    return { xs: 12, sm: 6, md: 4, lg: 3 };
  };

  const gridSizes = getGridSizes();

  if (isLoading && (!videos || videos.length === 0)) {
    return (
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Grid container spacing={2}>
          {Array.from(new Array(8)).map((_, index) => (
            <Grid item {...gridSizes} key={index}>
              <VideoSkeleton layout={useHorizontal ? 'horizontal' : 'vertical'} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!videos?.length) return null;

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Grid container spacing={2}>
        {videos.map((item, idx) => {
          const videoId = item.id?.videoId || item.id;
          if (!videoId) return null;

          return (
            <Grid item {...gridSizes} key={`${videoId}-${idx}`}>
              <VideoCard video={item} layout={useHorizontal ? 'horizontal' : 'vertical'} />
            </Grid>
          );
        })}

        {isLoading && (
          <>
            {Array.from(new Array(4)).map((_, index) => (
              <Grid item {...gridSizes} key={`loading-more-${index}`}>
                <VideoSkeleton layout={useHorizontal ? 'horizontal' : 'vertical'} />
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Videos;
