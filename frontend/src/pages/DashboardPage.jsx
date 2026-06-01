import { Alert, Box, Grid, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import CompactKpiRow from '../components/dashboard/CompactKpiRow';
import CriticalStockTable from '../components/dashboard/CriticalStockTable';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import InventoryValueBreakdownChart from '../components/dashboard/InventoryValuePieChart';
import QuickActionsPanel from '../components/dashboard/QuickActionsPanel';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable';
import StockHealthChart from '../components/dashboard/StockHealthChart';
import TopProductsBarChart from '../components/dashboard/TopProductsBarChart';
import { fetchDashboardData } from '../services/dashboard';
import { getErrorMessage } from '../utils/errors';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await fetchDashboardData());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <DashboardSkeleton />;

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, gap: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} letterSpacing="-0.02em">
            Operations Dashboard
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Live data only — counts match your database (empty fields show 0)
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 1.5, py: 0.5 }}>
          {error}
        </Alert>
      )}

      {data && (
        <Grid container spacing={1.5} alignItems="flex-start">
          <Grid item xs={12}>
            <CompactKpiRow data={data} />
          </Grid>

          <Grid item xs={12} md={8} sx={{ display: 'flex' }}>
            <Box sx={{ width: '100%' }}>
              <StockHealthChart distribution={data.stockDistribution} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <Box sx={{ width: '100%' }}>
              <CriticalStockTable products={data.criticalStock} threshold={data.lowStockThreshold} />
            </Box>
          </Grid>

          <Grid item xs={12} md={8} sx={{ display: 'flex' }}>
            <Box sx={{ width: '100%' }}>
              <RecentOrdersTable orders={data.recentOrders} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <Box sx={{ width: '100%' }}>
              <ActivityTimeline events={data.activityFeed} />
            </Box>
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
            <Box sx={{ width: '100%' }}>
              <TopProductsBarChart data={data.topProducts} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
            <Box sx={{ width: '100%' }}>
              <InventoryValueBreakdownChart data={data.inventoryBreakdown} />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <QuickActionsPanel />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
