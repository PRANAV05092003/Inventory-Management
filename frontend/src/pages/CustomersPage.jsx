import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
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
import { Mail, Phone, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import CustomerFormDialog from '../components/customers/CustomerFormDialog';
import AvatarInitials from '../components/ui/AvatarInitials';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import GlassCard from '../components/ui/GlassCard';
import PageHeader, { Button } from '../components/ui/PageHeader';
import PageSkeleton from '../components/ui/PageSkeleton';
import SearchField from '../components/ui/SearchField';
import { useDebounce } from '../hooks/useDebounce';
import { useNotification } from '../hooks/useNotification';
import { createCustomer, deleteCustomer, fetchCustomers } from '../services/customers';
import { getErrorMessage } from '../utils/errors';

export default function CustomersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess, showError } = useNotification();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debouncedSearch = useDebounce(search);

  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchCustomers({ page: 1, size: 100 });
      setCustomers(data.items);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setFormOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filtered = useMemo(() => {
    if (!debouncedSearch) return customers;
    const q = debouncedSearch.toLowerCase();
    return customers.filter(
      (c) => c.full_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    );
  }, [customers, debouncedSearch]);

  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  if (loading) return <PageSkeleton cards={3} />;

  return (
    <Box>
      <PageHeader
        title="Customers"
        description="CRM-style customer directory for orders and communications."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Customers' }]}
        action={
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setFormOpen(true)}>
            Add Customer
          </Button>
        }
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <GlassCard sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">Total customers</Typography>
            <Typography variant="h5" fontWeight={800}>{customers.length}</Typography>
          </GlassCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <GlassCard sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">Showing</Typography>
            <Typography variant="h5" fontWeight={800}>{filtered.length}</Typography>
          </GlassCard>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 2 }}>
        <SearchField value={search} onChange={setSearch} placeholder="Search name or email..." />
      </Paper>

      {filtered.length === 0 ? (
        <Paper><EmptyState title="No customers" message="Add your first customer to start placing orders." actionLabel="Add Customer" onAction={() => setFormOpen(true)} /></Paper>
      ) : isMobile ? (
        <Grid container spacing={2}>
          {paged.map((c) => (
            <Grid item xs={12} key={c.id}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ display: 'flex', gap: 2 }}>
                  <AvatarInitials name={c.full_name} size={48} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight={700}>{c.full_name}</Typography>
                    <Chip icon={<Mail size={12} />} label={c.email} size="small" sx={{ mt: 0.5, maxWidth: '100%' }} />
                    <Typography variant="caption" display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
                      <Phone size={12} /> {c.phone}
                    </Typography>
                  </Box>
                  <IconButton color="error" onClick={() => { setToDelete(c); setDeleteOpen(true); }} aria-label="Delete"><Trash2 size={18} /></IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <AvatarInitials name={c.full_name} />
                      <Typography fontWeight={600}>{c.full_name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Chip icon={<Mail size={14} />} label={c.email} size="small" variant="outlined" /></TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete"><IconButton color="error" onClick={() => { setToDelete(c); setDeleteOpen(true); }}><Trash2 size={18} /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination component="div" count={filtered.length} page={page} onPageChange={(_e, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />

      <CustomerFormDialog open={formOpen} loading={submitting} onClose={() => setFormOpen(false)} onSubmit={async (payload) => {
        setSubmitting(true);
        try { await createCustomer(payload); showSuccess('Customer created'); setFormOpen(false); load(); }
        catch (err) { showError(getErrorMessage(err)); }
        finally { setSubmitting(false); }
      }} />

      <ConfirmDialog open={deleteOpen} title="Delete customer" message={`Remove ${toDelete?.full_name}?`} loading={deleting} onCancel={() => setDeleteOpen(false)} onConfirm={async () => {
        setDeleting(true);
        try { await deleteCustomer(toDelete.id); showSuccess('Customer deleted'); setDeleteOpen(false); load(); }
        catch (err) { showError(getErrorMessage(err)); }
        finally { setDeleting(false); }
      }} />
    </Box>
  );
}
