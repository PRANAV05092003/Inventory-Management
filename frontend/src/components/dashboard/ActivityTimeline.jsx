import { Box, Typography } from '@mui/material';
import { AlertTriangle, Package, Receipt, User } from 'lucide-react';
import { memo } from 'react';

import DashboardEmpty from './DashboardEmpty';
import DashboardPanel from './DashboardPanel';
import { formatDate } from '../../utils/format';
import { radius } from '../../theme/tokens';

const iconMap = {
  order: Receipt,
  product: Package,
  customer: User,
  low_stock: AlertTriangle,
};

const colorMap = {
  order: '#6366f1',
  product: '#3b82f6',
  customer: '#10b981',
  low_stock: '#ef4444',
};

function ActivityTimeline({ events }) {
  return (
    <DashboardPanel title="Recent Activity" subtitle="Operations timeline" minHeight={320}>
      {events.length === 0 ? (
        <DashboardEmpty message="No activity yet. Add products, customers, or orders." />
      ) : (
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, maxHeight: 280, overflow: 'auto' }}>
        {events.map((event) => {
          const Icon = iconMap[event.type] || Receipt;
          const color = colorMap[event.type] || '#64748b';
          return (
            <Box
              component="li"
              key={`${event.type}-${event.id}`}
              sx={{
                display: 'flex',
                gap: 1,
                py: 0.75,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': { border: 0 },
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: radius.sm,
                  bgcolor: `${color}14`,
                  color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={14} />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
                  {event.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {event.subtitle}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {formatDate(event.at)}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
      )}
    </DashboardPanel>
  );
}

export default memo(ActivityTimeline);
