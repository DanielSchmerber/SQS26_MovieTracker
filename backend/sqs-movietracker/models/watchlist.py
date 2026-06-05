from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy import ForeignKey

from database import Base


class WatchlistEntry(Base):
    __tablename__ = "watchlist"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    movie_id: Mapped[int] = mapped_column(index=True)
