"""Pydantic schemas for Order API."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_serializer


class OrderItemCreate(BaseModel):
    """Schema for a line item when creating an order."""

    product_id: UUID = Field(..., description="Product UUID")
    quantity: int = Field(..., gt=0, description="Quantity ordered (must be greater than zero)")


class OrderCreate(BaseModel):
    """Schema for placing a new order."""

    customer_id: UUID = Field(..., description="Customer UUID")
    items: list[OrderItemCreate] = Field(
        ...,
        min_length=1,
        description="One or more order line items",
    )


class OrderItemResponse(BaseModel):
    """Schema for order line item responses."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    order_id: UUID
    product_id: UUID
    quantity: int
    unit_price: Decimal
    line_total: Decimal

    @field_serializer("unit_price", "line_total")
    def serialize_money(self, value: Decimal) -> float:
        return float(value)


class OrderResponse(BaseModel):
    """Summary schema for order list responses."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    customer_id: UUID
    total_amount: Decimal
    created_at: datetime
    updated_at: datetime

    @field_serializer("total_amount")
    def serialize_total(self, value: Decimal) -> float:
        return float(value)


class OrderDetailResponse(OrderResponse):
    """Detailed order schema including line items."""

    items: list[OrderItemResponse]


class PaginatedOrderResponse(BaseModel):
    """Paginated list of orders."""

    items: list[OrderResponse]
    total: int
    page: int
    size: int
