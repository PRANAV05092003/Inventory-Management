"""Product management API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.api.deps import get_product_service
from app.schemas.product import (
    PaginatedProductResponse,
    ProductCreate,
    ProductResponse,
    ProductUpdate,
)
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Products"])


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new product",
    description=(
        "Create a product with a unique SKU. "
        "Price must be greater than zero and quantity cannot be negative."
    ),
    responses={
        201: {"description": "Product created successfully"},
        409: {"description": "Product SKU already exists"},
        422: {"description": "Validation error"},
    },
)
def create_product(
    payload: ProductCreate,
    service: ProductService = Depends(get_product_service),
) -> ProductResponse:
    product = service.create_product(payload)
    return ProductResponse.model_validate(product)


@router.get(
    "",
    response_model=PaginatedProductResponse,
    summary="List all products",
    description="Retrieve a paginated list of products ordered by creation date (newest first).",
    responses={
        200: {"description": "Paginated product list"},
        422: {"description": "Invalid pagination parameters"},
    },
)
def list_products(
    page: int = Query(1, ge=1, description="Page number (1-based)"),
    size: int = Query(10, ge=1, le=100, description="Number of items per page"),
    service: ProductService = Depends(get_product_service),
) -> PaginatedProductResponse:
    products, total = service.list_products(page=page, size=size)
    return PaginatedProductResponse(
        items=[ProductResponse.model_validate(p) for p in products],
        total=total,
        page=page,
        size=size,
    )


@router.get(
    "/{product_id}",
    response_model=ProductResponse,
    summary="Get product by ID",
    description="Retrieve a single product by its UUID.",
    responses={
        200: {"description": "Product found"},
        404: {"description": "Product not found"},
        422: {"description": "Invalid product ID format"},
    },
)
def get_product(
    product_id: UUID,
    service: ProductService = Depends(get_product_service),
) -> ProductResponse:
    product = service.get_product(product_id)
    return ProductResponse.model_validate(product)


@router.put(
    "/{product_id}",
    response_model=ProductResponse,
    summary="Update a product",
    description=(
        "Update one or more product fields. "
        "SKU must remain unique across all products."
    ),
    responses={
        200: {"description": "Product updated successfully"},
        404: {"description": "Product not found"},
        409: {"description": "Product SKU already exists"},
        422: {"description": "Validation error"},
    },
)
def update_product(
    product_id: UUID,
    payload: ProductUpdate,
    service: ProductService = Depends(get_product_service),
) -> ProductResponse:
    product = service.update_product(product_id, payload)
    return ProductResponse.model_validate(product)


@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a product",
    description="Permanently remove a product from inventory.",
    responses={
        204: {"description": "Product deleted successfully"},
        404: {"description": "Product not found"},
        422: {"description": "Invalid product ID format"},
    },
)
def delete_product(
    product_id: UUID,
    service: ProductService = Depends(get_product_service),
) -> None:
    service.delete_product(product_id)
