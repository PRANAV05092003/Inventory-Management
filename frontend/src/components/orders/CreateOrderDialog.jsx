import { Plus, Trash2 } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import { formatCurrency } from '../../utils/format';

const emptyLine = () => ({ product_id: '', quantity: 1 });

export default function CreateOrderDialog({
  open,
  customers = [],
  products = [],
  loading = false,
  apiError = '',
  onClose,
  onSubmit,
}) {
  const [customerId, setCustomerId] = useState('');
  const [lines, setLines] = useState([emptyLine()]);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (open) {
      setCustomerId('');
      setLines([emptyLine()]);
      setFormError('');
    }
  }, [open]);

  const productMap = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p])),
    [products],
  );

  const preview = useMemo(() => {
    return lines.reduce(
      (acc, line) => {
        const product = productMap[line.product_id];
        if (!product || !line.quantity) return acc;
        const qty = Number(line.quantity);
        const lineTotal = product.price * qty;
        return {
          subtotal: acc.subtotal + lineTotal,
          rows: [
            ...acc.rows,
            {
              name: product.name,
              quantity: qty,
              unitPrice: product.price,
              lineTotal,
              stock: product.quantity_in_stock,
            },
          ],
        };
      },
      { subtotal: 0, rows: [] },
    );
  }, [lines, productMap]);

  const updateLine = (index, field, value) => {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, [field]: value } : line)),
    );
  };

  const addLine = () => setLines((prev) => [...prev, emptyLine()]);

  const removeLine = (index) => {
    setLines((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const validate = () => {
    if (!customerId) {
      setFormError('Please select a customer.');
      return false;
    }
    if (lines.some((line) => !line.product_id)) {
      setFormError('Each line must have a product selected.');
      return false;
    }
    if (lines.some((line) => !line.quantity || Number(line.quantity) <= 0)) {
      setFormError('Each line must have quantity greater than zero.');
      return false;
    }
    const quantityByProduct = lines.reduce((acc, line) => {
      if (!line.product_id) return acc;
      acc[line.product_id] = (acc[line.product_id] || 0) + Number(line.quantity || 0);
      return acc;
    }, {});

    const overStockId = Object.keys(quantityByProduct).find((productId) => {
      const product = productMap[productId];
      return product && quantityByProduct[productId] > product.quantity_in_stock;
    });

    if (overStockId) {
      const product = productMap[overStockId];
      setFormError(
        `Insufficient inventory for ${product.name}. Available: ${product.quantity_in_stock}, requested: ${quantityByProduct[overStockId]}`,
      );
      return false;
    }
    setFormError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      customer_id: customerId,
      items: lines.map((line) => ({
        product_id: line.product_id,
        quantity: Number(line.quantity),
      })),
    });
  };

  const displayError = apiError || formError;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Order</DialogTitle>
      <DialogContent>
        {displayError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {displayError}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="customer-select-label">Customer</InputLabel>
          <Select
            labelId="customer-select-label"
            label="Customer"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            {customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.full_name} ({customer.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="subtitle1" gutterBottom>
          Order Items
        </Typography>

        {lines.map((line, index) => {
          const product = productMap[line.product_id];
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                mb: 2,
                alignItems: 'flex-start',
              }}
            >
              <FormControl sx={{ flex: 2, minWidth: 200 }}>
                <InputLabel>Product</InputLabel>
                <Select
                  label="Product"
                  value={line.product_id}
                  onChange={(e) => updateLine(index, 'product_id', e.target.value)}
                >
                  {products.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name} — {formatCurrency(p.price)} (stock: {p.quantity_in_stock})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Quantity"
                type="number"
                inputProps={{ min: 1, step: 1 }}
                value={line.quantity}
                onChange={(e) => updateLine(index, 'quantity', e.target.value)}
                sx={{ width: 120 }}
              />
              {product && (
                <Typography variant="body2" color="text.secondary" sx={{ pt: 2 }}>
                  Line: {formatCurrency(product.price * Number(line.quantity || 0))}
                </Typography>
              )}
              <IconButton
                aria-label="Remove line"
                onClick={() => removeLine(index)}
                disabled={lines.length === 1}
                sx={{ mt: 0.5 }}
              >
                <Trash2 size={18} />
              </IconButton>
            </Box>
          );
        })}

        <Button startIcon={<Plus size={18} />} onClick={addLine} sx={{ mb: 3 }}>
          Add Product
        </Button>

        <Typography variant="subtitle1" gutterBottom>
          Order Preview
        </Typography>
        {preview.rows.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Select products to see preview.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Unit</TableCell>
                <TableCell align="right">Line Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {preview.rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(row.unitPrice)}</TableCell>
                  <TableCell align="right">{formatCurrency(row.lineTotal)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3}>
                  <strong>Total</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>{formatCurrency(preview.subtotal)}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          Place Order
        </Button>
      </DialogActions>
    </Dialog>
  );
}
