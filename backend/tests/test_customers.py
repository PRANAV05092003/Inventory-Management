"""Tests for Customer management API."""

from uuid import UUID

import pytest
from httpx import AsyncClient

CUSTOMER_PAYLOAD = {
    "full_name": "Jane Doe",
    "email": "Jane.Doe@Example.COM",
    "phone": "+1-555-0100",
}


@pytest.mark.asyncio
async def test_create_customer(client: AsyncClient) -> None:
    """POST /customers creates a customer and normalizes email to lowercase."""
    response = await client.post("/customers", json=CUSTOMER_PAYLOAD)

    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == CUSTOMER_PAYLOAD["full_name"]
    assert data["email"] == "jane.doe@example.com"
    assert data["phone"] == CUSTOMER_PAYLOAD["phone"]
    assert UUID(data["id"])
    assert "created_at" in data
    assert "updated_at" in data


@pytest.mark.asyncio
async def test_get_customer(client: AsyncClient) -> None:
    """GET /customers/{id} returns the created customer."""
    create_response = await client.post("/customers", json=CUSTOMER_PAYLOAD)
    customer_id = create_response.json()["id"]

    response = await client.get(f"/customers/{customer_id}")

    assert response.status_code == 200
    assert response.json()["id"] == customer_id
    assert response.json()["email"] == "jane.doe@example.com"


@pytest.mark.asyncio
async def test_delete_customer(client: AsyncClient) -> None:
    """DELETE /customers/{id} removes the customer."""
    create_response = await client.post("/customers", json=CUSTOMER_PAYLOAD)
    customer_id = create_response.json()["id"]

    delete_response = await client.delete(f"/customers/{customer_id}")
    assert delete_response.status_code == 204

    get_response = await client.get(f"/customers/{customer_id}")
    assert get_response.status_code == 404
    assert get_response.json() == {"detail": "Customer not found"}


@pytest.mark.asyncio
async def test_duplicate_email_rejection(client: AsyncClient) -> None:
    """POST /customers returns 409 when email already exists."""
    first = await client.post("/customers", json=CUSTOMER_PAYLOAD)
    assert first.status_code == 201

    duplicate = await client.post(
        "/customers",
        json={
            "full_name": "John Smith",
            "email": "jane.doe@example.com",
            "phone": "+1-555-0199",
        },
    )

    assert duplicate.status_code == 409
    assert duplicate.json() == {"detail": "Customer email already exists"}


@pytest.mark.asyncio
async def test_invalid_email_validation(client: AsyncClient) -> None:
    """POST /customers returns 422 for invalid email format."""
    response = await client.post(
        "/customers",
        json={
            "full_name": "Invalid Email User",
            "email": "not-an-email",
            "phone": "+1-555-0200",
        },
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_pagination(client: AsyncClient) -> None:
    """GET /customers returns paginated results."""
    for index in range(3):
        await client.post(
            "/customers",
            json={
                "full_name": f"Customer {index}",
                "email": f"customer{index}@example.com",
                "phone": "+1-555-0300",
            },
        )

    response = await client.get("/customers?page=1&size=2")

    assert response.status_code == 200
    data = response.json()
    assert data["page"] == 1
    assert data["size"] == 2
    assert data["total"] == 3
    assert len(data["items"]) == 2
