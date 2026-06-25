import React from 'react';
import { Grid, Box, Skeleton } from '@mui/material';
import VideoCard from './VideoCard';

const VideoSkeleton = () => (
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

const Videos = ({ videos, isLoading, direction }) => {
  // If loading and there are no videos yet, render skeleton placeholders
  if (isLoading && (!videos || videos.length === 0)) {
    return (
      <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
        {Array.from(new Array(8)).map((_, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={direction === 'column' ? 12 : 4} 
            lg={direction === 'column' ? 12 : 3} 
            key={index}
            sx={{ pl: '0px !important' }}
          >
            <VideoSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!videos?.length) return null;

  return (
    <Grid 
      container 
      spacing={2} 
      sx={{ 
        width: '100%', 
        m: 0,
        // Reset margins to prevent layout shifts
      }}
    >
      {videos.map((item, idx) => {
        const videoId = item.id?.videoId || item.id;
        if (!videoId) return null;

        return (
          <Grid 
            item 
            xs={12} 
            sm={direction === 'column' ? 12 : 6} 
            md={direction === 'column' ? 12 : 4} 
            lg={direction === 'column' ? 12 : 3} 
            key={`${videoId}-${idx}`}
            sx={{ pl: '0px !important' }}
          >
            <VideoCard video={item} />
          </Grid>
        );
      })}

      {/* Render Skeletons at the end if we are fetching next page of infinite scroll */}
      {isLoading && (
        <>
          {Array.from(new Array(4)).map((_, index) => (
            <Grid 
              item 
              xs={12} 
              sm={direction === 'column' ? 12 : 6} 
              md={direction === 'column' ? 12 : 4} 
              lg={direction === 'column' ? 12 : 3} 
              key={`loading-more-${index}`}
              sx={{ pl: '0px !important' }}
            >
              <VideoSkeleton />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
};

export default Videos;
