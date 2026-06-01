"""Initial baseline migration.

Revision ID: 001_initial_baseline
Revises:
Create Date: 2026-06-01

"""

from typing import Sequence, Union

# revision identifiers, used by Alembic.
revision: str = "001_initial_baseline"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Baseline revision; domain models will be added in Phase 2."""
    pass


def downgrade() -> None:
    pass
