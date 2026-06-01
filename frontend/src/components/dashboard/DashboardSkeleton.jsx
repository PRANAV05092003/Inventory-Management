import { Box, Grid, Skeleton } from '@mui/material';
import { memo } from 'react';

function DashboardSkeleton() {
  return (
    <Box aria-busy="true" aria-label="Loading dashboard">
      <Skeleton variant="text" width={200} height={28} sx={{ mb: 1.5 }} />
      <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid item xs={6} sm={4} md={2} key={i}>
            <Skeleton variant="rounded" height={76} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
        <Grid item xs={12} md={8}>
          <Skeleton variant="rounded" height={260} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Skeleton variant="rounded" height={260} />
        </Grid>
      </Grid>
      <Grid container spacing={1.5}>
        <Grid item xs={12} md={8}>
          <Skeleton variant="rounded" height={240} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Skeleton variant="rounded" height={240} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default memo(DashboardSkeleton);
