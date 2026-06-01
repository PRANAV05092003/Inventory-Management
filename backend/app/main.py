"""FastAPI application entry point."""

from fastapi import FastAPI

from app.api.health import router as health_router
from app.api.customers import router as customers_router
from app.api.orders import router as orders_router
from app.api.products import router as products_router
from app.core.config import get_settings
from app.core.cors import configure_cors
from app.core.exception_handlers import register_exception_handlers

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Production-ready Inventory & Order Management System API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

configure_cors(app, settings)
register_exception_handlers(app)

app.include_router(health_router)
app.include_router(products_router)
app.include_router(customers_router)
app.include_router(orders_router)
