from __future__ import annotations

from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import mapped_column, Mapped, relationship

from database import Base

if TYPE_CHECKING:
    from models.user import User


class ReviewEntry(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    movie_id: Mapped[int] = mapped_column(index=True)
    rating: Mapped[int] = mapped_column()
    comment: Mapped[str | None] = mapped_column(String(1000), nullable=True)

    user: Mapped["User"] = relationship(lazy="joined")

    @property
    def username(self) -> str:
        return self.user.username
