from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies.auth import auth_user
from dependencies.services import get_review_service, get_watchlist_service
from models import User
from models.schemas.review_schemas import ReviewCreateRequest, ReviewUpdateRequest, ReviewResponse
from services.review_service import ReviewService
from services.watchlist_service import WatchlistService

router = APIRouter(prefix="/api/v1/reviews", tags=["reviews"])


@router.get("/{movie_id}", response_model=list[ReviewResponse])
def get_reviews(
    movie_id: int,
    db: Annotated[Session, Depends(get_db)],
    review_service: Annotated[ReviewService, Depends(get_review_service)],
):
    return review_service.get_reviews(db, movie_id)


@router.get("/{movie_id}/rating", response_model=float)
def get_rating(
    movie_id: int,
    db: Annotated[Session, Depends(get_db)],
    review_service: Annotated[ReviewService, Depends(get_review_service)],
):
    return review_service.get_rating(db, movie_id)


@router.post("/", response_model=ReviewResponse, status_code=201)
def add_review(
    data: ReviewCreateRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(auth_user)],
    review_service: Annotated[ReviewService, Depends(get_review_service)],
    watchlist_service: Annotated[WatchlistService, Depends(get_watchlist_service)],
):
    try:
        return review_service.add_review(db, watchlist_service, current_user, data)
    except ValueError as e:
        status = 409 if "already reviewed" in str(e) else 422
        raise HTTPException(status_code=status, detail=str(e))


@router.put("/{review_id}", response_model=ReviewResponse, responses={403: {"description": "Forbidden"}, 404: {"description": "Review not found"}})
def update_review(
    review_id: int,
    data: ReviewUpdateRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(auth_user)],
    review_service: Annotated[ReviewService, Depends(get_review_service)],
):
    try:
        return review_service.update_review(db, current_user, review_id, data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.delete("/{review_id}", status_code=204, responses={403: {"description": "Forbidden"}, 404: {"description": "Review not found"}})
def delete_review(
    review_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(auth_user)],
    review_service: Annotated[ReviewService, Depends(get_review_service)],
):
    try:
        review_service.delete_review(db, current_user, review_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
