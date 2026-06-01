import { Box, Button, Typography } from '@mui/material';
import { Inbox } from 'lucide-react';
import { memo } from 'react';

import { gradients, radius } from '../../theme/tokens';

function EmptyState({ title = 'Nothing here yet', message, actionLabel, onAction, icon: Icon = Inbox }) {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      role="status"
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: radius.xl,
          background: gradients.brandSubtle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          color: 'primary.main',
        }}
      >
        <Icon size={32} strokeWidth={1.5} />
      </Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mb: 2 }}>
          {message}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

export default memo(EmptyState);
