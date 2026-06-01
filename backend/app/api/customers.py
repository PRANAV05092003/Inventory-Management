"""Customer management API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.api.deps import get_customer_service
from app.schemas.customer import (
    CustomerCreate,
    CustomerResponse,
    PaginatedCustomerResponse,
)
from app.services.customer_service import CustomerService

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.post(
    "",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new customer",
    description=(
        "Register a customer with a unique email address. "
        "Email is normalized to lowercase before storage."
    ),
    responses={
        201: {"description": "Customer created successfully"},
        409: {"description": "Customer email already exists"},
        422: {"description": "Validation error"},
    },
)
def create_customer(
    payload: CustomerCreate,
    service: CustomerService = Depends(get_customer_service),
) -> CustomerResponse:
    customer = service.create_customer(payload)
    return CustomerResponse.model_validate(customer)


@router.get(
    "",
    response_model=PaginatedCustomerResponse,
    summary="List all customers",
    description="Retrieve a paginated list of customers ordered by creation date (newest first).",
    responses={
        200: {"description": "Paginated customer list"},
        422: {"description": "Invalid pagination parameters"},
    },
)
def list_customers(
    page: int = Query(1, ge=1, description="Page number (1-based)"),
    size: int = Query(10, ge=1, le=100, description="Number of items per page"),
    service: CustomerService = Depends(get_customer_service),
) -> PaginatedCustomerResponse:
    customers, total = service.list_customers(page=page, size=size)
    return PaginatedCustomerResponse(
        items=[CustomerResponse.model_validate(c) for c in customers],
        total=total,
        page=page,
        size=size,
    )


@router.get(
    "/{customer_id}",
    response_model=CustomerResponse,
    summary="Get customer by ID",
    description="Retrieve a single customer by UUID.",
    responses={
        200: {"description": "Customer found"},
        404: {"description": "Customer not found"},
        422: {"description": "Invalid customer ID format"},
    },
)
def get_customer(
    customer_id: UUID,
    service: CustomerService = Depends(get_customer_service),
) -> CustomerResponse:
    customer = service.get_customer(customer_id)
    return CustomerResponse.model_validate(customer)


@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a customer",
    description="Permanently remove a customer record.",
    responses={
        204: {"description": "Customer deleted successfully"},
        404: {"description": "Customer not found"},
        422: {"description": "Invalid customer ID format"},
    },
)
def delete_customer(
    customer_id: UUID,
    service: CustomerService = Depends(get_customer_service),
) -> None:
    service.delete_customer(customer_id)
