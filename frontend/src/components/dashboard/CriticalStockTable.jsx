import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { memo } from 'react';

import DashboardPanel from './DashboardPanel';

function CriticalStockTable({ products, threshold }) {
  return (
    <DashboardPanel
      title="Critical Stock Alerts"
      subtitle={`Top 5 below ${threshold} units`}
      minHeight={280}
      sx={{ borderColor: 'warning.light' }}
    >
      {products.length === 0 ? (
        <Typography variant="body2" color="success.main" fontWeight={600}>
          No critical stock issues.
        </Typography>
      ) : (
        <Table size="small" sx={{ '& td, & th': { py: 0.75, px: 1, borderColor: 'divider' } }}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell align="right">Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 120 }}>
                    {p.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                    {p.sku}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={p.quantity_in_stock}
                    size="small"
                    color="error"
                    variant="outlined"
                    sx={{ height: 22, fontWeight: 700, minWidth: 36 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DashboardPanel>
  );
}

export default memo(CriticalStockTable);
