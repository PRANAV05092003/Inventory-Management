import { Box, Typography } from '@mui/material';
import { memo } from 'react';

function DashboardPanel({ title, subtitle, action, children, dense = true, minHeight = 220, sx }) {
  return (
    <Box
      className="dashboard-panel"
      sx={{
        width: '100%',
        maxWidth: '100%',
        minHeight,
        height: 'auto',
        borderRadius: '10px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
        ...sx,
      }}
    >
      {(title || action) && (
        <Box
          sx={{
            px: dense ? 1.5 : 2,
            py: dense ? 1 : 1.25,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1,
            flexShrink: 0,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            {title && (
              <Typography variant="subtitle2" fontWeight={700} lineHeight={1.3}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary" display="block">
                {subtitle}
              </Typography>
            )}
          </Box>
          {action}
        </Box>
      )}
      <Box sx={{ flex: '1 1 auto', p: dense ? 1.5 : 2, width: '100%', minWidth: 0 }}>{children}</Box>
    </Box>
  );
}

export default memo(DashboardPanel);
