"""Application-specific exception classes."""

from uuid import UUID


class AppException(Exception):
    """Base exception for domain errors."""


class DuplicateSKUException(AppException):
    """Raised when creating or updating a product with a duplicate SKU."""

    def __init__(self, sku: str | None = None) -> None:
        self.sku = sku
        self.message = "Product SKU already exists"
        super().__init__(self.message)


class ProductNotFoundException(AppException):
    """Raised when a product cannot be found by ID."""

    def __init__(self, product_id: UUID | None = None) -> None:
        self.product_id = product_id
        self.message = "Product not found"
        super().__init__(self.message)


class DuplicateCustomerEmailException(AppException):
    """Raised when creating a customer with a duplicate email."""

    def __init__(self, email: str | None = None) -> None:
        self.email = email
        self.message = "Customer email already exists"
        super().__init__(self.message)


class CustomerNotFoundException(AppException):
    """Raised when a customer cannot be found by ID."""

    def __init__(self, customer_id: UUID | None = None) -> None:
        self.customer_id = customer_id
        self.message = "Customer not found"
        super().__init__(self.message)


class InsufficientInventoryException(AppException):
    """Raised when ordered quantity exceeds available stock."""

    def __init__(
        self,
        product_id: UUID | None = None,
        requested: int | None = None,
        available: int | None = None,
    ) -> None:
        self.product_id = product_id
        self.requested = requested
        self.available = available
        self.message = "Insufficient inventory"
        super().__init__(self.message)


class OrderNotFoundException(AppException):
    """Raised when an order cannot be found by ID."""

    def __init__(self, order_id: UUID | None = None) -> None:
        self.order_id = order_id
        self.message = "Order not found"
        super().__init__(self.message)
