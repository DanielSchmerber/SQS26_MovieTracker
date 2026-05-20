from typing import List, Optional

from fastapi_cache.decorator import cache
from tenacity import stop_after_attempt, retry, wait_exponential
from sqlalchemy import func
from sqlalchemy.orm import Session
from models import ReviewEntry
from models.movie import Movie, MovieSearchResponse
from services.util.tmdbclient import TMDBClient


class MovieService:

    def __init__(self):
        self.tmdb_client = TMDBClient()

    def get_rating(self, movie_id: str, db: Session) -> float:
        result = db.query(func.avg(ReviewEntry.rating)).filter(
            ReviewEntry.movie_id == movie_id
        ).scalar()
        return float(result) if result is not None else 0.0

    @cache(expire=300)
    @retry(stop=stop_after_attempt(3),
           wait=wait_exponential(min=0.5, max=5),
           reraise=True
           )
    async def search_movies(
        self,
        query: str,
        year: Optional[int] = None,
        page: int = 1,
    ) -> MovieSearchResponse:
        params = {"query": query, "page": page}
        if year is not None:
            params["primary_release_year"] = year

        data = await self.tmdb_client.get("search/movie", **params)

        movies = []
        for movie in data.get("results", []):
            release_date = movie.get("release_date", "")
            if not release_date or len(release_date) < 4:
                continue

            poster_path = movie.get("poster_path")
            backdrop_path = movie.get("backdrop_path")

            movies.append(Movie(
                id=str(movie["id"]),
                title=movie["title"],
                description=movie.get("overview", ""),
                year=int(release_date[:4]),
                poster=(
                    f"https://image.tmdb.org/t/p/w500{poster_path}"
                    if poster_path
                    else ""
                ),
                backdrop=(
                    f"https://image.tmdb.org/t/p/original{backdrop_path}"
                    if backdrop_path
                    else ""
                ),
                tmdbRating=float(movie.get("vote_average", 0)),
            ))

        return MovieSearchResponse(
            page=data.get("page", page),
            pages=data.get("total_pages", 0),
            total_results=data.get("total_results", 0),
            results=movies,
        )

    @cache(expire=3600)
    @retry(stop=stop_after_attempt(3),
           wait=wait_exponential(min=0.5, max=5),
           reraise=True
           )
    async def get_movie(self, movie_id: str) -> Movie:
        movie = await self.tmdb_client.get(f"movie/{movie_id}")

        if not movie:
            raise ValueError(f"No movie found for {movie_id}")

        poster_path = movie.get("poster_path")
        backdrop_path = movie.get("backdrop_path")

        return Movie(
            id=str(movie["id"]),
            title=movie["title"],
            description=movie.get("overview", ""),
            year=int(movie["release_date"][:4]),
            poster=(
                f"https://image.tmdb.org/t/p/w500{poster_path}"
                if poster_path
                else ""
            ),
            backdrop=(
                f"https://image.tmdb.org/t/p/original{backdrop_path}"
                if backdrop_path
                else ""
            ),
            tmdbRating=float(movie.get("vote_average", 0)),
        )
