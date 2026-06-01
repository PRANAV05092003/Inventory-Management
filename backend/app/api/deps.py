"""FastAPI dependencies for API routes."""

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.customer_service import CustomerService
from app.services.order_service import OrderService
from app.services.product_service import ProductService


def get_product_service(db: Session = Depends(get_db)) -> ProductService:
    """Provide a ProductService instance with an injected database session."""
    return ProductService(db)


def get_customer_service(db: Session = Depends(get_db)) -> CustomerService:
    """Provide a CustomerService instance with an injected database session."""
    return CustomerService(db)


def get_order_service(db: Session = Depends(get_db)) -> OrderService:
    """Provide an OrderService instance with an injected database session."""
    return OrderService(db)
