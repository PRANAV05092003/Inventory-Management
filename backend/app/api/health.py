"""Health check and root API endpoints."""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.core.database import check_database_connection

router = APIRouter(tags=["Health"])


class RootResponse(BaseModel):
    message: str


class HealthResponse(BaseModel):
    status: str
    database: str


@router.get("/", response_model=RootResponse)
def read_root() -> RootResponse:
    """Root endpoint confirming the API is running."""
    return RootResponse(message="Inventory Management API Running")


@router.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    """Health check with database connectivity verification."""
    if not check_database_connection():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "unhealthy",
                "database": "disconnected",
            },
        )
    return HealthResponse(status="healthy", database="connected")
