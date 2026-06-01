import { Box } from '@mui/material';
import { memo } from 'react';

import { shadows } from '../../theme/tokens';

/** Rectangular enterprise card — no pill/circle shapes */
function GlassCard({ children, sx = {}, hover = false, ...props }) {
  return (
    <Box
      className="glass-card"
      sx={{
        width: '100%',
        maxWidth: '100%',
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '10px',
        boxShadow: shadows.sm,
        overflow: 'hidden',
        transition: hover ? 'box-shadow 0.2s ease, border-color 0.2s ease' : undefined,
        ...(hover && {
          '&:hover': {
            boxShadow: shadows.md,
            borderColor: 'primary.light',
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default memo(GlassCard);
