import { useEffect, useState } from 'react';

import { LOW_STOCK_THRESHOLD } from '../services/dashboard';
import { fetchProducts } from '../services/products';
import { extractItems } from '../utils/apiResponse';

export function useLowStockCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProducts({ page: 1, size: 100 });
        const items = extractItems(data);
        if (!cancelled) {
          setCount(
            items.filter((p) => Number(p?.quantity_in_stock ?? 0) < LOW_STOCK_THRESHOLD).length,
          );
        }
      } catch {
        if (!cancelled) setCount(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return count;
}
