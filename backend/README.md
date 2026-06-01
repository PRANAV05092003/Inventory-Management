# Inventory & Order Management System — Backend (Phase 4)

Production-ready backend for an Inventory & Order Management System built with **FastAPI**, **PostgreSQL**, **SQLAlchemy 2.0**, and **Alembic**.

## Project Overview

**Phase 1** — Foundation (config, database, health checks, Docker, Alembic).

**Phase 2** — Product Management (CRUD, pagination, unique SKU).

**Phase 3** — Customer Management (create, list, get, delete).

**Phase 4** — **Order Management**:

- Orders linked to customers with multiple line items
- Automatic `total_amount` and `line_total` calculation
- Inventory validation before order placement
- Atomic stock reduction in a database transaction
- Order deletion (no inventory restoration)

## Tech Stack

| Component   | Technology        |
|------------|-------------------|
| API        | FastAPI           |
| Server     | Uvicorn           |
| Database   | PostgreSQL 16     |
| ORM        | SQLAlchemy 2.0    |
| Migrations | Alembic           |
| Config     | Pydantic Settings |
| Runtime    | Python 3.12       |

## Folder Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── deps.py
│   │   ├── customers.py
│   │   ├── health.py
│   │   ├── orders.py
│   │   └── products.py
│   ├── core/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── exceptions.py
│   │   └── exception_handlers.py
│   ├── models/
│   │   ├── customer.py
│   │   ├── order.py
│   │   └── product.py
│   ├── schemas/
│   │   ├── customer.py
│   │   ├── order.py
│   │   └── product.py
│   ├── services/
│   │   ├── customer_service.py
│   │   ├── order_service.py
│   │   └── product_service.py
│   └── main.py
├── alembic/
├── alembic.ini
├── requirements.txt
├── Dockerfile
├── .dockerignore
├── .env.example
└── README.md
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- (Optional) Python 3.12 for local development without Docker

## Environment Configuration

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update values in `.env` — **never commit real credentials**.

### Required Variables

| Variable           | Description                          |
|--------------------|--------------------------------------|
| `DATABASE_URL`     | Full PostgreSQL connection URL       |
| `POSTGRES_DB`      | Database name                        |
| `POSTGRES_USER`    | Database user                        |
| `POSTGRES_PASSWORD`| Database password                    |
| `POSTGRES_HOST`    | Host (`postgres` in Docker, `localhost` locally) |
| `POSTGRES_PORT`    | Port (default `5432`)                |

## Docker Instructions

From the **project root** (parent of `backend/`):

```bash
docker compose up --build
```

Services:

| Service   | URL / Port              |
|-----------|-------------------------|
| API       | http://localhost:8000 |
| Swagger   | http://localhost:8000/docs |
| ReDoc     | http://localhost:8000/redoc |
| PostgreSQL| localhost:5432          |

Stop containers:

```bash
docker compose down
```

Remove volumes (resets database):

```bash
docker compose down -v
```

## Local Development (Without Docker)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Set POSTGRES_HOST=localhost and start PostgreSQL locally
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Migration Commands

Run inside the `backend` directory (or via Docker exec):

```bash
# Apply all migrations
alembic upgrade head

# Create a new migration (after adding models)
alembic revision --autogenerate -m "description"

# Roll back one revision
alembic downgrade -1

# Show current revision
alembic current
```

Docker exec example:

```bash
docker compose exec backend alembic upgrade head
```

Migrations run automatically on container startup via `docker-entrypoint.sh`.

## API Endpoints

### Health

| Method | Path      | Description                    |
|--------|-----------|--------------------------------|
| GET    | `/`       | API running confirmation       |
| GET    | `/health` | Health + database connectivity |
| GET    | `/docs`   | Swagger UI                     |
| GET    | `/redoc`  | ReDoc documentation            |

### Products (Phase 2)

| Method | Path                 | Description              |
|--------|----------------------|--------------------------|
| POST   | `/products`          | Create product           |
| GET    | `/products`          | List products (paginated)|
| GET    | `/products/{id}`     | Get product by UUID      |
| PUT    | `/products/{id}`     | Update product           |
| DELETE | `/products/{id}`     | Delete product           |

### Product API Examples

**Create product**

```bash
curl -X POST "http://localhost:8000/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Mouse",
    "sku": "wm-001",
    "price": 29.99,
    "quantity_in_stock": 100
  }'
```

**List products (paginated)**

```bash
curl "http://localhost:8000/products?page=1&size=10"
```

**Get product by ID**

```bash
curl "http://localhost:8000/products/{product_id}"
```

**Update product**

```bash
curl -X PUT "http://localhost:8000/products/{product_id}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ergonomic Mouse",
    "quantity_in_stock": 50
  }'
```

**Delete product**

```bash
curl -X DELETE "http://localhost:8000/products/{product_id}"
```

### Example Responses

**GET /**

```json
{
  "message": "Inventory Management API Running"
}
```

**GET /health**

```json
{
  "status": "healthy",
  "database": "connected"
}
```

**GET /products?page=1&size=10**

```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Wireless Mouse",
      "sku": "WM-001",
      "price": 29.99,
      "quantity_in_stock": 100,
      "created_at": "2026-06-01T12:00:00Z",
      "updated_at": "2026-06-01T12:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "size": 10
}
```

**409 Conflict (duplicate SKU)**

```json
{
  "detail": "Product SKU already exists"
}
```

**404 Not Found**

```json
{
  "detail": "Product not found"
}
```

### Customers (Phase 3)

| Method | Path                  | Description               |
|--------|-----------------------|---------------------------|
| POST   | `/customers`          | Create customer           |
| GET    | `/customers`          | List customers (paginated)|
| GET    | `/customers/{id}`   | Get customer by UUID      |
| DELETE | `/customers/{id}`     | Delete customer           |

### Customer API Examples

**Create customer**

```bash
curl -X POST "http://localhost:8000/customers" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "+1-555-0100"
  }'
```

**List customers (paginated)**

```bash
curl "http://localhost:8000/customers?page=1&size=10"
```

**Get customer by ID**

```bash
curl "http://localhost:8000/customers/{customer_id}"
```

**Delete customer**

```bash
curl -X DELETE "http://localhost:8000/customers/{customer_id}"
```

**GET /customers?page=1&size=10**

```json
{
  "items": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "full_name": "Jane Doe",
      "email": "jane.doe@example.com",
      "phone": "+1-555-0100",
      "created_at": "2026-06-01T12:00:00Z",
      "updated_at": "2026-06-01T12:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "size": 10
}
```

**409 Conflict (duplicate email)**

```json
{
  "detail": "Customer email already exists"
}
```

**404 Not Found (customer)**

```json
{
  "detail": "Customer not found"
}
```

### Orders (Phase 4)

| Method | Path            | Description                          |
|--------|-----------------|--------------------------------------|
| POST   | `/orders`       | Create order (validates & deducts stock) |
| GET    | `/orders`       | List orders (paginated)              |
| GET    | `/orders/{id}`  | Get order with line items            |
| DELETE | `/orders/{id}`  | Delete order (stock not restored)    |

### Order API Examples

**Create order**

```bash
curl -X POST "http://localhost:8000/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "{customer_id}",
    "items": [
      { "product_id": "{product_id}", "quantity": 2 }
    ]
  }'
```

**List orders (paginated)**

```bash
curl "http://localhost:8000/orders?page=1&size=10"
```

**Get order by ID**

```bash
curl "http://localhost:8000/orders/{order_id}"
```

**Delete order**

```bash
curl -X DELETE "http://localhost:8000/orders/{order_id}"
```

### Inventory behavior

| Scenario | Result |
|----------|--------|
| Stock = 10, order qty = 3 | Stock becomes **7** after successful order |
| Stock = 5, order qty = 10 | **400** `{"detail": "Insufficient inventory"}` |
| Order fails mid-creation | **Rollback** — no order, no stock change |
| Delete order | Order removed; **stock unchanged** |

**POST /orders — success response (example)**

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "customer_id": "660e8400-e29b-41d4-a716-446655440001",
  "total_amount": 2000.0,
  "created_at": "2026-06-01T14:00:00Z",
  "updated_at": "2026-06-01T14:00:00Z",
  "items": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "order_id": "770e8400-e29b-41d4-a716-446655440002",
      "product_id": "550e8400-e29b-41d4-a716-446655440000",
      "quantity": 2,
      "unit_price": 1000.0,
      "line_total": 2000.0
    }
  ]
}
```

**400 Insufficient inventory**

```json
{
  "detail": "Insufficient inventory"
}
```

**404 Order not found**

```json
{
  "detail": "Order not found"
}
```

### Swagger Screenshots

<!-- Add screenshots of /docs Product, Customer, and Order endpoints here after running the API -->

## Architecture Notes

- **`app/core/config.py`** — Centralized Pydantic Settings
- **`app/core/database.py`** — Engine, sessions, `get_db` dependency
- **`app/api/`** — Route modules (`health`, `products`, `customers`, `orders`)
- **`app/models/`** — SQLAlchemy models (`Product`, `Customer`, `Order`, `OrderItem`)
- **`app/schemas/`** — Pydantic request/response schemas
- **`app/services/`** — Business logic (`ProductService`, `CustomerService`, `OrderService`)
- **`app/core/exceptions.py`** — Domain exceptions
- **`app/core/exception_handlers.py`** — Global HTTP error mapping

## Running Tests

```bash
cd backend
pip install -r requirements.txt
pytest -v
```

Tests use an in-memory SQLite database with dependency overrides (no Docker required for pytest).

## License

Proprietary — internal use.
