from fastapi import Request
from services.movie_service import MovieService


def get_movie_service(request: Request) -> MovieService:
    return request.app.state.movie_service
