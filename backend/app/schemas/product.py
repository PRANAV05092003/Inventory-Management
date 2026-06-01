"""Pydantic schemas for Product API."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_serializer, field_validator


def _normalize_sku(value: str) -> str:
    return value.strip().upper()


class ProductCreate(BaseModel):
    """Schema for creating a new product."""

    name: str = Field(..., min_length=2, description="Product display name")
    sku: str = Field(..., min_length=1, description="Unique stock-keeping unit")
    price: Decimal = Field(..., gt=0, description="Unit price (must be greater than zero)")
    quantity_in_stock: int = Field(
        default=0,
        ge=0,
        description="Available inventory quantity",
    )

    @field_validator("sku", mode="before")
    @classmethod
    def normalize_sku(cls, value: str) -> str:
        if not isinstance(value, str):
            raise TypeError("SKU must be a string")
        return _normalize_sku(value)


class ProductUpdate(BaseModel):
    """Schema for partial product updates."""

    name: str | None = Field(default=None, min_length=2)
    sku: str | None = Field(default=None, min_length=1)
    price: Decimal | None = Field(default=None, gt=0)
    quantity_in_stock: int | None = Field(default=None, ge=0)

    @field_validator("sku", mode="before")
    @classmethod
    def normalize_sku(cls, value: str | None) -> str | None:
        if value is None:
            return None
        if not isinstance(value, str):
            raise TypeError("SKU must be a string")
        return _normalize_sku(value)


class ProductResponse(BaseModel):
    """Schema for product API responses."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    sku: str
    price: Decimal
    quantity_in_stock: int
    created_at: datetime
    updated_at: datetime

    @field_serializer("price")
    def serialize_price(self, value: Decimal) -> float:
        return float(value)


class PaginatedProductResponse(BaseModel):
    """Paginated list of products."""

    items: list[ProductResponse]
    total: int
    page: int
    size: int
