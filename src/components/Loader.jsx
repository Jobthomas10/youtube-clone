import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Loader = () => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="70vh"
      width="100%"
    >
      <CircularProgress sx={{ color: 'primary.main' }} size={50} thickness={4} />
    </Box>
  );
};

export default Loader;
