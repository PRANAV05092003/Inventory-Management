import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./products', () => ({
  fetchProducts: vi.fn(),
}));

vi.mock('./customers', () => ({
  fetchCustomers: vi.fn(),
}));

vi.mock('./orders', () => ({
  fetchOrders: vi.fn(),
  fetchOrder: vi.fn(),
}));

import { fetchCustomers } from './customers';
import { fetchOrders } from './orders';
import { fetchProducts } from './products';
import { fetchDashboardData } from './dashboard';

describe('fetchDashboardData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns zeros and empty lists when all APIs are empty', async () => {
    const emptyPage = { items: [], total: 0, page: 1, size: 10 };
    fetchProducts.mockResolvedValue(emptyPage);
    fetchCustomers.mockResolvedValue(emptyPage);
    fetchOrders.mockResolvedValue(emptyPage);

    const data = await fetchDashboardData();

    expect(data.totalProducts).toBe(0);
    expect(data.totalCustomers).toBe(0);
    expect(data.totalOrders).toBe(0);
    expect(data.recentOrders).toEqual([]);
    expect(data.activityFeed).toEqual([]);
    expect(data.topProducts).toEqual([]);
  });

  it('does not throw when items is undefined on a list response', async () => {
    fetchProducts.mockResolvedValue({ total: 0, page: 1, size: 10 });
    fetchCustomers.mockResolvedValue({ items: [], total: 0, page: 1, size: 10 });
    fetchOrders.mockResolvedValue({ items: [], total: 0, page: 1, size: 10 });

    await expect(fetchDashboardData()).resolves.toMatchObject({
      totalProducts: 0,
      totalCustomers: 0,
      totalOrders: 0,
    });
  });
});
