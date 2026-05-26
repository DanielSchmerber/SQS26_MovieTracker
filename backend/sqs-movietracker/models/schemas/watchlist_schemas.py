from pydantic import BaseModel

from models.movie import Movie


class WatchlistAddRequest(BaseModel):
    movie_id: int


class WatchlistEntryResponse(BaseModel):
    id: int
    movie: Movie

