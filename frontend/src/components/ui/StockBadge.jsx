import { Chip } from '@mui/material';
import { memo } from 'react';

import { getStockLevel, stockConfig } from '../../utils/stock';

function StockBadge({ quantity }) {
  const level = getStockLevel(quantity);
  const config = stockConfig[level];

  return (
    <Chip
      size="small"
      label={`${config.label} · ${quantity}`}
      color={config.color}
      variant="outlined"
      sx={{
        fontWeight: 600,
        borderColor: config.dot,
        '& .MuiChip-label': { px: 1 },
      }}
    />
  );
}

export default memo(StockBadge);
