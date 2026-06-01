import { stockThresholds } from '../theme/tokens';

/**
 * @param {number} quantity
 * @returns {'low' | 'medium' | 'healthy'}
 */
export function getStockLevel(quantity) {
  if (quantity < stockThresholds.low) return 'low';
  if (quantity < stockThresholds.medium) return 'medium';
  return 'healthy';
}

export const stockConfig = {
  low: { label: 'Low Stock', color: 'error', dot: '#ef4444' },
  medium: { label: 'Medium', color: 'warning', dot: '#f59e0b' },
  healthy: { label: 'In Stock', color: 'success', dot: '#10b981' },
};
