import pytest
from fastapi.testclient import TestClient

from database import Base, engine, SessionLocal
from dependencies.auth import auth_user
from main import app
from models import User, WatchlistEntry


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
def clean_watchlist():
    Base.metadata.create_all(bind=engine)
    yield
    with SessionLocal() as db:
        db.query(WatchlistEntry).filter(WatchlistEntry.user_id == MOCK_USER.id).delete()
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




@pytest.mark.asyncio
async def test_add_movie(client, mock_tmdb):
    response = client.post("/api/v1/watchlist/", json={"movie_id": MOVIE_ID})
    assert response.status_code == 201
    data = response.json()
    assert data["movie"]["title"] == "Fight Club"
    assert data["movie"]["id"] == MOVIE_ID


@pytest.mark.asyncio
async def test_get_watchlist_contains_added_movie(client, mock_tmdb):
    client.post("/api/v1/watchlist/", json={"movie_id": MOVIE_ID})
    response = client.get("/api/v1/watchlist/")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["movie"]["title"] == "Fight Club"


@pytest.mark.asyncio
async def test_is_in_watchlist_true(client, mock_tmdb):
    client.post("/api/v1/watchlist/", json={"movie_id": MOVIE_ID})
    response = client.get(f"/api/v1/watchlist/{MOVIE_ID}")
    assert response.status_code == 200
    assert response.json() is True


@pytest.mark.asyncio
async def test_is_in_watchlist_false(client, mock_tmdb):
    response = client.get(f"/api/v1/watchlist/{MOVIE_ID}")
    assert response.status_code == 200
    assert response.json() is False


@pytest.mark.asyncio
async def test_remove_movie(client, mock_tmdb):
    client.post("/api/v1/watchlist/", json={"movie_id": MOVIE_ID})
    response = client.delete(f"/api/v1/watchlist/{MOVIE_ID}")
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_watchlist_empty_after_removal(client, mock_tmdb):
    client.post("/api/v1/watchlist/", json={"movie_id": MOVIE_ID})
    client.delete(f"/api/v1/watchlist/{MOVIE_ID}")
    response = client.get("/api/v1/watchlist/")
    assert response.status_code == 200
    assert response.json()["total"] == 0


@pytest.mark.asyncio
async def test_add_duplicate_returns_409(client, mock_tmdb):
    client.post("/api/v1/watchlist/", json={"movie_id": MOVIE_ID})
    response = client.post("/api/v1/watchlist/", json={"movie_id": MOVIE_ID})
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_remove_nonexistent_returns_404(client, mock_tmdb):
    response = client.delete(f"/api/v1/watchlist/{MOVIE_ID}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_add_unreleased_movie_returns_400(client, mocker):
    mocker.patch("services.movie_service.TMDBClient.get", return_value={  # noqa: F811
        **TMDB_MOVIE,
        "release_date": "2099-01-01",
    })
    response = client.post("/api/v1/watchlist/", json={"movie_id": MOVIE_ID})
    assert response.status_code == 409
