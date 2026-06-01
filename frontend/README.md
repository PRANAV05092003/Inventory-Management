# Inventory & Order Management — Frontend (Phase 5)

React dashboard for the Inventory & Order Management System. Connects to the FastAPI backend (Phases 1–4).

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI library |
| Vite 6 | Build tool & dev server |
| React Router 7 | Client-side routing |
| Axios | HTTP client |
| Material UI 6 | Components & layout |

## Prerequisites

- Node.js 18+ and npm
- Backend API running at `http://localhost:8000` (Docker or local Uvicorn)

## Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (used for production builds and Vite proxy target) |

Example `.env`:

```env
VITE_API_URL=http://localhost:8000
```

**Development:** Vite proxies `/products`, `/customers`, `/orders`, and `/health` to the API so CORS is not required on the backend.

**Production build:** Set `VITE_API_URL` to your deployed API URL.

## Install & Run

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Other Commands

```bash
npm run build    # Production build → dist/
npm run preview  # Preview production build
npm test         # Run Vitest component tests
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — totals + low stock widget |
| `/products` | Product CRUD table with pagination |
| `/customers` | Customer table, add/delete |
| `/orders` | Orders table, create order, view details, delete |

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI (dialogs, dashboard widgets)
│   ├── contexts/       # NotificationContext
│   ├── hooks/
│   ├── layouts/        # MainLayout with sidebar
│   ├── pages/          # Route pages
│   ├── routes/         # AppRoutes
│   ├── services/       # Axios API layer
│   └── utils/          # errors, formatting
├── .env.example
├── package.json
└── vite.config.js
```

## Screenshots

<!-- Add dashboard, products, customers, and orders screenshots here -->

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API requests fail in dev | Ensure backend is running on port 8000 |
| CORS errors in production preview | Set `VITE_API_URL` or enable CORS on the backend |
| Empty dashboard | Create products/customers via API or UI first |

## Production Docker

```bash
# From project root (nginx proxies API to backend service)
docker compose build frontend
docker compose up frontend backend postgres
```

Open http://localhost:3000

See [DEPLOYMENT.md](../DEPLOYMENT.md) for Render, Vercel, Neon, and Docker Hub.

## License

Proprietary — internal use.
