from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy import String
from database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True
    )
    password: Mapped[str] = mapped_column(String(255))
