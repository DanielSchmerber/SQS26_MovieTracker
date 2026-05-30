from sqlalchemy.orm import Session

from models import ReviewEntry, User
from sqlalchemy import func
from sqlalchemy import select

from models.schemas.review_schemas import ReviewCreateRequest, ReviewUpdateRequest
from services.watchlist_service import WatchlistService


class ReviewService:

    def get_reviews(self, db: Session, movie_id: int) -> list[ReviewEntry]:
        stmt = select(ReviewEntry).where(ReviewEntry.movie_id == movie_id)
        return db.scalars(stmt).all()

    def get_rating(self, db: Session, movie_id: int) -> float:
        stmt = select(func.avg(ReviewEntry.rating)).where(ReviewEntry.movie_id == movie_id)
        result = db.execute(stmt).scalar()
        return result if result is not None else -1

    def get_review(self, db: Session, review_id: int) -> ReviewEntry | None:
        stmt = select(ReviewEntry).where(ReviewEntry.id == review_id)
        return db.scalars(stmt).first()

    def _has_reviewed(self, db: Session, user: User, movie_id: int) -> bool:
        stmt = select(ReviewEntry.id).where(
            ReviewEntry.movie_id == movie_id,
            ReviewEntry.user_id == user.id,
        )
        return db.scalars(stmt).first() is not None

    def add_review(self, db: Session, watchlist_service: WatchlistService, user: User, data: ReviewCreateRequest) -> ReviewEntry:
        if self._has_reviewed(db, user, data.movie_id):
            raise ValueError("movie already reviewed")

        if not watchlist_service.is_in_watchlist(db, user, movie_id=data.movie_id):
            raise ValueError("movie has to be watched to rate")

        review = ReviewEntry(
            user_id=user.id,
            movie_id=data.movie_id,
            comment=data.comment,
            rating=data.rating,
        )
        db.add(review)
        db.commit()
        db.refresh(review)
        return review

    def update_review(self, db: Session, user: User, review_id: int, data: ReviewUpdateRequest) -> ReviewEntry:
        review = self.get_review(db, review_id)
        if review is None:
            raise ValueError("review not found")
        if review.user_id != user.id:
            raise PermissionError("not your review")

        if data.rating is not None:
            review.rating = data.rating
        if data.comment is not None:
            review.comment = data.comment

        db.commit()
        db.refresh(review)
        return review

    def delete_review(self, db: Session, user: User, review_id: int) -> None:
        review = self.get_review(db, review_id)
        if review is None:
            raise ValueError("review not found")
        if review.user_id != user.id:
            raise PermissionError("not your review")

        db.delete(review)
        db.commit()








