import { Box, Button, Grid, Typography } from '@mui/material';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import GlassCard from '../ui/GlassCard';
import StockBadge from '../ui/StockBadge';
import { formatCurrency } from '../../utils/format';
import { radius } from '../../theme/tokens';

function LowStockCards({ products, threshold }) {
  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <GlassCard sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="success.main" fontWeight={600}>
          All products are above the low-stock threshold ({threshold} units).
        </Typography>
      </GlassCard>
    );
  }

  return (
    <Grid container spacing={2}>
      {products.slice(0, 6).map((product) => (
        <Grid item xs={12} sm={6} key={product.id}>
          <GlassCard
            sx={{
              p: 2,
              borderLeft: '4px solid',
              borderColor: 'error.main',
              background: 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(255,255,255,0.9) 100%)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <AlertTriangle size={16} color="#ef4444" />
                  <Typography variant="subtitle2" fontWeight={700}>
                    {product.name}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  SKU {product.sku} · {formatCurrency(product.price)}
                </Typography>
              </Box>
              <StockBadge quantity={product.quantity_in_stock} />
            </Box>
          </GlassCard>
        </Grid>
      ))}
      {products.length > 6 && (
        <Grid item xs={12}>
          <Button endIcon={<ArrowRight size={16} />} onClick={() => navigate('/products')}>
            View all {products.length} low-stock items
          </Button>
        </Grid>
      )}
    </Grid>
  );
}

export default memo(LowStockCards);
