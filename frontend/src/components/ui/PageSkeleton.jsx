import { Box, Grid, Skeleton } from '@mui/material';
import { memo } from 'react';

function PageSkeleton({ cards = 4 }) {
  return (
    <Box aria-busy="true" aria-label="Loading">
      <Skeleton variant="text" width={240} height={40} sx={{ mb: 1 }} />
      <Skeleton variant="text" width={360} height={24} sx={{ mb: 3 }} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {Array.from({ length: cards }).map((_, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
      <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
    </Box>
  );
}

export default memo(PageSkeleton);
