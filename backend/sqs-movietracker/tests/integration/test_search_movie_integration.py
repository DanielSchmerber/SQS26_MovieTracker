import pytest

from fastapi.testclient import TestClient
from fastapi_cache import FastAPICache

from services.movie_service import MovieService
from main import app


@pytest.fixture
def client():
    with TestClient(app) as client:
        yield client


@pytest.fixture
def mock_get(mocker):
    return mocker.patch("services.movie_service.TMDBClient.get")


@pytest.fixture
def example_movie():
    return {
        "id": 123,
        "title": "Inception",
        "overview": "A dream within a dream",
        "release_date": "2010-07-16",
        "poster_path": "/poster.jpg",
        "backdrop_path": "/backdrop.jpg",
        "vote_average": 8.7,
    }


@pytest.mark.asyncio
async def test_get_movie(mock_get, example_movie, client):
    mock_get.return_value = example_movie
    response = client.get("/api/v1/movies/1")

    assert response.status_code == 200
    response_json = response.json()

    assert response_json["title"] == example_movie["title"]
    assert response_json["description"] == example_movie["overview"]


@pytest.mark.asyncio
async def test_get_movie_robustness(mock_get, example_movie, client):
    mock_get.side_effect = [
        Exception("timeout"),
        Exception("timeout"),
        example_movie,
    ]
    response = client.get("/api/v1/movies/1")

    assert response.status_code == 200
    assert mock_get.call_count == 3


@pytest.mark.asyncio
async def test_get_movie_cache(mock_get, example_movie, client):
    mock_get.return_value = example_movie
    responses = [
        client.get("/api/v1/movies/movie/1"),
        client.get("/api/v1/movies/movie/1"),
        client.get("/api/v1/movies/movie/1"),
    ]

    assert all(response.status_code == 200 for response in responses)
    response_bodies = [response.json() for response in responses]
    assert all(body == response_bodies[0] for body in response_bodies)

    # call count should remain 1, result has to be cached
    assert mock_get.call_count == 1
