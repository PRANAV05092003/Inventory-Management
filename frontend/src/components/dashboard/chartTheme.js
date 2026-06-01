import { chartColors } from '../../theme/tokens';

export const CHART = {
  healthy: chartColors.healthy,
  medium: chartColors.medium,
  low: chartColors.low,
  grid: '#e2e8f0',
  text: '#64748b',
  tooltipBg: '#0f172a',
};

export const stockDonutData = (distribution) => [
  { name: 'Healthy', value: distribution.healthy, fill: CHART.healthy },
  { name: 'Medium', value: distribution.medium, fill: CHART.medium },
  { name: 'Low Stock', value: distribution.low, fill: CHART.low },
];
