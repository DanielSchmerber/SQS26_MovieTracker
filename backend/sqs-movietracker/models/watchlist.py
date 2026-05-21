from datetime import datetime

from sqlalchemy.dialects.mysql import DATETIME
from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy import ForeignKey, String, DateTime

from database import Base

class WatchlistEntry(Base):
    __tablename__ = "watchlist"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    movie_id: Mapped[int] = mapped_column(index=True)

    added_at: Mapped[datetime] = mapped_column(DateTime())