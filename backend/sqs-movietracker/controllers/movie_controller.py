import httpx
from fastapi import APIRouter, HTTPException, Request

from models.movie import Movie


router = APIRouter(prefix="/movie")


@router.get(
    "/{movie_id}",
    response_model=Movie,
    responses={404: {"description": "Movie not found"},
               502: {"description": "Upstream TMDB error"}}
)
async def get_movie(movie_id: str, request: Request):
    try:
        return await request.app.state.movie_service.get_movie(movie_id)
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Movie '{movie_id}' not found")
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Movie '{movie_id}' not found")
        raise HTTPException(status_code=502, detail="Upstream TMDB error")