"""Pydantic schemas for Customer API."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


def _normalize_email(value: str) -> str:
    return value.strip().lower()


class CustomerCreate(BaseModel):
    """Schema for creating a new customer."""

    full_name: str = Field(..., min_length=2, description="Customer full name")
    email: EmailStr = Field(..., description="Unique customer email address")
    phone: str = Field(
        ...,
        min_length=7,
        max_length=50,
        description="Contact phone number (minimum 7 characters)",
    )

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        if not isinstance(value, str):
            raise TypeError("Email must be a string")
        return _normalize_email(value)

    @field_validator("phone", mode="before")
    @classmethod
    def normalize_phone(cls, value: str) -> str:
        if not isinstance(value, str):
            raise TypeError("Phone must be a string")
        return value.strip()


class CustomerResponse(BaseModel):
    """Schema for customer API responses."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    full_name: str
    email: str
    phone: str
    created_at: datetime
    updated_at: datetime


class PaginatedCustomerResponse(BaseModel):
    """Paginated list of customers."""

    items: list[CustomerResponse]
    total: int
    page: int
    size: int
