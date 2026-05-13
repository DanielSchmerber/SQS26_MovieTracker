from sqlalchemy import ForeignKey, String, Integer
from sqlalchemy.orm import mapped_column, Mapped

from database import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        index=True
    )
    movie_id: Mapped[int] = mapped_column(index=True)
    rating: Mapped[int] = mapped_column()
    comment: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True
    )