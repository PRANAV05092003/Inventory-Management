"""Tests for Order management API."""

from uuid import UUID, uuid4

import pytest
from httpx import AsyncClient


async def _create_customer(client: AsyncClient, email_suffix: str = "1") -> dict:
    response = await client.post(
        "/customers",
        json={
            "full_name": "Order Test Customer",
            "email": f"order.customer.{email_suffix}@example.com",
            "phone": "+1-555-1000",
        },
    )
    assert response.status_code == 201
    return response.json()


async def _create_product(
    client: AsyncClient,
    *,
    sku: str,
    price: str,
    quantity: int,
) -> dict:
    response = await client.post(
        "/products",
        json={
            "name": f"Product {sku}",
            "sku": sku,
            "price": price,
            "quantity_in_stock": quantity,
        },
    )
    assert response.status_code == 201
    return response.json()


@pytest.mark.asyncio
async def test_create_order(client: AsyncClient) -> None:
    """POST /orders creates an order with line items."""
    customer = await _create_customer(client, "create")
    product = await _create_product(
        client, sku="ORD-CREATE", price="25.50", quantity=20
    )

    response = await client.post(
        "/orders",
        json={
            "customer_id": customer["id"],
            "items": [{"product_id": product["id"], "quantity": 2}],
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["customer_id"] == customer["id"]
    assert len(data["items"]) == 1
    assert data["items"][0]["quantity"] == 2
    assert UUID(data["id"])


@pytest.mark.asyncio
async def test_get_order(client: AsyncClient) -> None:
    """GET /orders/{id} returns order details."""
    customer = await _create_customer(client, "get")
    product = await _create_product(client, sku="ORD-GET", price="10.00", quantity=5)

    create_response = await client.post(
        "/orders",
        json={
            "customer_id": customer["id"],
            "items": [{"product_id": product["id"], "quantity": 1}],
        },
    )
    order_id = create_response.json()["id"]

    response = await client.get(f"/orders/{order_id}")

    assert response.status_code == 200
    assert response.json()["id"] == order_id


@pytest.mark.asyncio
async def test_delete_order(client: AsyncClient) -> None:
    """DELETE /orders/{id} removes the order without restoring stock."""
    customer = await _create_customer(client, "delete")
    product = await _create_product(
        client, sku="ORD-DEL", price="15.00", quantity=10
    )

    create_response = await client.post(
        "/orders",
        json={
            "customer_id": customer["id"],
            "items": [{"product_id": product["id"], "quantity": 4}],
        },
    )
    order_id = create_response.json()["id"]

    delete_response = await client.delete(f"/orders/{order_id}")
    assert delete_response.status_code == 204

    get_response = await client.get(f"/orders/{order_id}")
    assert get_response.status_code == 404
    assert get_response.json() == {"detail": "Order not found"}

    product_response = await client.get(f"/products/{product['id']}")
    assert product_response.json()["quantity_in_stock"] == 6


@pytest.mark.asyncio
async def test_multiple_order_items(client: AsyncClient) -> None:
    """Order with multiple line items calculates correctly."""
    customer = await _create_customer(client, "multi")
    laptop = await _create_product(
        client, sku="ORD-LAP", price="1000.00", quantity=10
    )
    mouse = await _create_product(
        client, sku="ORD-MOU", price="25.00", quantity=50
    )

    response = await client.post(
        "/orders",
        json={
            "customer_id": customer["id"],
            "items": [
                {"product_id": laptop["id"], "quantity": 2},
                {"product_id": mouse["id"], "quantity": 3},
            ],
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert len(data["items"]) == 2
    assert data["total_amount"] == 2075.0


@pytest.mark.asyncio
async def test_inventory_reduction(client: AsyncClient) -> None:
    """Successful order reduces product stock."""
    customer = await _create_customer(client, "stock")
    product = await _create_product(
        client, sku="ORD-STK", price="10.00", quantity=10
    )

    order_response = await client.post(
        "/orders",
        json={
            "customer_id": customer["id"],
            "items": [{"product_id": product["id"], "quantity": 3}],
        },
    )
    assert order_response.status_code == 201

    product_response = await client.get(f"/products/{product['id']}")
    assert product_response.json()["quantity_in_stock"] == 7


@pytest.mark.asyncio
async def test_insufficient_inventory(client: AsyncClient) -> None:
    """Order exceeding stock returns 400."""
    customer = await _create_customer(client, "insufficient")
    product = await _create_product(
        client, sku="ORD-LOW", price="10.00", quantity=5
    )

    response = await client.post(
        "/orders",
        json={
            "customer_id": customer["id"],
            "items": [{"product_id": product["id"], "quantity": 10}],
        },
    )

    assert response.status_code == 400
    assert response.json() == {"detail": "Insufficient inventory"}

    product_response = await client.get(f"/products/{product['id']}")
    assert product_response.json()["quantity_in_stock"] == 5


@pytest.mark.asyncio
async def test_invalid_customer(client: AsyncClient) -> None:
    """Order with unknown customer returns 404."""
    product = await _create_product(
        client, sku="ORD-NOCUST", price="10.00", quantity=5
    )

    response = await client.post(
        "/orders",
        json={
            "customer_id": str(uuid4()),
            "items": [{"product_id": product["id"], "quantity": 1}],
        },
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "Customer not found"}


@pytest.mark.asyncio
async def test_invalid_product(client: AsyncClient) -> None:
    """Order with unknown product returns 404."""
    customer = await _create_customer(client, "noprod")

    response = await client.post(
        "/orders",
        json={
            "customer_id": customer["id"],
            "items": [{"product_id": str(uuid4()), "quantity": 1}],
        },
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "Product not found"}


@pytest.mark.asyncio
async def test_total_amount_calculation(client: AsyncClient) -> None:
    """total_amount equals sum of line totals (price * quantity)."""
    customer = await _create_customer(client, "total")
    laptop = await _create_product(
        client, sku="ORD-TOTAL", price="1000.00", quantity=10
    )

    response = await client.post(
        "/orders",
        json={
            "customer_id": customer["id"],
            "items": [{"product_id": laptop["id"], "quantity": 2}],
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["total_amount"] == 2000.0
    assert data["items"][0]["unit_price"] == 1000.0
    assert data["items"][0]["line_total"] == 2000.0


@pytest.mark.asyncio
async def test_transaction_rollback(client: AsyncClient) -> None:
    """Failed order does not persist order or reduce inventory."""
    customer = await _create_customer(client, "rollback")
    product = await _create_product(
        client, sku="ORD-RB", price="50.00", quantity=10
    )

    response = await client.post(
        "/orders",
        json={
            "customer_id": customer["id"],
            "items": [
                {"product_id": product["id"], "quantity": 3},
                {"product_id": str(uuid4()), "quantity": 1},
            ],
        },
    )

    assert response.status_code == 404

    list_response = await client.get("/orders")
    assert list_response.json()["total"] == 0

    product_response = await client.get(f"/products/{product['id']}")
    assert product_response.json()["quantity_in_stock"] == 10
