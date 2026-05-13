from fastapi import APIRouter

from models.movie import Movie
from services import movie_service

router = APIRouter(prefix="/movie")


@router.get("/{movie_id}", response_model=Movie)
async def get_movie(movie_id: str):
    return movie_service.get_movie(movie_id)
