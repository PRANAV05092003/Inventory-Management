"""Order business logic service."""

from collections import defaultdict
from decimal import Decimal
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.core.exceptions import (
    CustomerNotFoundException,
    InsufficientInventoryException,
    OrderNotFoundException,
    ProductNotFoundException,
)
from app.models.customer import Customer
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate


class OrderService:
    """Encapsulates order operations, inventory validation, and stock updates."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create_order(self, data: OrderCreate) -> Order:
        """Create an order atomically with inventory validation and stock reduction."""
        customer = self.db.get(Customer, data.customer_id)
        if customer is None:
            raise CustomerNotFoundException(customer_id=data.customer_id)

        quantity_by_product: dict[UUID, int] = defaultdict(int)
        for item in data.items:
            quantity_by_product[item.product_id] += item.quantity

        products_by_id: dict[UUID, Product] = {}
        for product_id, required_quantity in quantity_by_product.items():
            product = self.db.get(Product, product_id)
            if product is None:
                raise ProductNotFoundException(product_id=product_id)
            if product.quantity_in_stock < required_quantity:
                raise InsufficientInventoryException(
                    product_id=product_id,
                    requested=required_quantity,
                    available=product.quantity_in_stock,
                )
            products_by_id[product_id] = product

        try:
            total_amount = Decimal("0")
            order = Order(customer_id=data.customer_id, total_amount=Decimal("0"))
            self.db.add(order)
            self.db.flush()

            for item in data.items:
                product = products_by_id[item.product_id]
                unit_price = Decimal(str(product.price))
                line_total = unit_price * item.quantity
                total_amount += line_total

                order_item = OrderItem(
                    order_id=order.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    unit_price=unit_price,
                    line_total=line_total,
                )
                self.db.add(order_item)
                product.quantity_in_stock -= item.quantity

            order.total_amount = total_amount
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

        return self._get_order_with_items(order.id)

    def list_orders(
        self,
        page: int = 1,
        size: int = 10,
    ) -> tuple[list[Order], int]:
        """Return a paginated list of orders and total count."""
        total = self.db.scalar(select(func.count()).select_from(Order)) or 0
        offset = (page - 1) * size
        orders = list(
            self.db.scalars(
                select(Order)
                .order_by(Order.created_at.desc())
                .offset(offset)
                .limit(size)
            ).all()
        )
        return orders, total

    def get_order(self, order_id: UUID) -> Order:
        """Return an order with line items or raise OrderNotFoundException."""
        order = self._get_order_with_items(order_id)
        if order is None:
            raise OrderNotFoundException(order_id=order_id)
        return order

    def delete_order(self, order_id: UUID) -> None:
        """Delete an order and its items without restoring inventory."""
        order = self.db.get(Order, order_id)
        if order is None:
            raise OrderNotFoundException(order_id=order_id)
        self.db.delete(order)
        self.db.commit()

    def _get_order_with_items(self, order_id: UUID) -> Order | None:
        return self.db.scalar(
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.id == order_id)
        )
