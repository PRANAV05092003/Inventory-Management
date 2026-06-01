"""Shared pytest fixtures."""

import os
from collections.abc import Generator

# Set required env vars before application modules load settings.
os.environ.setdefault("POSTGRES_DB", "test_db")
os.environ.setdefault("POSTGRES_USER", "test_user")
os.environ.setdefault("POSTGRES_PASSWORD", "test_pass")
os.environ.setdefault("POSTGRES_HOST", "localhost")
os.environ.setdefault("POSTGRES_PORT", "5432")
os.environ.setdefault(
    "DATABASE_URL",
    "postgresql://test_user:test_pass@localhost:5432/test_db",
)

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import get_settings
from app.core.database import Base, get_db
from app.main import app
from app.models.customer import Customer  # noqa: F401 — register metadata
from app.models.order import Order, OrderItem  # noqa: F401 — register metadata
from app.models.product import Product  # noqa: F401 — register metadata

get_settings.cache_clear()

TEST_DATABASE_URL = "sqlite://"


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    """In-memory SQLite session for isolated API tests."""
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    session_factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = session_factory()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
async def client(db_session: Session) -> AsyncClient:
    """Async HTTP client with database dependency overridden."""

    def override_get_db() -> Generator[Session, None, None]:
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()
