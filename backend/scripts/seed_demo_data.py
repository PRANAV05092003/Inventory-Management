#!/usr/bin/env python3
"""
Seed realistic demo data for dashboard review.

Usage (from backend directory):
    python scripts/seed_demo_data.py

Skips rows that already exist (duplicate SKU/email).
"""

from __future__ import annotations

import random
import sys
from decimal import Decimal
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

from app.core.database import SessionLocal  # noqa: E402
from app.schemas.customer import CustomerCreate  # noqa: E402
from app.schemas.order import OrderCreate, OrderItemCreate  # noqa: E402
from app.schemas.product import ProductCreate  # noqa: E402
from app.services.customer_service import CustomerService  # noqa: E402
from app.services.order_service import OrderService  # noqa: E402
from app.services.product_service import ProductService  # noqa: E402

PRODUCT_COUNT = 50
CUSTOMER_COUNT = 20
ORDER_COUNT = 100

CATEGORIES = [
    ("Economy", Decimal("24.99"), 80),
    ("Standard", Decimal("89.50"), 45),
    ("Premium", Decimal("249.00"), 12),
]


def seed_products(db) -> list:
    service = ProductService(db)
    created = []
    for i in range(PRODUCT_COUNT):
        tier = CATEGORIES[i % len(CATEGORIES)]
        sku = f"SEED-{i+1:04d}"
        try:
            product = service.create_product(
                ProductCreate(
                    name=f"{tier[0]} Item {i + 1}",
                    sku=sku,
                    price=tier[1] + Decimal(i % 5),
                    quantity_in_stock=random.choice([4, 8, 18, 35, 60, 120]),
                )
            )
            created.append(product)
        except Exception:
            db.rollback()
    return created


def seed_customers(db) -> list:
    service = CustomerService(db)
    created = []
    for i in range(CUSTOMER_COUNT):
        try:
            customer = service.create_customer(
                CustomerCreate(
                    full_name=f"Seed Customer {i + 1}",
                    email=f"seed.customer{i + 1}@demo.inventra.io",
                    phone=f"+1-555-{1000 + i:04d}",
                )
            )
            created.append(customer)
        except Exception:
            db.rollback()
    return created


def seed_orders(db, products, customers) -> int:
    if not products or not customers:
        return 0
    service = OrderService(db)
    count = 0
    for i in range(ORDER_COUNT):
        customer = customers[i % len(customers)]
        product = products[i % len(products)]
        qty = 1 + (i % 4)
        try:
            service.create_order(
                OrderCreate(
                    customer_id=customer.id,
                    items=[OrderItemCreate(product_id=product.id, quantity=qty)],
                )
            )
            count += 1
        except Exception:
            db.rollback()
    return count


def main() -> None:
    db = SessionLocal()
    try:
        products = seed_products(db)
        customers = seed_customers(db)
        orders = seed_orders(db, products, customers)
        print(f"Seeded: {len(products)} products, {len(customers)} customers, {orders} orders")
    finally:
        db.close()


if __name__ == "__main__":
    main()
