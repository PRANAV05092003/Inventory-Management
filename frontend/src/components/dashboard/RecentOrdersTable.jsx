import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardEmpty from './DashboardEmpty';
import DashboardPanel from './DashboardPanel';
import { formatCurrency, formatDate } from '../../utils/format';

function RecentOrdersTable({ orders }) {
  const navigate = useNavigate();

  return (
    <DashboardPanel title="Recent Orders" subtitle="Latest 10 transactions" minHeight={280}>
      {orders.length === 0 ? (
        <DashboardEmpty message="No orders yet. Create an order to see it here." />
      ) : (
        <Table size="small" sx={{ '& td, & th': { py: 0.75, px: 1, borderColor: 'divider' } }}>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell align="center">Items</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow
                key={o.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate('/orders')}
              >
                <TableCell>
                  <Typography variant="caption" fontFamily="monospace">
                    {String(o.id).slice(0, 8)}…
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 140 }}>
                    {o.customerName}
                  </Typography>
                </TableCell>
                <TableCell align="center">{o.itemCount}</TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={700}>
                    {formatCurrency(o.total_amount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {formatDate(o.created_at)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DashboardPanel>
  );
}

export default memo(RecentOrdersTable);
