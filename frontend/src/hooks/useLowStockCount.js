import { useEffect, useState } from 'react';

import { fetchProducts } from '../services/products';
import { LOW_STOCK_THRESHOLD } from '../services/dashboard';

export function useLowStockCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { items } = await fetchProducts({ page: 1, size: 100 });
        if (!cancelled) {
          setCount(items.filter((p) => p.quantity_in_stock < LOW_STOCK_THRESHOLD).length);
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
