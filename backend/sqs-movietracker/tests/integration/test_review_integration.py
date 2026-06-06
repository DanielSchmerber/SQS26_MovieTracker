import pytest
import math
from fastapi.testclient import TestClient

from database import Base, engine, SessionLocal
from dependencies.auth import auth_user
from main import app
from models import User, WatchlistEntry, ReviewEntry


MOVIE_ID = 550

MOCK_USER = User(id=99, username="testuser", email="test@test.com", password="x")

TMDB_MOVIE = {
    "id": MOVIE_ID,
    "title": "Fight Club",
    "overview": "First rule: you do not talk about Fight Club.",
    "release_date": "1999-10-15",
    "poster_path": "/poster.jpg",
    "backdrop_path": "/backdrop.jpg",
    "vote_average": 8.4,
}


@pytest.fixture(autouse=True)
def clean_db():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        db.merge(MOCK_USER)
        db.commit()
    yield
    with SessionLocal() as db:
        db.query(ReviewEntry).filter(ReviewEntry.movie_id == MOVIE_ID).delete()
        db.query(WatchlistEntry).filter(WatchlistEntry.user_id == MOCK_USER.id).delete()
        db.query(User).filter(User.id == MOCK_USER.id).delete()
        db.commit()


@pytest.fixture
def client():
    app.dependency_overrides[auth_user] = lambda: MOCK_USER
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def mock_tmdb(mocker):
    return mocker.patch("services.movie_service.TMDBClient.get", return_value=TMDB_MOVIE)


@pytest.fixture
def watched_client(client, mock_tmdb):
    """Client with the movie already in the watchlist."""
    client.post("/api/v1/watchlist/", json={"movie_id": MOVIE_ID})
    return client


# ── GET reviews ──────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_reviews_empty(client):
    response = client.get(f"/api/v1/reviews/{MOVIE_ID}")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_get_reviews_contains_added_review(watched_client):
    watched_client.post("/api/v1/reviews/", json={"movie_id": MOVIE_ID, "rating": 7, "comment": "Pretty good"})
    response = watched_client.get(f"/api/v1/reviews/{MOVIE_ID}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["rating"] == 7
    assert data[0]["comment"] == "Pretty good"


# ── GET rating ───────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_rating_unrated_returns_minus_one(client):
    response = client.get(f"/api/v1/reviews/{MOVIE_ID}/rating")
    assert response.status_code == 200
    assert response.json() == -1


@pytest.mark.asyncio
async def test_get_rating_returns_average(watched_client):
    watched_client.post("/api/v1/reviews/", json={"movie_id": MOVIE_ID, "rating": 6})
    response = watched_client.get(f"/api/v1/reviews/{MOVIE_ID}/rating")
    assert response.status_code == 200
    assert math.isclose(response.json(), 6.0)


@pytest.mark.asyncio
async def test_get_rating_averages_multiple_reviews(watched_client):
    watched_client.post("/api/v1/reviews/", json={"movie_id": MOVIE_ID, "rating": 6})
    with SessionLocal() as db:
        db.add(ReviewEntry(user_id=1, movie_id=MOVIE_ID, rating=10))
        db.commit()
    response = watched_client.get(f"/api/v1/reviews/{MOVIE_ID}/rating")
    assert response.status_code == 200
    assert math.isclose(response.json(), 8.0)


# ── POST review ───────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_add_review(watched_client):
    response = watched_client.post("/api/v1/reviews/", json={"movie_id": MOVIE_ID, "rating": 8, "comment": "Great movie!"})
    assert response.status_code == 201
    data = response.json()
    assert data["movie_id"] == MOVIE_ID
    assert data["rating"] == 8
    assert data["comment"] == "Great movie!"
    assert data["user_id"] == MOCK_USER.id
    assert data["username"] == MOCK_USER.username


@pytest.mark.asyncio
async def test_add_review_without_comment(watched_client):
    response = watched_client.post("/api/v1/reviews/", json={"movie_id": MOVIE_ID, "rating": 5})
    assert response.status_code == 201
    assert response.json()["comment"] is None


@pytest.mark.asyncio
async def test_add_duplicate_review_returns_409(watched_client):
    watched_client.post("/api/v1/reviews/", json={"movie_id": MOVIE_ID, "rating": 7})
    response = watched_client.post("/api/v1/reviews/", json={"movie_id": MOVIE_ID, "rating": 8})
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_add_review_without_watchlist_returns_422(client):
    response = client.post("/api/v1/reviews/", json={"movie_id": MOVIE_ID, "rating": 7})
    assert response.status_code == 422


# ── PUT review ────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_update_review(watched_client):
    post = watched_client.post("/api/v1/reviews/", json={"movie_id": MOVIE_ID, "rating": 5, "comment": "Meh"})
    review_id = post.json()["id"]
    response = watched_client.put(f"/api/v1/reviews/{review_id}", json={"rating": 9, "comment": "Changed my mind"})
    assert response.status_code == 200
    data = response.json()
    assert data["rating"] == 9
    assert data["comment"] == "Changed my mind"


@pytest.mark.asyncio
async def test_update_nonexistent_review_returns_404(client):
    response = client.put("/api/v1/reviews/9999", json={"rating": 5})
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_other_users_review_returns_403(client):
    with SessionLocal() as db:
        review = ReviewEntry(user_id=1, movie_id=MOVIE_ID, rating=5, comment="Not yours")
        db.add(review)
        db.commit()
        db.refresh(review)
        review_id = review.id

    response = client.put(f"/api/v1/reviews/{review_id}", json={"rating": 9})
    assert response.status_code == 403


# ── DELETE review ─────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_delete_review(watched_client):
    post = watched_client.post("/api/v1/reviews/", json={"movie_id": MOVIE_ID, "rating": 5})
    review_id = post.json()["id"]
    response = watched_client.delete(f"/api/v1/reviews/{review_id}")
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_reviews_empty_after_deletion(watched_client):
    post = watched_client.post("/api/v1/reviews/", json={"movie_id": MOVIE_ID, "rating": 5})
    review_id = post.json()["id"]
    watched_client.delete(f"/api/v1/reviews/{review_id}")
    response = watched_client.get(f"/api/v1/reviews/{MOVIE_ID}")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_delete_nonexistent_review_returns_404(client):
    response = client.delete("/api/v1/reviews/9999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_other_users_review_returns_403(client):
    with SessionLocal() as db:
        review = ReviewEntry(user_id=1, movie_id=MOVIE_ID, rating=5, comment="Not yours")
        db.add(review)
        db.commit()
        db.refresh(review)
        review_id = review.id

    response = client.delete(f"/api/v1/reviews/{review_id}")
    assert response.status_code == 403
