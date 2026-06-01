import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { layout } from '../theme/tokens';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppShell() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const sidebarWidth = isMobile ? 0 : collapsed ? layout.sidebarCollapsed : layout.sidebarExpanded;

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sidebar-collapsed', String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const drawer = (
    <Sidebar
      collapsed={!isMobile && collapsed}
      onToggleCollapse={toggleCollapse}
      onNavigate={() => setMobileOpen(false)}
    />
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <TopBar
        sidebarWidth={sidebarWidth}
        showMenu={isMobile}
        onMenuClick={() => setMobileOpen(true)}
      />

      <Box component="nav" sx={{ width: { md: sidebarWidth }, flexShrink: 0 }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            PaperProps={{ sx: { width: layout.sidebarExpanded } }}
          >
            <Sidebar collapsed={false} onToggleCollapse={() => setMobileOpen(false)} onNavigate={() => setMobileOpen(false)} />
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            open
            PaperProps={{
              sx: {
                width: sidebarWidth,
                overflow: 'hidden',
                border: 'none',
                transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${sidebarWidth}px)` },
          mt: `${layout.topbarHeight}px`,
          p: { xs: 1.5, sm: 2 },
          minHeight: `calc(100vh - ${layout.topbarHeight}px)`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
