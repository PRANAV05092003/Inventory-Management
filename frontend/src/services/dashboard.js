import { fetchCustomers } from './customers';
import { fetchOrder, fetchOrders } from './orders';
import { fetchProducts } from './products';

export const LOW_STOCK_THRESHOLD = 10;
const PAGE_SIZE = 100;

async function fetchAllPages(fetcher) {
  let page = 1;
  const items = [];
  let total = 0;
  do {
    const data = await fetcher({ page, size: PAGE_SIZE });
    items.push(...data.items);
    total = data.total;
    page += 1;
  } while (items.length < total && page <= 20);
  return { items, total };
}

function computeStockDistribution(products) {
  let low = 0;
  let medium = 0;
  let healthy = 0;
  products.forEach((p) => {
    const q = p.quantity_in_stock;
    if (q < LOW_STOCK_THRESHOLD) low += 1;
    else if (q < 25) medium += 1;
    else healthy += 1;
  });
  return { low, medium, healthy, total: products.length };
}

function priceTier(price) {
  const p = Number(price);
  if (p < 50) return 'Economy (<$50)';
  if (p <= 200) return 'Standard ($50–$200)';
  return 'Premium (>$200)';
}

function buildActivityFeed(products, customers, orders, lowStockProducts) {
  const events = [
    ...orders.map((o) => ({
      type: 'order',
      id: o.id,
      title: 'Order created',
      subtitle: `${Number(o.total_amount).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`,
      at: o.created_at,
    })),
    ...products.map((p) => ({
      type: 'product',
      id: p.id,
      title: 'Product added',
      subtitle: p.name,
      at: p.created_at,
    })),
    ...customers.map((c) => ({
      type: 'customer',
      id: c.id,
      title: 'Customer registered',
      subtitle: c.full_name,
      at: c.created_at,
    })),
    ...lowStockProducts.map((p) => ({
      type: 'low_stock',
      id: `ls-${p.id}`,
      title: 'Low stock detected',
      subtitle: `${p.name} · ${p.quantity_in_stock} units`,
      at: p.updated_at || p.created_at,
    })),
  ];
  return events.sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 12);
}

function aggregateTopProducts(orderDetails, productMap) {
  const stats = {};
  orderDetails.forEach((order) => {
    (order.items || []).forEach((item) => {
      const name = productMap[item.product_id] || 'Unknown product';
      if (!stats[name]) stats[name] = { name, orders: 0, revenue: 0 };
      stats[name].orders += 1;
      stats[name].revenue += Number(item.line_total);
    });
  });
  return Object.values(stats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

function inventoryValueByTier(products) {
  const tiers = {};
  products.forEach((p) => {
    const tier = priceTier(p.price);
    const value = Number(p.price) * Number(p.quantity_in_stock);
    tiers[tier] = (tiers[tier] || 0) + value;
  });
  return Object.entries(tiers).map(([name, value]) => ({ name, value: Math.round(value) }));
}

function buildKpiMeta({ totalProducts, totalCustomers, totalOrders, totalUnits, lowStockCount }) {
  return {
    products: { description: 'Unique products (SKUs) in catalog' },
    totalUnits: { description: 'Sum of quantity_in_stock across all products' },
    customers: { description: 'Registered customer accounts' },
    orders: { description: 'All orders placed' },
    inventoryValue: { description: 'Sum of price × stock on hand' },
    lowStock: {
      description: `SKUs with fewer than ${LOW_STOCK_THRESHOLD} units`,
      label: lowStockCount === 0 ? 'All SKUs above threshold' : `${lowStockCount} need reorder`,
      showTrend: false,
    },
    avgOrder: {
      description: totalOrders === 0 ? 'No orders to average' : 'Mean order total',
      showTrend: false,
    },
  };
}

/**
 * Dashboard metrics from live API only. Empty database → zeros and empty lists.
 */
export async function fetchDashboardData() {
  const [productsMeta, customersMeta, ordersMeta, productsResult, customersResult, ordersResult] =
    await Promise.all([
      fetchProducts({ page: 1, size: 1 }),
      fetchCustomers({ page: 1, size: 1 }),
      fetchOrders({ page: 1, size: 1 }),
      fetchAllPages(fetchProducts),
      fetchAllPages(fetchCustomers),
      fetchAllPages(fetchOrders),
    ]);

  const products = productsResult.items;
  const customers = customersResult.items;
  const orders = ordersResult.items;

  const totalProducts = productsMeta.total ?? 0;
  const totalCustomers = customersMeta.total ?? 0;
  const totalOrders = ordersMeta.total ?? 0;
  const totalUnits = products.reduce((sum, p) => sum + Number(p.quantity_in_stock || 0), 0);

  const productMap = Object.fromEntries(products.map((p) => [p.id, p.name]));
  const customerMap = Object.fromEntries(customers.map((c) => [c.id, c.full_name]));

  const inventoryValue = products.reduce(
    (sum, p) => sum + Number(p.price) * Number(p.quantity_in_stock),
    0,
  );

  const lowStockProducts = products
    .filter((p) => p.quantity_in_stock < LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.quantity_in_stock - b.quantity_in_stock);

  const sortedOrders = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const recentOrderSummaries = sortedOrders.slice(0, 10);

  let recentOrders = [];
  if (recentOrderSummaries.length > 0) {
    const orderDetails = await Promise.all(
      recentOrderSummaries.map((o) => fetchOrder(o.id).catch(() => null)),
    );
    recentOrders = recentOrderSummaries.map((o) => {
      const detail = orderDetails.find((d) => d?.id === o.id);
      return {
        id: o.id,
        customerName: customerMap[o.customer_id] || '—',
        itemCount: detail?.items?.length ?? 0,
        total_amount: o.total_amount,
        created_at: o.created_at,
      };
    });
  }

  let topProducts = [];
  if (orders.length > 0) {
    const details = await Promise.all(orders.map((o) => fetchOrder(o.id).catch(() => null)));
    topProducts = aggregateTopProducts(details.filter(Boolean), productMap);
  }

  const averageOrderValue = totalOrders > 0
    ? orders.reduce((s, o) => s + Number(o.total_amount), 0) / totalOrders
    : 0;

  const lowStockCount = lowStockProducts.length;
  const kpis = buildKpiMeta({ totalProducts, totalCustomers, totalOrders, totalUnits, lowStockCount });

  return {
    totalProducts,
    totalCustomers,
    totalOrders,
    totalUnits,
    inventoryValue,
    lowStockCount,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    averageOrderValue,
    kpis,
    stockDistribution: computeStockDistribution(products),
    criticalStock: lowStockProducts.slice(0, 5).map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      quantity_in_stock: p.quantity_in_stock,
    })),
    recentOrders,
    activityFeed: buildActivityFeed(products, customers, orders, lowStockProducts),
    topProducts,
    inventoryBreakdown: inventoryValueByTier(products),
  };
}
