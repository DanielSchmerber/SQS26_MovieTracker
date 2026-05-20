from typing import Annotated

from fastapi import Request, Depends
from services.movie_service import MovieService


def get_movie_service(request: Request) -> MovieService:
    return request.app.state.movie_service


MovieServiceDep = Annotated[MovieService, Depends(get_movie_service)]
