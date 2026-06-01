import { Box, Button, Grid, Typography } from '@mui/material';
import { Package, Plus, Receipt, Users, Warehouse } from 'lucide-react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardPanel from './DashboardPanel';

const actions = [
  { label: 'Add Product', icon: Package, path: '/products?action=create', color: '#6366f1' },
  { label: 'Add Customer', icon: Users, path: '/customers?action=create', color: '#3b82f6' },
  { label: 'Create Order', icon: Receipt, path: '/orders?action=create', color: '#10b981' },
  { label: 'View Inventory', icon: Warehouse, path: '/products', color: '#8b5cf6' },
];

function QuickActionsPanel() {
  const navigate = useNavigate();

  return (
    <DashboardPanel title="Quick Actions" subtitle="Common operations workflows" dense>
      <Grid container spacing={1.5}>
        {actions.map(({ label, icon: Icon, path, color }) => (
          <Grid item xs={12} sm={6} md={3} key={label}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate(path)}
              sx={{
                py: 1.25,
                justifyContent: 'flex-start',
                gap: 1.25,
                borderColor: 'divider',
                color: 'text.primary',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: color,
                  bgcolor: `${color}0a`,
                },
              }}
              startIcon={
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: `${color}18`,
                    color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={16} />
                </Box>
              }
            >
              <Typography variant="body2" fontWeight={600}>
                {label}
              </Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
    </DashboardPanel>
  );
}

export default memo(QuickActionsPanel);
