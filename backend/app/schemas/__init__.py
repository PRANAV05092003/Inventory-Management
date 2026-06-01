"""Pydantic schemas package."""

from app.schemas.order import (
    OrderCreate,
    OrderDetailResponse,
    OrderItemCreate,
    OrderItemResponse,
    OrderResponse,
    PaginatedOrderResponse,
)
from app.schemas.customer import (
    CustomerCreate,
    CustomerResponse,
    PaginatedCustomerResponse,
)
from app.schemas.product import (
    PaginatedProductResponse,
    ProductCreate,
    ProductResponse,
    ProductUpdate,
)

__all__ = [
    "OrderCreate",
    "OrderDetailResponse",
    "OrderItemCreate",
    "OrderItemResponse",
    "OrderResponse",
    "PaginatedOrderResponse",
    "CustomerCreate",
    "CustomerResponse",
    "PaginatedCustomerResponse",
    "PaginatedProductResponse",
    "ProductCreate",
    "ProductResponse",
    "ProductUpdate",
]
