import {
  Alert,
  Box,
  Chip,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ChevronDown, ChevronUp, Eye, Plus, Receipt, Trash2 } from 'lucide-react';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import CreateOrderDialog from '../components/orders/CreateOrderDialog';
import OrderDetailDrawer from '../components/orders/OrderDetailDrawer';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import GlassCard from '../components/ui/GlassCard';
import PageHeader, { Button } from '../components/ui/PageHeader';
import PageSkeleton from '../components/ui/PageSkeleton';
import { useNotification } from '../hooks/useNotification';
import { fetchCustomers } from '../services/customers';
import { createOrder, deleteOrder, fetchOrder, fetchOrders } from '../services/orders';
import { fetchProducts } from '../services/products';
import { getErrorMessage } from '../utils/errors';
import { formatCurrency, formatDate } from '../utils/format';

export default function OrdersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess, showError } = useNotification();

  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const customerMap = useMemo(() => Object.fromEntries(customers.map((c) => [c.id, c.full_name])), [customers]);
  const productNameMap = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p.name])), [products]);

  const orderVolume = useMemo(() => orders.reduce((s, o) => s + Number(o.total_amount), 0), [orders]);

  const loadRefs = useCallback(async () => {
    const [c, p] = await Promise.all([fetchCustomers({ page: 1, size: 100 }), fetchProducts({ page: 1, size: 100 })]);
    setCustomers(Array.isArray(c?.items) ? c.items : []);
    setProducts(Array.isArray(p?.items) ? p.items : []);
  }, []);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchOrders({ page: page + 1, size: rowsPerPage });
      setOrders(Array.isArray(data?.items) ? data.items : []);
      setTotal(data.total);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    loadRefs();
    loadOrders();
  }, [loadRefs, loadOrders]);

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setCreateOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const openDetail = async (id) => {
    setDrawerOpen(true);
    setDetailLoading(true);
    setSelectedOrder(null);
    try {
      setSelectedOrder(await fetchOrder(id));
    } catch (err) {
      showError(getErrorMessage(err));
      setDrawerOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading && orders.length === 0) return <PageSkeleton cards={3} />;

  return (
    <Box>
      <PageHeader
        title="Orders"
        description="Create orders, track revenue, and review line-item breakdowns."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Orders' }]}
        action={
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => { setCreateError(''); setCreateOpen(true); loadRefs(); }}>
            Create Order
          </Button>
        }
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <GlassCard sx={{ p: 2, background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(255,255,255,0.95))' }}>
            <Typography variant="caption" color="text.secondary">Page revenue</Typography>
            <Typography variant="h5" fontWeight={800}>{formatCurrency(orderVolume)}</Typography>
          </GlassCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <GlassCard sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">Orders on page</Typography>
            <Typography variant="h5" fontWeight={800}>{orders.length}</Typography>
          </GlassCard>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {orders.length === 0 ? (
        <Paper><EmptyState title="No orders yet" message="Create your first order to see it here." icon={Receipt} actionLabel="Create Order" onAction={() => setCreateOpen(true)} /></Paper>
      ) : isMobile ? (
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <GlassCard sx={{ p: 2 }} hover>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip label="Fulfilled" color="success" size="small" />
                  <Typography variant="caption">{formatDate(order.created_at)}</Typography>
                </Box>
                <Typography fontWeight={700}>{customerMap[order.customer_id] || 'Customer'}</Typography>
                <Typography variant="h6" color="primary.main" fontWeight={800}>{formatCurrency(order.total_amount)}</Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                  <IconButton size="small" onClick={() => openDetail(order.id)} aria-label="View"><Eye size={18} /></IconButton>
                  <IconButton size="small" color="error" onClick={() => { setToDelete(order); setDeleteOpen(true); }} aria-label="Delete"><Trash2 size={18} /></IconButton>
                </Box>
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={48} />
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <Fragment key={order.id}>
                  <TableRow hover sx={{ cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                    <TableCell>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === order.id ? null : order.id); }}>
                        {expandedId === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{order.id.slice(0, 8)}…</TableCell>
                    <TableCell fontWeight={600}>{customerMap[order.customer_id] || '—'}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrency(order.total_amount)}</TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell><Chip label="Completed" color="success" size="small" /></TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="View details"><IconButton onClick={() => openDetail(order.id)}><Eye size={18} /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton color="error" onClick={() => { setToDelete(order); setDeleteOpen(true); }}><Trash2 size={18} /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={7} sx={{ py: 0, border: 0 }}>
                      <Collapse in={expandedId === order.id} timeout="auto" unmountOnExit>
                        <Box sx={{ py: 2, px: 2, bgcolor: 'action.hover', borderRadius: 2, my: 1 }}>
                          <Typography variant="body2" color="text.secondary">Click view for full line-item breakdown and timeline.</Typography>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination component="div" count={total} page={page} onPageChange={(_e, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />

      <CreateOrderDialog open={createOpen} customers={customers} products={products} loading={createLoading} apiError={createError} onClose={() => setCreateOpen(false)} onSubmit={async (payload) => {
        setCreateLoading(true);
        setCreateError('');
        try {
          await createOrder(payload);
          showSuccess('Order placed successfully');
          setCreateOpen(false);
          loadOrders();
          loadRefs();
        } catch (err) {
          const msg = getErrorMessage(err);
          setCreateError(msg);
          if (msg !== 'Insufficient inventory') showError(msg);
        } finally {
          setCreateLoading(false);
        }
      }} />

      <OrderDetailDrawer open={drawerOpen} order={selectedOrder} customerName={selectedOrder ? customerMap[selectedOrder.customer_id] : ''} productNames={productNameMap} loading={detailLoading} onClose={() => setDrawerOpen(false)} />

      <ConfirmDialog open={deleteOpen} title="Delete order" message="Delete this order? Inventory will not be restored." loading={deleting} onCancel={() => setDeleteOpen(false)} onConfirm={async () => {
        setDeleting(true);
        try { await deleteOrder(toDelete.id); showSuccess('Order deleted'); setDeleteOpen(false); loadOrders(); }
        catch (err) { showError(getErrorMessage(err)); }
        finally { setDeleting(false); }
      }} />
    </Box>
  );
}
