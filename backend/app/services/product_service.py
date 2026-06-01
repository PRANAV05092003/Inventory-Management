"""Product business logic service."""

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import DuplicateSKUException, ProductNotFoundException
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:
    """Encapsulates product CRUD operations and business rules."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create_product(self, data: ProductCreate) -> Product:
        """Create a new product with a unique SKU."""
        if self._sku_exists(data.sku):
            raise DuplicateSKUException(sku=data.sku)

        product = Product(
            name=data.name,
            sku=data.sku,
            price=data.price,
            quantity_in_stock=data.quantity_in_stock,
        )
        self.db.add(product)
        try:
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()
            raise DuplicateSKUException(sku=data.sku) from exc
        self.db.refresh(product)
        return product

    def list_products(
        self,
        page: int = 1,
        size: int = 10,
    ) -> tuple[list[Product], int]:
        """Return a paginated list of products and total count."""
        total = self.db.scalar(select(func.count()).select_from(Product)) or 0
        offset = (page - 1) * size
        products = list(
            self.db.scalars(
                select(Product)
                .order_by(Product.created_at.desc())
                .offset(offset)
                .limit(size)
            ).all()
        )
        return products, total

    def get_product(self, product_id: UUID) -> Product:
        """Return a product by ID or raise ProductNotFoundException."""
        product = self.db.get(Product, product_id)
        if product is None:
            raise ProductNotFoundException(product_id=product_id)
        return product

    def update_product(self, product_id: UUID, data: ProductUpdate) -> Product:
        """Update product fields; enforce unique SKU when changed."""
        product = self.get_product(product_id)
        update_data = data.model_dump(exclude_unset=True)

        new_sku = update_data.get("sku")
        if new_sku is not None and self._sku_exists(new_sku, exclude_id=product_id):
            raise DuplicateSKUException(sku=new_sku)

        for field, value in update_data.items():
            setattr(product, field, value)

        try:
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()
            raise DuplicateSKUException(sku=new_sku) from exc
        self.db.refresh(product)
        return product

    def delete_product(self, product_id: UUID) -> None:
        """Delete a product by ID."""
        product = self.get_product(product_id)
        self.db.delete(product)
        self.db.commit()

    def _sku_exists(self, sku: str, exclude_id: UUID | None = None) -> bool:
        """Check whether a SKU is already assigned to another product."""
        stmt = select(Product.id).where(Product.sku == sku)
        if exclude_id is not None:
            stmt = stmt.where(Product.id != exclude_id)
        return self.db.scalar(stmt) is not None
