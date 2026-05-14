from fastapi_cache.decorator import cache
from tenacity import stop_after_attempt, retry, wait_exponential
from models.movie import Movie
from services.util.tmdbclient import TMDBClient


class MovieService:

    def __init__(self):
        self.tmdb_client = TMDBClient()

    @cache(expire=3600)
    @retry(stop=stop_after_attempt(3),
           wait=wait_exponential(min=0.5, max=5))
    async def get_movie(self, movie_id: str) -> Movie:
        print("searching for movie")
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
            cover=(
                f"https://image.tmdb.org/t/p/original{backdrop_path}"
                if backdrop_path
                else ""
            ),
            tmdbRating=float(movie.get("vote_average", 0)),

        )
