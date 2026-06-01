import { Box, Typography } from '@mui/material';
import { AlertTriangle, Boxes, DollarSign, Package, Receipt, Users } from 'lucide-react';
import { memo } from 'react';

import { formatCurrency } from '../../utils/format';

const KPI_CONFIG = [
  { key: 'products', title: 'Products (SKUs)', icon: Package, accent: '#6366f1' },
  { key: 'totalUnits', title: 'Units in Stock', icon: Boxes, accent: '#0ea5e9' },
  { key: 'customers', title: 'Customers', icon: Users, accent: '#3b82f6' },
  { key: 'orders', title: 'Orders', icon: Receipt, accent: '#10b981' },
  { key: 'inventoryValue', title: 'Inventory Value', icon: DollarSign, accent: '#8b5cf6', format: 'currency' },
  { key: 'lowStock', title: 'Low Stock SKUs', icon: AlertTriangle, accent: '#ef4444' },
  { key: 'avgOrder', title: 'Avg Order Value', icon: Receipt, accent: '#f59e0b', format: 'currency' },
];

function KpiTile({ title, value, meta, icon: Icon, accent }) {
  return (
    <Box
      sx={{
        p: 1.5,
        minHeight: 96,
        borderRadius: '10px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        gap: 1.25,
        alignItems: 'flex-start',
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '8px',
          bgcolor: `${accent}18`,
          color: accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={18} strokeWidth={2.2} />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={800} lineHeight={1.25} sx={{ letterSpacing: '-0.02em', my: 0.25 }}>
          {value}
        </Typography>
        {meta?.label && (
          <Typography variant="caption" color="warning.main" fontWeight={600} display="block">
            {meta.label}
          </Typography>
        )}
        {meta?.description && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.35, mt: 0.25 }}>
            {meta.description}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function CompactKpiRow({ data }) {
  const values = {
    products: data.totalProducts ?? 0,
    totalUnits: data.totalUnits ?? 0,
    customers: data.totalCustomers ?? 0,
    orders: data.totalOrders ?? 0,
    inventoryValue: formatCurrency(data.inventoryValue ?? 0),
    lowStock: data.lowStockCount ?? 0,
    avgOrder: data.totalOrders > 0 ? formatCurrency(data.averageOrderValue ?? 0) : formatCurrency(0),
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          sm: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
          xl: 'repeat(7, minmax(0, 1fr))',
        },
      }}
    >
      {KPI_CONFIG.map(({ key, title, icon, accent, format }) => (
        <KpiTile
          key={key}
          title={title}
          value={format === 'currency' ? values[key] : String(values[key])}
          meta={data.kpis?.[key]}
          icon={icon}
          accent={accent}
        />
      ))}
    </Box>
  );
}

export default memo(CompactKpiRow);
