import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { radius } from '../../theme/tokens';

const empty = { full_name: '', email: '', phone: '' };

export default function CustomerFormDialog({ open, loading, onClose, onSubmit }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(empty);
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const next = {};
    if (form.full_name.trim().length < 2) next.full_name = 'Min 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Invalid email';
    if (form.phone.trim().length < 7) next.phone = 'Min 7 characters';
    setErrors(next);
    return !Object.keys(next).length;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!validate()) return;
          onSubmit({ full_name: form.full_name.trim(), email: form.email.trim(), phone: form.phone.trim() });
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: radius.md, bgcolor: 'secondary.main', color: '#fff', display: 'flex' }}>
            <UserPlus size={20} />
          </Box>
          New Customer
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} error={!!errors.full_name} helperText={errors.full_name} fullWidth autoFocus />
          <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={!!errors.email} helperText={errors.email} fullWidth />
          <TextField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={!!errors.phone} helperText={errors.phone} fullWidth />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}>
            Create Customer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
