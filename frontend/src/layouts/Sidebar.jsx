import { Badge, Box, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight, LayoutDashboard, Package, Receipt, Users } from 'lucide-react';
import { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { useLowStockCount } from '../hooks/useLowStockCount';
import { gradients, layout, radius } from '../theme/tokens';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package, badgeKey: 'products' },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/orders', label: 'Orders', icon: Receipt },
];

function Sidebar({ collapsed, onToggleCollapse, onNavigate }) {
  const width = collapsed ? layout.sidebarCollapsed : layout.sidebarExpanded;
  const location = useLocation();
  const lowStockCount = useLowStockCount();

  return (
    <Box
      sx={{
        width,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        color: '#fff',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: collapsed ? 1 : 1.5,
          py: 1.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: layout.topbarHeight,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: radius.sm,
                background: gradients.brand,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.75rem',
              }}
            >
              IN
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={800} lineHeight={1.2} fontSize="0.8rem">
                Inventra Ops
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.55, fontSize: '0.6rem' }}>
                Inventory Control
              </Typography>
            </Box>
          </Box>
        )}
        <IconButton
          onClick={onToggleCollapse}
          size="small"
          sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' } }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </IconButton>
      </Box>

      <List sx={{ px: 0.75, py: 1.5, flex: 1 }}>
        {navItems.map(({ to, label, icon: Icon, end, badgeKey }) => {
          const isActive =
            end ? location.pathname === '/' : location.pathname.startsWith(to);
          const badge =
            badgeKey === 'products' && lowStockCount > 0 ? lowStockCount : null;

          return (
            <Tooltip key={to} title={collapsed ? label : ''} placement="right">
              <ListItemButton
                component={NavLink}
                to={to}
                end={end}
                onClick={onNavigate}
                sx={{
                  borderRadius: radius.sm,
                  mb: 0.25,
                  minHeight: 40,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 1 : 1.25,
                  color: 'rgba(255,255,255,0.65)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  '&.active, &.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.28) 100%)',
                    color: '#fff',
                    boxShadow: 'inset 3px 0 0 #818cf8',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    transform: 'translateX(2px)',
                  },
                  ...(isActive && {
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.28) 100%)',
                    color: '#fff',
                    boxShadow: 'inset 3px 0 0 #818cf8',
                  }),
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: 'inherit', justifyContent: 'center' }}>
                  <Badge color="error" variant="dot" invisible={!badge} overlap="circular">
                    <Icon size={18} strokeWidth={2} />
                  </Badge>
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.8125rem' }}
                  />
                )}
                {!collapsed && badge && (
                  <Badge badgeContent={badge} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem' } }} />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      {!collapsed && (
        <Box
          sx={{
            p: 1.25,
            m: 1,
            borderRadius: radius.sm,
            bgcolor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.5, fontSize: '0.65rem' }}>
            Alerts
          </Typography>
          <Typography variant="body2" fontWeight={700} fontSize="0.8rem">
            {lowStockCount} low-stock SKUs
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default memo(Sidebar);
