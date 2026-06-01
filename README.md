# Inventory & Order Management System

Full-stack inventory and order management application.

| Layer | Tech |
|-------|------|
| Backend | FastAPI, PostgreSQL, SQLAlchemy 2.0, Alembic |
| Frontend | React, Vite, Material UI, Axios |
| Deployment | Docker Compose, Render, Vercel, Neon, Docker Hub |

## Quick Start (Docker Compose)

```bash
cp .env.example .env
cp backend/.env.example backend/.env
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | [https://inventory-management-lac-seven.vercel.app/|
| API |https://inventory-management-1-f1k0.onrender.com/|
| API Docs |https://inventory-management-1-f1k0.onrender.com/docs |

## Project Structure

```
inventory/
├── backend/          # FastAPI API
├── frontend/         # React dashboard
├── docker-compose.yml
├── DEPLOYMENT.md     # Production deployment guide
├── render.yaml       # Render blueprint
└── .github/workflows/ci.yml
```

## Documentation

- [Backend README](backend/README.md) — API, migrations, tests
- [Frontend README](frontend/README.md) — local dev, env vars
- [DEPLOYMENT.md](DEPLOYMENT.md) — Render, Vercel, Neon, Docker Hub

## Development (without Docker)

**Backend:**

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

**Frontend:**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Tests

```bash
cd backend && pytest -v
cd frontend && npm test
```

## License

Proprietary — internal use.
