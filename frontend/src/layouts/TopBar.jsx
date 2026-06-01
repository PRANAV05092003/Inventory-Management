import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { Bell, Menu as MenuIcon, Plus, Search } from 'lucide-react';
import { memo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useLowStockCount } from '../hooks/useLowStockCount';
import { layout } from '../theme/tokens';

const quickActions = {
  '/': { label: 'Create Order', path: '/orders?action=create' },
  '/products': { label: 'Add Product', path: '/products?action=create' },
  '/customers': { label: 'Add Customer', path: '/customers?action=create' },
  '/orders': { label: 'Create Order', path: '/orders?action=create' },
};

function TopBar({ sidebarWidth, onMenuClick, showMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const lowStockCount = useLowStockCount();
  const action = quickActions[location.pathname] || quickActions['/'];

  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        ml: { md: `${sidebarWidth}px` },
        bgcolor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
        transition: 'width 0.25s, margin 0.25s',
      }}
    >
      <Toolbar sx={{ minHeight: `${layout.topbarHeight}px !important`, gap: 1, py: 0.5 }}>
        {showMenu && (
          <IconButton edge="start" onClick={onMenuClick} aria-label="Open menu" size="small">
            <MenuIcon size={20} />
          </IconButton>
        )}

        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, maxWidth: 360 }}
        >
          <TextField
            size="small"
            fullWidth
            placeholder="Search products, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
              sx: { fontSize: '0.875rem', bgcolor: 'action.hover', borderRadius: 2 },
            }}
          />
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: { xs: 'none', lg: 'block' }, whiteSpace: 'nowrap' }}
        >
          {today}
        </Typography>

        <Box sx={{ flex: 1, display: { md: 'none' } }} />

        <Button
          size="small"
          variant="contained"
          startIcon={<Plus size={16} />}
          onClick={() => navigate(action.path)}
          sx={{ display: { xs: 'none', sm: 'inline-flex' }, textTransform: 'none', fontWeight: 600, px: 1.5 }}
        >
          {action.label}
        </Button>

        <IconButton aria-label="Notifications" size="small">
          <Badge badgeContent={lowStockCount || null} color="error" max={99}>
            <Bell size={18} />
          </Badge>
        </IconButton>

        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label="Profile menu"
          size="small"
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.7rem',
          }}
        >
          OA
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem disabled>
            <Typography variant="body2" fontWeight={600}>
              Operations Admin
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/'); }}>Dashboard</MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/products'); }}>Inventory</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default memo(TopBar);
