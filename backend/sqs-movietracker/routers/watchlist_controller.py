from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi_pagination import Page, create_page, paginate, resolve_params
from fastapi_pagination.customization import CustomizedPage, UseParamsFields
from sqlalchemy.orm import Session

from database import get_db
from dependencies.auth import auth_user
from dependencies.services import get_movie_service, get_watchlist_service
from models import User
from models.schemas.watchlist_schemas import WatchlistAddRequest, WatchlistEntryResponse
from services.movie_service import MovieService
from services.watchlist_service import WatchlistService

router = APIRouter(prefix="/api/v1/watchlist", tags=["watchlist"])

WatchlistPage = CustomizedPage[
    Page[WatchlistEntryResponse],
    UseParamsFields(size=Query(10, ge=1, le=10)),
]


@router.get("/", response_model=WatchlistPage)
async def get_watchlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_user),
    watchlist_service: WatchlistService = Depends(get_watchlist_service),
    movie_service: MovieService = Depends(get_movie_service),
):
    stmt = WatchlistService.get_watchlist_query(current_user)
    entries = list(db.execute(stmt).scalars())
    page = paginate(entries)
    enriched = await watchlist_service.enrich_entries(page.items, movie_service)
    return create_page(enriched, total=page.total, params=resolve_params())


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
