"""Tests for Product management API."""

from uuid import UUID

import pytest
from httpx import AsyncClient

PRODUCT_PAYLOAD = {
    "name": "Wireless Mouse",
    "sku": "wm-001",
    "price": "29.99",
    "quantity_in_stock": 100,
}


@pytest.mark.asyncio
async def test_create_product(client: AsyncClient) -> None:
    """POST /products creates a product and normalizes SKU to uppercase."""
    response = await client.post("/products", json=PRODUCT_PAYLOAD)

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == PRODUCT_PAYLOAD["name"]
    assert data["sku"] == "WM-001"
    assert data["price"] == 29.99
    assert data["quantity_in_stock"] == 100
    assert UUID(data["id"])
    assert "created_at" in data
    assert "updated_at" in data


@pytest.mark.asyncio
async def test_get_product(client: AsyncClient) -> None:
    """GET /products/{id} returns the created product."""
    create_response = await client.post("/products", json=PRODUCT_PAYLOAD)
    product_id = create_response.json()["id"]

    response = await client.get(f"/products/{product_id}")

    assert response.status_code == 200
    assert response.json()["id"] == product_id
    assert response.json()["sku"] == "WM-001"


@pytest.mark.asyncio
async def test_update_product(client: AsyncClient) -> None:
    """PUT /products/{id} updates product fields."""
    create_response = await client.post("/products", json=PRODUCT_PAYLOAD)
    product_id = create_response.json()["id"]

    response = await client.put(
        f"/products/{product_id}",
        json={"name": "Ergonomic Mouse", "quantity_in_stock": 50},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Ergonomic Mouse"
    assert data["quantity_in_stock"] == 50
    assert data["sku"] == "WM-001"


@pytest.mark.asyncio
async def test_delete_product(client: AsyncClient) -> None:
    """DELETE /products/{id} removes the product."""
    create_response = await client.post("/products", json=PRODUCT_PAYLOAD)
    product_id = create_response.json()["id"]

    delete_response = await client.delete(f"/products/{product_id}")
    assert delete_response.status_code == 204

    get_response = await client.get(f"/products/{product_id}")
    assert get_response.status_code == 404
    assert get_response.json() == {"detail": "Product not found"}


@pytest.mark.asyncio
async def test_duplicate_sku_rejection(client: AsyncClient) -> None:
    """POST /products returns 409 when SKU already exists."""
    first = await client.post("/products", json=PRODUCT_PAYLOAD)
    assert first.status_code == 201

    duplicate = await client.post(
        "/products",
        json={
            "name": "Another Mouse",
            "sku": "WM-001",
            "price": "19.99",
            "quantity_in_stock": 10,
        },
    )

    assert duplicate.status_code == 409
    assert duplicate.json() == {"detail": "Product SKU already exists"}


@pytest.mark.asyncio
async def test_invalid_quantity_rejection(client: AsyncClient) -> None:
    """POST /products returns 422 when quantity is negative."""
    response = await client.post(
        "/products",
        json={
            "name": "Invalid Product",
            "sku": "INV-001",
            "price": "10.00",
            "quantity_in_stock": -1,
        },
    )

    assert response.status_code == 422
