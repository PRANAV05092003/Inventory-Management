import { Box, Typography } from '@mui/material';
import { Package, Receipt, User } from 'lucide-react';
import { memo } from 'react';

import GlassCard from '../ui/GlassCard';
import { formatDate } from '../../utils/format';
import { radius } from '../../theme/tokens';

const iconMap = {
  order: Receipt,
  product: Package,
  customer: User,
};

const colorMap = {
  order: '#6366f1',
  product: '#10b981',
  customer: '#8b5cf6',
};

function ActivityFeed({ events }) {
  return (
    <GlassCard sx={{ p: 2.5, width: '100%', minHeight: 280 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        Recent Activity
      </Typography>
      {events.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Activity will appear as you add products, customers, and orders.
        </Typography>
      ) : (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {events.map((event) => {
            const Icon = iconMap[event.type] || Package;
            return (
              <Box
                component="li"
                key={`${event.type}-${event.id}`}
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': { border: 0 },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: radius.md,
                    bgcolor: `${colorMap[event.type]}18`,
                    color: colorMap[event.type],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {event.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                    {event.subtitle}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" display="block">
                    {formatDate(event.at)}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </GlassCard>
  );
}

export default memo(ActivityFeed);
