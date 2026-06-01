import { Box, Typography } from '@mui/material';
import { memo } from 'react';

import { gradients, radius } from '../../theme/tokens';
import GlassCard from './GlassCard';

function KpiCard({ title, value, subtitle, icon: Icon, accent = 'brand', trend }) {
  const accentMap = {
    brand: gradients.brand,
    success: 'linear-gradient(135deg, #10b981, #059669)',
    warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
    info: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  };

  return (
    <GlassCard sx={{ p: 2, width: '100%', minHeight: 76 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            {title}
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 800, letterSpacing: '-0.03em' }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Typography variant="caption" sx={{ color: trend.positive ? 'success.main' : 'error.main', mt: 0.5, display: 'block' }}>
              {trend.label}
            </Typography>
          )}
        </Box>
        {Icon && (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: radius.md,
              background: accentMap[accent] || accentMap.brand,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.25)',
            }}
          >
            <Icon size={22} strokeWidth={2.2} />
          </Box>
        )}
      </Box>
    </GlassCard>
  );
}

export default memo(KpiCard);
