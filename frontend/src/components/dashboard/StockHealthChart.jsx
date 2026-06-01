import { Box, Typography } from '@mui/material';
import { memo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import DashboardEmpty from './DashboardEmpty';
import DashboardPanel from './DashboardPanel';
import { CHART, stockDonutData } from './chartTheme';

function StockHealthChart({ distribution }) {
  const total = distribution.total || 0;
  if (total === 0) {
    return (
      <DashboardPanel title="Inventory Analytics" subtitle="Stock health by SKU count" minHeight={280}>
        <DashboardEmpty message="No products in catalog. Stock health appears when products exist." />
      </DashboardPanel>
    );
  }

  const rows = stockDonutData(distribution).map((d) => ({
    category: d.name,
    units: d.value,
    fill: d.fill,
    pct: Math.round((d.value / total) * 100),
  }));

  return (
    <DashboardPanel title="Inventory Analytics" subtitle="Stock health by SKU count" minHeight={280}>
      <Box sx={{ width: '100%', height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
            barSize={28}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: CHART.text }} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="category"
              width={88}
              tick={{ fontSize: 11, fill: CHART.text }}
            />
            <Tooltip
              formatter={(value, _name, props) => [
                `${value} SKUs (${props.payload.pct}%)`,
                'Count',
              ]}
              contentStyle={{
                background: CHART.tooltipBg,
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="units" name="SKU count" radius={[0, 4, 4, 0]}>
              {rows.map((row) => (
                <Cell key={row.category} fill={row.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          mt: 1,
          pt: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        {rows.map((r) => (
          <Box key={r.category} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: r.fill, lineHeight: 1.2 }}>
              {r.units}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {r.category} ({r.pct}%)
            </Typography>
          </Box>
        ))}
      </Box>
    </DashboardPanel>
  );
}

export default memo(StockHealthChart);
