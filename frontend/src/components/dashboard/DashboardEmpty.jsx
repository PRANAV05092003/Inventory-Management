import { Typography } from '@mui/material';
import { memo } from 'react';

function DashboardEmpty({ message = 'No data yet' }) {
  return (
    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
      {message}
    </Typography>
  );
}

export default memo(DashboardEmpty);
