import asyncio
from datetime import datetime, timezone

from sqlalchemy import select, Select
from sqlalchemy.orm import Session

from models import User, WatchlistEntry
from models.movie import Movie
from models.schemas.watchlist_schemas import WatchlistEntryResponse
from services.movie_service import MovieService


def verify_movie(movie: Movie | None, now: datetime) -> None:
    if movie is None:
        raise ValueError("Movie not found")
    if (movie.year, movie.month) > (now.year, now.month):
        raise ValueError("Movie has not been released yet")


class WatchlistService:

    def __init__(self):
        pass


    def get_watchlist_query(user: User) -> Select:
        return select(WatchlistEntry).where(WatchlistEntry.user_id == user.id)


    async def enrich_entries(entries: list[WatchlistEntry], movie_service: MovieService) -> list[WatchlistEntryResponse]:
        movies = await asyncio.gather(
            *[movie_service.get_movie(str(e.movie_id)) for e in entries],
            return_exceptions=True,
        )
        return [
            WatchlistEntryResponse(id=entry.id, added_at=entry.added_at, movie=movie)
            for entry, movie in zip(entries, movies)
            if not isinstance(movie, Exception)
        ]

    async def add_to_watchlist(self, db: Session, user: User, movie_id: int, movie_service: MovieService) -> WatchlistEntry:
        try:
            movie = await movie_service.get_movie(str(movie_id))
        except Exception:
            movie = None

        verify_movie(movie, datetime.now(timezone.utc))

        existing = db.query(WatchlistEntry).filter(
            WatchlistEntry.user_id == user.id,
            WatchlistEntry.movie_id == movie_id,
        ).first()
        if existing:
            raise ValueError("Movie already in watchlist")

        entry = WatchlistEntry(user_id=user.id, movie_id=movie_id, added_at=datetime.now(timezone.utc))
        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry

    @staticmethod
    def is_in_watchlist(db: Session, user: User, movie_id: int) -> bool:
        return db.query(WatchlistEntry).filter(
            WatchlistEntry.user_id == user.id,
            WatchlistEntry.movie_id == movie_id,
        ).first() is not None

    def remove_from_watchlist(self, db: Session, user: User, movie_id: int) -> None:
        entry = db.query(WatchlistEntry).filter(
            WatchlistEntry.user_id == user.id,
            WatchlistEntry.movie_id == movie_id,
        ).first()
        if not entry:
            raise ValueError("Movie not in watchlist")

        db.delete(entry)
        db.commit()
