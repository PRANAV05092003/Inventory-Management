"""Global FastAPI exception handlers."""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.exceptions import (
    AppException,
    CustomerNotFoundException,
    DuplicateCustomerEmailException,
    DuplicateSKUException,
    InsufficientInventoryException,
    OrderNotFoundException,
    ProductNotFoundException,
)


def register_exception_handlers(app: FastAPI) -> None:
    """Register reusable exception handlers on the FastAPI application."""

    @app.exception_handler(DuplicateSKUException)
    async def duplicate_sku_handler(
        _request: Request,
        exc: DuplicateSKUException,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=409,
            content={"detail": exc.message},
        )

    @app.exception_handler(ProductNotFoundException)
    async def product_not_found_handler(
        _request: Request,
        exc: ProductNotFoundException,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=404,
            content={"detail": exc.message},
        )

    @app.exception_handler(DuplicateCustomerEmailException)
    async def duplicate_customer_email_handler(
        _request: Request,
        exc: DuplicateCustomerEmailException,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=409,
            content={"detail": exc.message},
        )

    @app.exception_handler(CustomerNotFoundException)
    async def customer_not_found_handler(
        _request: Request,
        exc: CustomerNotFoundException,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=404,
            content={"detail": exc.message},
        )

    @app.exception_handler(InsufficientInventoryException)
    async def insufficient_inventory_handler(
        _request: Request,
        exc: InsufficientInventoryException,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=400,
            content={"detail": exc.message},
        )

    @app.exception_handler(OrderNotFoundException)
    async def order_not_found_handler(
        _request: Request,
        exc: OrderNotFoundException,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=404,
            content={"detail": exc.message},
        )

    @app.exception_handler(AppException)
    async def app_exception_handler(
        _request: Request,
        exc: AppException,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=400,
            content={"detail": str(exc)},
        )
