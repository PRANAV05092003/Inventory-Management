# Deployment Guide (Phase 6)

Production deployment for the Inventory & Order Management System.

| Target | Component | Notes |
|--------|-----------|--------|
| Docker Compose | Full stack (postgres + backend + frontend) | Local / VPS |
| Render | Backend API (Docker) | `render.yaml` blueprint |
| Neon | PostgreSQL | Serverless Postgres |
| Vercel | React frontend | Static SPA |
| Docker Hub | Container images | CI/CD or manual push |

---

## Prerequisites

- Docker Desktop (Compose + Hub)
- [Render](https://render.com) account
- [Neon](https://neon.tech) account
- [Vercel](https://vercel.com) account
- [Docker Hub](https://hub.docker.com) account

---

## 1. Docker Compose (Production Stack)

### Setup

```bash
# From project root
cp .env.example .env
cp backend/.env.example backend/.env
# Edit passwords in .env and backend/.env

docker compose --progress plain build
docker compose up -d
```

### Verify

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger | http://localhost:8000/docs |
| Health | http://localhost:8000/health |

```bash
docker compose ps
docker compose logs backend --tail 50
```

Migrations run automatically via `docker-entrypoint.sh` (`alembic upgrade head`).

### Stop / reset

```bash
docker compose down
docker compose down -v   # removes postgres volume
```

---

## 2. Neon PostgreSQL

1. Sign in at [https://neon.tech](https://neon.tech)
2. **New Project** → choose region
3. Copy the **connection string** (Pooled or Direct)
4. Ensure SSL is enabled — append if missing:

   ```
   ?sslmode=require
   ```

Example:

```
postgresql://neondb_owner:YOUR_PASSWORD@ep-cool-name-12345678.us-east-2.aws.neon.tech/neondb?sslmode=require
```

5. Set as `DATABASE_URL` on Render (backend service).

Neon does **not** run inside Docker Compose by default; use Compose `postgres` service locally and Neon in cloud.

---

## 3. Deploy Backend to Render

### Option A — Blueprint (`render.yaml`)

1. Push repo to GitHub
2. Render Dashboard → **New** → **Blueprint**
3. Connect repository; Render reads `render.yaml`
4. Set secret env vars when prompted:
   - `DATABASE_URL` (Neon connection string)
   - `CORS_ORIGINS` (include your Vercel URL)

### Option B — Manual Docker Web Service

1. **New** → **Web Service** → connect GitHub repo
2. **Runtime:** Docker
3. **Dockerfile path:** `backend/Dockerfile`
4. **Docker build context:** `backend`
5. **Health check path:** `/health`
6. **Environment variables:**

| Key | Value |
|-----|--------|
| `DATABASE_URL` | Neon connection string |
| `CORS_ORIGINS` | `https://your-app.vercel.app,http://localhost:5173` |
| `DEBUG` | `false` |
| `WEB_CONCURRENCY` | `2` |
| `POSTGRES_DB` | *(required by Settings — use Neon DB name)* |
| `POSTGRES_USER` | *(Neon user)* |
| `POSTGRES_PASSWORD` | *(Neon password)* |
| `POSTGRES_HOST` | *(Neon host)* |

> `Settings` requires `POSTGRES_*` fields even when `DATABASE_URL` is set. Use values from your Neon connection string.

7. Deploy → note public URL: `https://inventory-api-xxxx.onrender.com`

### Verify Render backend

```bash
curl https://YOUR-SERVICE.onrender.com/health
```

---

## 4. Deploy Frontend to Vercel

1. Push repo to GitHub
2. [Vercel Dashboard](https://vercel.com) → **Add New Project**
3. Import repository
4. **Framework Preset:** Vite
5. **Root Directory:** `frontend`
6. **Build Command:** `npm run build`
7. **Output Directory:** `dist`
8. **Environment Variables:**

| Name | Value |
|------|--------|
| `VITE_API_URL` | `https://YOUR-SERVICE.onrender.com` |

9. Deploy → note URL: `https://your-app.vercel.app`

### Update backend CORS

On Render, set `CORS_ORIGINS` to include the Vercel URL:

```
https://your-app.vercel.app,http://localhost:5173,http://localhost:3000
```

Redeploy backend after changing CORS.

---

## 5. Connect Frontend to Backend

| Environment | Frontend config | Backend CORS |
|-------------|-----------------|--------------|
| Vite dev | `VITE_API_URL` empty (proxy) or `http://localhost:8000` | `http://localhost:5173` |
| Docker Compose | `VITE_API_URL` empty; nginx proxies | `http://localhost:3000` |
| Vercel + Render | `VITE_API_URL=https://api.onrender.com` | `https://your-app.vercel.app` |

Test from browser console (Vercel site):

```javascript
fetch('https://YOUR-SERVICE.onrender.com/health').then(r => r.json()).then(console.log)
```

---

## 6. Push Images to Docker Hub

Replace `YOUR_DOCKERHUB_USER` with your username.

### Login

```bash
docker login
```

### Build and tag

```bash
# From project root
export DOCKERHUB_USER=YOUR_DOCKERHUB_USER
export TAG=1.0.0

docker build -t $DOCKERHUB_USER/inventory-backend:$TAG ./backend
docker build -t $DOCKERHUB_USER/inventory-frontend:$TAG \
  --build-arg VITE_API_URL= \
  ./frontend

docker tag $DOCKERHUB_USER/inventory-backend:$TAG $DOCKERHUB_USER/inventory-backend:latest
docker tag $DOCKERHUB_USER/inventory-frontend:$TAG $DOCKERHUB_USER/inventory-frontend:latest
```

### Push

```bash
docker push $DOCKERHUB_USER/inventory-backend:$TAG
docker push $DOCKERHUB_USER/inventory-backend:latest
docker push $DOCKERHUB_USER/inventory-frontend:$TAG
docker push $DOCKERHUB_USER/inventory-frontend:latest
```

### Pull and run (VPS example)

```bash
docker pull YOUR_DOCKERHUB_USER/inventory-backend:latest
docker pull YOUR_DOCKERHUB_USER/inventory-frontend:latest
# Use docker-compose.yml with image: instead of build:
```

Set in `.env`:

```
DOCKERHUB_USERNAME=YOUR_DOCKERHUB_USER
IMAGE_TAG=latest
```

---

## Environment Variable Reference

### Backend

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes* | PostgreSQL URL (*or `POSTGRES_*` set) |
| `POSTGRES_DB` | Yes | Database name |
| `POSTGRES_USER` | Yes | Database user |
| `POSTGRES_PASSWORD` | Yes | Database password |
| `POSTGRES_HOST` | Yes | Host |
| `POSTGRES_PORT` | No | Default `5432` |
| `CORS_ORIGINS` | No | Comma-separated origins |
| `DEBUG` | No | `false` in production |
| `WEB_CONCURRENCY` | No | Uvicorn workers (default `2`) |
| `APP_NAME` | No | API title |
| `APP_VERSION` | No | API version |

### Frontend (build-time)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend URL; empty = same-origin proxy |

---

## GitHub Actions CI

Workflow: `.github/workflows/ci.yml`

- **backend:** Python 3.12, `pytest`
- **frontend:** Node 20, `npm test`, `npm run build`

Runs on push/PR to `main`, `master`, `develop`.

---

## Screenshots

<!-- Add production screenshots: Docker Compose, Render dashboard, Vercel deployment, Neon console -->

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS blocked | Add frontend URL to `CORS_ORIGINS` on backend |
| Render DB connection failed | Use Neon URL with `?sslmode=require` |
| Migrations failed on startup | Check `DATABASE_URL` and Render logs |
| Frontend 502 in Compose | Wait for backend healthcheck; `docker compose logs backend` |
| Vercel shows empty API | Set `VITE_API_URL` and redeploy |

---

## License

Proprietary — internal use.
