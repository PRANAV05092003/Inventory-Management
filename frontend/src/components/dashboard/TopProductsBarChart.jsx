import { Box } from '@mui/material';
import { memo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import DashboardEmpty from './DashboardEmpty';
import DashboardPanel from './DashboardPanel';
import { CHART } from './chartTheme';
import { formatCurrency } from '../../utils/format';

function TopProductsBarChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <DashboardPanel title="Top Selling Products" subtitle="Requires completed orders" minHeight={280}>
        <DashboardEmpty message="No order history yet. Top sellers appear after orders are placed." />
      </DashboardPanel>
    );
  }

  const chartData = data.map((d) => ({
    name: d.name.length > 14 ? `${d.name.slice(0, 12)}…` : d.name,
    fullName: d.name,
    orders: d.orders,
    revenue: d.revenue,
  }));

  return (
    <DashboardPanel title="Top Selling Products" subtitle="By order volume and revenue">
      <Box sx={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: CHART.text }} interval={0} />
            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: CHART.text }} width={28} />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 10, fill: CHART.text }}
              width={40}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: CHART.tooltipBg,
                border: 'none',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value, name, props) => {
                if (name === 'Revenue') return [formatCurrency(value), name];
                return [value, name];
              }}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="orders" name="Orders" fill={CHART.healthy} radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </DashboardPanel>
  );
}

export default memo(TopProductsBarChart);
