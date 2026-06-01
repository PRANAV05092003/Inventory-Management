# Dashboard V2 — Operations Intelligence

## Structure (12-column enterprise layout)

| Row | Left | Right |
|-----|------|-------|
| 1 | 6 compact KPIs (2 cols each) | — |
| 2 | Inventory donut (8) | Critical stock table (4) |
| 3 | Recent orders table (8) | Activity timeline (4) |
| 4 | Top products bar chart (6) | Inventory value pie (6) |
| 5 | Quick actions (12) | — |

## Components

- `CompactKpiRow`, `DashboardPanel`, `StockDonutChart`, `CriticalStockTable`
- `RecentOrdersTable`, `ActivityTimeline`, `TopProductsBarChart`, `InventoryValuePieChart`
- `QuickActionsPanel`, `DashboardSkeleton`

## Data

- `services/dashboard.js` — paginated API aggregation, trends, top sellers, price tiers
- `services/dashboard.js` — live API only; empty DB shows 0 and empty states
- `backend/scripts/seed_demo_data.py` — optional sample data (not used by dashboard)

### Seed database

```bash
cd backend
python scripts/seed_demo_data.py
```

## Charts

Recharts with tooltips, legends, labels, dual-axis bar chart, donut + pie.

## Shell updates

- Sidebar −15% width, alert badges, active rail indicator
- Top bar: search, date, notifications badge, profile menu, quick action

## Screenshots

Run `npm run dev` or Docker on port 3000 and capture the operations dashboard.
