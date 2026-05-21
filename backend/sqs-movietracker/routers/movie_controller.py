import httpx
from fastapi import APIRouter, HTTPException, Depends, Query

from dependencies import get_movie_service, MovieServiceDep
from models.movie import Movie, MovieSearchResponse
from services.movie_service import MovieService

router = APIRouter(prefix="/api/v1/movies")


@router.get(
    "/search",
    response_model=MovieSearchResponse,
    responses={502: {"description": "Upstream TMDB error"}}
)
async def search_movies(
    query: str,
    service: MovieServiceDep,
    year: Optional[int] = Query(default=None, ge=1888),
    page: int = Query(default=1, ge=1, le=500),
):
    try:
        return await service.search_movies(query, year, page)
    except httpx.HTTPStatusError:
        raise HTTPException(status_code=502, detail="Upstream TMDB error")


@router.get(
    "/{movie_id}",
    response_model=Movie,
    responses={404: {"description": "Movie not found"},
               502: {"description": "Upstream TMDB error"}}
)
async def get_movie(movie_id: str, service: MovieService = Depends(get_movie_service)):
    try:
        return await service.get_movie(movie_id)
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Movie '{movie_id}' not found")
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Movie '{movie_id}' not found")
        raise HTTPException(status_code=502, detail="Upstream TMDB error")
