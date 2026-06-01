import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ProductFormDialog from '../components/products/ProductFormDialog';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import PageHeader, { Button } from '../components/ui/PageHeader';
import PageSkeleton from '../components/ui/PageSkeleton';
import SearchField from '../components/ui/SearchField';
import StockBadge from '../components/ui/StockBadge';
import { useDebounce } from '../hooks/useDebounce';
import { useNotification } from '../hooks/useNotification';
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../services/products';
import { getErrorMessage } from '../utils/errors';
import { formatCurrency } from '../utils/format';
import { getStockLevel } from '../utils/stock';

export default function ProductsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess, showError } = useNotification();

  const [allProducts, setAllProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const debouncedSearch = useDebounce(search);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchProducts({ page: 1, size: 100 });
      setAllProducts(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
    if (searchParams.get('action') === 'create') {
      setFormMode('create');
      setSelected(null);
      setFormOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (stockFilter !== 'all') {
      list = list.filter((p) => getStockLevel(p.quantity_in_stock) === stockFilter);
    }
    list.sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'price') return (a.price - b.price) * mul;
      if (sortBy === 'stock') return (a.quantity_in_stock - b.quantity_in_stock) * mul;
      return a.name.localeCompare(b.name) * mul;
    });
    return list;
  }, [allProducts, debouncedSearch, stockFilter, sortBy, sortDir]);

  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleSort = (field) => {
    if (sortBy === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  if (loading) return <PageSkeleton />;

  return (
    <Box>
      <PageHeader
        title="Products"
        description="Manage catalog, pricing, and inventory levels."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Products' }]}
        action={
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => { setFormMode('create'); setSelected(null); setFormOpen(true); }}>
            Add Product
          </Button>
        }
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <SearchField value={search} onChange={setSearch} placeholder="Search name or SKU..." />
        <TextField select size="small" label="Stock" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="all">All levels</MenuItem>
          <MenuItem value="healthy">Healthy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="low">Low stock</MenuItem>
        </TextField>
        <Chip label={`${filtered.length} products`} variant="outlined" />
      </Paper>

      {filtered.length === 0 ? (
        <Paper>
          <EmptyState title="No products found" message="Try adjusting filters or add a new product." actionLabel="Add Product" onAction={() => setFormOpen(true)} />
        </Paper>
      ) : isMobile ? (
        <Grid container spacing={2}>
          {paged.map((product) => (
            <Grid item xs={12} sm={6} key={product.id}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography fontWeight={700}>{product.name}</Typography>
                  <Typography variant="caption" color="text.secondary">SKU {product.sku}</Typography>
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography fontWeight={600}>{formatCurrency(product.price)}</Typography>
                    <StockBadge quantity={product.quantity_in_stock} />
                  </Box>
                  <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => { setFormMode('edit'); setSelected(product); setFormOpen(true); }} aria-label="Edit"><Pencil size={16} /></IconButton>
                    <IconButton size="small" color="error" onClick={() => { setToDelete(product); setDeleteOpen(true); }} aria-label="Delete"><Trash2 size={16} /></IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: 520 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel active={sortBy === 'name'} direction={sortBy === 'name' ? sortDir : 'asc'} onClick={() => handleSort('name')}>Name</TableSortLabel>
                </TableCell>
                <TableCell>SKU</TableCell>
                <TableCell align="right">
                  <TableSortLabel active={sortBy === 'price'} direction={sortBy === 'price' ? sortDir : 'asc'} onClick={() => handleSort('price')}>Price</TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel active={sortBy === 'stock'} direction={sortBy === 'stock' ? sortDir : 'asc'} onClick={() => handleSort('stock')}>Stock</TableSortLabel>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.map((product) => (
                <TableRow key={product.id} hover sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                  <TableCell><Typography fontWeight={600}>{product.name}</Typography></TableCell>
                  <TableCell><Chip label={product.sku} size="small" variant="outlined" /></TableCell>
                  <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                  <TableCell align="right"><StockBadge quantity={product.quantity_in_stock} /></TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => { setFormMode('edit'); setSelected(product); setFormOpen(true); }}><Pencil size={16} /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => { setToDelete(product); setDeleteOpen(true); }}><Trash2 size={16} /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={(_e, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[5, 10, 25]}
      />

      <ProductFormDialog open={formOpen} mode={formMode} initialValues={selected} loading={submitting} onClose={() => setFormOpen(false)} onSubmit={async (payload) => {
        setSubmitting(true);
        try {
          if (formMode === 'create') { await createProduct(payload); showSuccess('Product created'); }
          else { await updateProduct(selected.id, payload); showSuccess('Product updated'); }
          setFormOpen(false);
          load();
        } catch (err) { showError(getErrorMessage(err)); }
        finally { setSubmitting(false); }
      }} />

      <ConfirmDialog open={deleteOpen} title="Delete product" message={`Remove "${toDelete?.name}"? This cannot be undone.`} loading={deleting} onCancel={() => setDeleteOpen(false)} onConfirm={async () => {
        setDeleting(true);
        try { await deleteProduct(toDelete.id); showSuccess('Product deleted'); setDeleteOpen(false); load(); }
        catch (err) { showError(getErrorMessage(err)); }
        finally { setDeleting(false); }
      }} />
    </Box>
  );
}
