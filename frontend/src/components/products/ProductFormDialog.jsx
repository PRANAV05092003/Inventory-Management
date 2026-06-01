import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { Package } from 'lucide-react';
import { useEffect, useState } from 'react';

import { radius } from '../../theme/tokens';

const emptyForm = { name: '', sku: '', price: '', quantity_in_stock: '' };
const steps = ['Details', 'Pricing & Stock'];

export default function ProductFormDialog({ open, mode = 'create', initialValues, loading, onClose, onSubmit }) {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setActiveStep(0);
    setErrors({});
    if (initialValues) {
      setForm({
        name: initialValues.name ?? '',
        sku: initialValues.sku ?? '',
        price: String(initialValues.price ?? ''),
        quantity_in_stock: String(initialValues.quantity_in_stock ?? ''),
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, initialValues]);

  const validateStep = (step) => {
    const next = {};
    if (step === 0) {
      if (form.name.trim().length < 2) next.name = 'Min 2 characters';
      if (!form.sku.trim()) next.sku = 'Required';
    }
    if (step === 1) {
      if (!form.price || Number(form.price) <= 0) next.price = 'Must be > 0';
      if (form.quantity_in_stock === '' || Number(form.quantity_in_stock) < 0) {
        next.quantity_in_stock = 'Cannot be negative';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) setActiveStep((s) => s + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(1)) return;
    onSubmit({
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: Number(form.price),
      quantity_in_stock: Number(form.quantity_in_stock),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: radius.md, bgcolor: 'primary.main', color: '#fff', display: 'flex' }}>
            <Package size={20} />
          </Box>
          {mode === 'create' ? 'Add Product' : 'Edit Product'}
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={!!errors.name} helperText={errors.name} fullWidth autoFocus />
              <TextField label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} error={!!errors.sku} helperText={errors.sku || 'Stored uppercase'} fullWidth />
            </Box>
          )}

          {activeStep === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Unit price" type="number" inputProps={{ min: 0.01, step: 0.01 }} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} error={!!errors.price} helperText={errors.price} fullWidth />
              <TextField label="Quantity in stock" type="number" inputProps={{ min: 0 }} value={form.quantity_in_stock} onChange={(e) => setForm({ ...form, quantity_in_stock: e.target.value })} error={!!errors.quantity_in_stock} helperText={errors.quantity_in_stock} fullWidth />
              <Typography variant="caption" color="text.secondary">
                Review details before saving.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          {activeStep > 0 && (
            <Button onClick={() => setActiveStep(0)} disabled={loading}>
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}>
              {mode === 'create' ? 'Create Product' : 'Save Changes'}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
