import { Box, LinearProgress, Typography } from '@mui/material';
import { BarChart3, PieChart } from 'lucide-react';
import { memo } from 'react';

import GlassCard from '../ui/GlassCard';
import { colors } from '../../theme/tokens';

function DistributionBar({ label, count, total, color }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" fontWeight={600}>
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {count} ({pct}%)
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: 'action.hover',
          '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 },
        }}
      />
    </Box>
  );
}

function AnalyticsPanel({ stockDistribution, orderTrends }) {
  const { low, medium, healthy, total } = stockDistribution;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      <GlassCard sx={{ p: 2.5, width: '100%', minHeight: 160 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PieChart size={20} />
          <Typography variant="subtitle1" fontWeight={700}>
            Stock Status
          </Typography>
        </Box>
        <DistributionBar label="Healthy" count={healthy} total={total} color={colors.success} />
        <DistributionBar label="Medium" count={medium} total={total} color={colors.warning} />
        <DistributionBar label="Low" count={low} total={total} color={colors.error} />
      </GlassCard>

      <GlassCard sx={{ p: 2.5, width: '100%', minHeight: 160 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <BarChart3 size={20} />
          <Typography variant="subtitle1" fontWeight={700}>
            Order Trends
          </Typography>
        </Box>
        {orderTrends.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No orders yet to display trends.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 100 }}>
            {orderTrends.map(({ label, count }) => (
              <Box key={label} sx={{ flex: 1, textAlign: 'center' }}>
                <Box
                  sx={{
                    height: `${Math.max(12, count * 24)}px`,
                    maxHeight: 80,
                    bgcolor: 'primary.main',
                    borderRadius: 1,
                    opacity: 0.85,
                    mx: 'auto',
                    width: '70%',
                    transition: 'height 0.3s',
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '0.65rem' }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </GlassCard>
    </Box>
  );
}

export default memo(AnalyticsPanel);
