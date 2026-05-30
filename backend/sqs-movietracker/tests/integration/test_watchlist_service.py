import pytest
from datetime import datetime, timezone

from models.movie import Movie
from services.watchlist_service import verify_movie


def make_movie(year: int, month: int) -> Movie:
    return Movie(
        id=1,
        title="Test",
        description="",
        year=year,
        month=month,
        poster="",
        backdrop="",
        tmdbRating=0.0,
    )


def now(year: int, month: int) -> datetime:
    return datetime(year, month, 1, tzinfo=timezone.utc)


def test_none_movie_raises():
    with pytest.raises(ValueError, match="not found"):
        verify_movie(None, now(2024, 3))


def test_released_same_month_passes():
    verify_movie(make_movie(2024, 3), now(2024, 3))


def test_released_past_month_passes():
    verify_movie(make_movie(2024, 1), now(2024, 3))


def test_released_past_year_passes():
    verify_movie(make_movie(2020, 12), now(2024, 3))


def test_next_month_raises():
    with pytest.raises(ValueError, match="not been released"):
        verify_movie(make_movie(2024, 4), now(2024, 3))


def test_next_year_raises():
    with pytest.raises(ValueError, match="not been released"):
        verify_movie(make_movie(2025, 1), now(2024, 3))


def test_same_year_earlier_month_passes():
    verify_movie(make_movie(2024, 2), now(2024, 3))
