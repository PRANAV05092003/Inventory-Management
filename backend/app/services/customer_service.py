"""Customer business logic service."""

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import (
    CustomerNotFoundException,
    DuplicateCustomerEmailException,
)
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate


class CustomerService:
    """Encapsulates customer CRUD operations and business rules."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create_customer(self, data: CustomerCreate) -> Customer:
        """Create a new customer with a unique email."""
        if self._email_exists(data.email):
            raise DuplicateCustomerEmailException(email=data.email)

        customer = Customer(
            full_name=data.full_name,
            email=data.email,
            phone=data.phone,
        )
        self.db.add(customer)
        try:
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()
            raise DuplicateCustomerEmailException(email=data.email) from exc
        self.db.refresh(customer)
        return customer

    def list_customers(
        self,
        page: int = 1,
        size: int = 10,
    ) -> tuple[list[Customer], int]:
        """Return a paginated list of customers and total count."""
        total = self.db.scalar(select(func.count()).select_from(Customer)) or 0
        offset = (page - 1) * size
        customers = list(
            self.db.scalars(
                select(Customer)
                .order_by(Customer.created_at.desc())
                .offset(offset)
                .limit(size)
            ).all()
        )
        return customers, total

    def get_customer(self, customer_id: UUID) -> Customer:
        """Return a customer by ID or raise CustomerNotFoundException."""
        customer = self.db.get(Customer, customer_id)
        if customer is None:
            raise CustomerNotFoundException(customer_id=customer_id)
        return customer

    def delete_customer(self, customer_id: UUID) -> None:
        """Delete a customer by ID."""
        customer = self.get_customer(customer_id)
        self.db.delete(customer)
        self.db.commit()

    def _email_exists(self, email: str, exclude_id: UUID | None = None) -> bool:
        """Check whether an email is already assigned to another customer."""
        stmt = select(Customer.id).where(Customer.email == email)
        if exclude_id is not None:
            stmt = stmt.where(Customer.id != exclude_id)
        return self.db.scalar(stmt) is not None
