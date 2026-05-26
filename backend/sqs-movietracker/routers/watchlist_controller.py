import math

from fastapi import APIRouter, Depends, HTTPException
from fastapi_pagination import Page, Params
from sqlalchemy import func, select as sa_select
from sqlalchemy.orm import Session

from database import get_db
from dependencies.auth import auth_user
from dependencies.services import get_movie_service, get_watchlist_service
from models import User
from models.schemas.watchlist_schemas import WatchlistAddRequest, WatchlistEntryResponse
from services.movie_service import MovieService
from services.watchlist_service import WatchlistService

router = APIRouter(prefix="/api/v1/watchlist", tags=["watchlist"])


@router.get("/", response_model=Page[WatchlistEntryResponse])
async def get_watchlist(
    params: Params = Depends(),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_user),
    watchlist_service: WatchlistService = Depends(get_watchlist_service),
    movie_service: MovieService = Depends(get_movie_service),
):
    stmt = WatchlistService.get_watchlist_query(current_user)
    total = db.scalar(sa_select(func.count()).select_from(stmt.subquery()))
    offset = (params.page - 1) * params.size
    entries = list(db.execute(stmt.offset(offset).limit(params.size)).scalars())
    enriched = await watchlist_service.enrich_entries(entries, movie_service)
    pages = math.ceil(total / params.size) if total > 0 else 0
    return Page(items=enriched, total=total, page=params.page, size=params.size, pages=pages)


@router.post("/", response_model=WatchlistEntryResponse, status_code=201)
async def add_to_watchlist(
    data: WatchlistAddRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_user),
    watchlist_service: WatchlistService = Depends(get_watchlist_service),
    movie_service: MovieService = Depends(get_movie_service),
):
    try:
        return await watchlist_service.add_to_watchlist(db, current_user, data.movie_id, movie_service)
    except ValueError as e:
        status = 404 if "not found" in str(e).lower() else 409
        raise HTTPException(status_code=status, detail=str(e))


@router.get("/{movie_id}", response_model=bool)
def is_in_watchlist(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_user),
    watchlist_service: WatchlistService = Depends(get_watchlist_service),
):
    return watchlist_service.is_in_watchlist(db, current_user, movie_id)


@router.delete("/{movie_id}", status_code=204)
def remove_from_watchlist(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_user),
    watchlist_service: WatchlistService = Depends(get_watchlist_service),
):
    try:
        watchlist_service.remove_from_watchlist(db, current_user, movie_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
