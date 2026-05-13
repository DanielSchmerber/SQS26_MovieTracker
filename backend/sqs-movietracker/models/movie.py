from pydantic import BaseModel


class Movie(BaseModel):
    id: str
    title: str
    description: str
    year: int
    poster: str
    cover: str
    tmdbRating: float
