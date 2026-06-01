import { Box } from '@mui/material';
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
import { CHART } from './chartTheme';
import { chartColors } from '../../theme/tokens';
import { formatCurrency } from '../../utils/format';

function InventoryValueBreakdownChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <DashboardPanel title="Inventory Value Breakdown" subtitle="By price tier" minHeight={280}>
        <DashboardEmpty message="No inventory value. Add products with stock to see breakdown." />
      </DashboardPanel>
    );
  }

  const rows = data.map((d, i) => ({
    ...d,
    fill: chartColors.series[i % chartColors.series.length],
  }));

  return (
    <DashboardPanel title="Inventory Value Breakdown" subtitle="By price tier" minHeight={280}>
      <Box sx={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 4 }} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: CHART.text }}
              interval={0}
              angle={-12}
              textAnchor="end"
              height={56}
            />
            <YAxis
              tick={{ fontSize: 10, fill: CHART.text }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={48}
            />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                background: CHART.tooltipBg,
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="value" name="Value" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {rows.map((row) => (
                <Cell key={row.name} fill={row.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </DashboardPanel>
  );
}

export default memo(InventoryValueBreakdownChart);
