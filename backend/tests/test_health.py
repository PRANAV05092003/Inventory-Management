"""Tests for health check endpoints."""

from unittest.mock import patch

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_root(client: AsyncClient) -> None:
    """GET / returns API running message."""
    response = await client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "Inventory Management API Running"}


@pytest.mark.asyncio
@patch("app.api.health.check_database_connection", return_value=True)
async def test_get_health_connected(
    _mock_db_check: object,
    client: AsyncClient,
) -> None:
    """GET /health returns healthy when database is reachable."""
    response = await client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "database": "connected"}


@pytest.mark.asyncio
@patch("app.api.health.check_database_connection", return_value=False)
async def test_get_health_disconnected(
    _mock_db_check: object,
    client: AsyncClient,
) -> None:
    """GET /health returns 503 when database is unreachable."""
    response = await client.get("/health")

    assert response.status_code == 503
    assert response.json() == {
        "detail": {"status": "unhealthy", "database": "disconnected"}
    }
