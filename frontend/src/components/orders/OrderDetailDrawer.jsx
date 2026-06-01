import {
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { CheckCircle, Circle, Package, X } from 'lucide-react';

import { formatCurrency, formatDate } from '../../utils/format';

export default function OrderDetailDrawer({ open, order, customerName, productNames, loading, onClose }) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 440 } } }}>
      <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={800}>
          Order Details
        </Typography>
        <IconButton onClick={onClose} aria-label="Close drawer">
          <X size={20} />
        </IconButton>
      </Box>
      <Divider />

      {loading || !order ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary">Loading order...</Typography>
        </Box>
      ) : (
        <Box sx={{ p: 2.5 }}>
          <Chip label="Completed" color="success" size="small" icon={<CheckCircle size={14} />} sx={{ mb: 2 }} />

          <Box sx={{ mb: 2, pl: 1 }}>
            {[
              { title: 'Order created', sub: formatDate(order.created_at), color: 'primary.main' },
              { title: 'Inventory updated', sub: 'Stock deducted on placement', color: 'success.main' },
            ].map((step, i) => (
              <Box key={step.title} sx={{ display: 'flex', gap: 1.5, mb: i === 0 ? 1.5 : 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Circle size={10} fill="currentColor" style={{ color: 'var(--mui-palette-primary-main)' }} />
                  {i === 0 && <Box sx={{ width: 2, flex: 1, bgcolor: 'divider', minHeight: 24 }} />}
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={600}>{step.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{step.sub}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Typography variant="caption" color="text.secondary">Customer</Typography>
          <Typography fontWeight={600} gutterBottom>{customerName || order.customer_id}</Typography>

          <Typography variant="caption" color="text.secondary">Order ID</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 2 }}>{order.id}</Typography>

          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Package size={16} /> Line items
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(order.items || []).map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{productNames[item.product_id] || 'Product'}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(item.line_total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: 'action.hover', display: 'flex', justifyContent: 'space-between' }}>
            <Typography fontWeight={700}>Order total</Typography>
            <Typography fontWeight={800} color="primary.main">{formatCurrency(order.total_amount)}</Typography>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
