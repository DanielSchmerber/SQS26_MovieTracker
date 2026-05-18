from typing import List

from pydantic import BaseModel


class Movie(BaseModel):
    id: str
    title: str
    description: str
    year: int
    poster: str
    backdrop: str
    tmdbRating: float


class MovieSearchResponse(BaseModel):
    page: int
    pages: int
    total_results: int
    results: List[Movie]
