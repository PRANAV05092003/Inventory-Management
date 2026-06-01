import { Box, Typography } from '@mui/material';
import { memo } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import DashboardPanel from './DashboardPanel';
import { CHART, stockDonutData } from './chartTheme';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  return (
    <Box
      sx={{
        bgcolor: CHART.tooltipBg,
        color: '#fff',
        px: 1.25,
        py: 0.75,
        borderRadius: 1,
        fontSize: '0.75rem',
      }}
    >
      <strong>{row.name}</strong>: {row.value} units ({row.payload?.pct ?? 0}%)
    </Box>
  );
}

function StockDonutChart({ distribution }) {
  const total = distribution.total || 1;
  const data = stockDonutData(distribution).map((d) => ({
    ...d,
    pct: Math.round((d.value / total) * 100),
  }));

  return (
    <DashboardPanel title="Inventory Analytics" subtitle="Stock health distribution">
      <Box sx={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={2}
              label={({ name, pct }) => (pct > 0 ? `${pct}%` : '')}
              labelLine={false}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={28}
              iconType="circle"
              formatter={(value) => (
                <Typography component="span" variant="caption" color="text.secondary">
                  {value}
                </Typography>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: -0.5 }}>
        {data.map((d) => (
          <Typography key={d.name} variant="caption" color="text.secondary">
            <Box component="span" sx={{ color: d.fill, fontWeight: 700, mr: 0.5 }}>
              {d.value}
            </Box>
            {d.name}
          </Typography>
        ))}
      </Box>
    </DashboardPanel>
  );
}

export default memo(StockDonutChart);
