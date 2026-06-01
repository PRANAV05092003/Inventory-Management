"""Order management API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.api.deps import get_order_service
from app.schemas.order import (
    OrderCreate,
    OrderDetailResponse,
    OrderResponse,
    PaginatedOrderResponse,
)
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post(
    "",
    response_model=OrderDetailResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new order",
    description=(
        "Place an order for a customer with one or more products. "
        "Validates customer and products, checks inventory, calculates totals, "
        "and reduces stock atomically in a single transaction."
    ),
    responses={
        201: {"description": "Order created successfully"},
        400: {"description": "Insufficient inventory"},
        404: {"description": "Customer or product not found"},
        422: {"description": "Validation error"},
    },
)
def create_order(
    payload: OrderCreate,
    service: OrderService = Depends(get_order_service),
) -> OrderDetailResponse:
    order = service.create_order(payload)
    return OrderDetailResponse.model_validate(order)


@router.get(
    "",
    response_model=PaginatedOrderResponse,
    summary="List all orders",
    description="Retrieve a paginated list of orders ordered by creation date (newest first).",
    responses={
        200: {"description": "Paginated order list"},
        422: {"description": "Invalid pagination parameters"},
    },
)
def list_orders(
    page: int = Query(1, ge=1, description="Page number (1-based)"),
    size: int = Query(10, ge=1, le=100, description="Number of items per page"),
    service: OrderService = Depends(get_order_service),
) -> PaginatedOrderResponse:
    orders, total = service.list_orders(page=page, size=size)
    return PaginatedOrderResponse(
        items=[OrderResponse.model_validate(o) for o in orders],
        total=total,
        page=page,
        size=size,
    )


@router.get(
    "/{order_id}",
    response_model=OrderDetailResponse,
    summary="Get order by ID",
    description="Retrieve a single order with all line items.",
    responses={
        200: {"description": "Order found"},
        404: {"description": "Order not found"},
        422: {"description": "Invalid order ID format"},
    },
)
def get_order(
    order_id: UUID,
    service: OrderService = Depends(get_order_service),
) -> OrderDetailResponse:
    order = service.get_order(order_id)
    return OrderDetailResponse.model_validate(order)


@router.delete(
    "/{order_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an order",
    description=(
        "Permanently delete an order and its line items. "
        "Inventory is not restored."
    ),
    responses={
        204: {"description": "Order deleted successfully"},
        404: {"description": "Order not found"},
        422: {"description": "Invalid order ID format"},
    },
)
def delete_order(
    order_id: UUID,
    service: OrderService = Depends(get_order_service),
) -> None:
    service.delete_order(order_id)
