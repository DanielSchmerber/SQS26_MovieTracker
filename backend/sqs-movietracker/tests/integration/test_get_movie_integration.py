import pytest

from fastapi.testclient import TestClient
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
def example_search():
    return {
        "page": 1,
        "results": [
            {
                "adult": False,
                "backdrop_path": "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
                "genre_ids": [
                    18,
                    53,
                    35
                ],
                "id": 550,
                "original_language": "en",
                "original_title": "Fight Club",
                "overview": "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground \"fight clubs\" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.",
                "popularity": 73.433,
                "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
                "release_date": "1999-10-15",
                "title": "Fight Club",
                "video": False,
                "vote_average": 8.433,
                "vote_count": 26279
            },

        ],
        "total_pages": 1,
        "total_results": 1
    }


@pytest.mark.asyncio
async def test_get_movie(mock_get, example_search, client):
    mock_get.return_value = example_search
    response = client.get("api/v1/movies/search/?query=Fight")

    assert response.status_code == 200
    response_json = response.json()

    assert response_json["pages"] == 1
    assert response_json["results"][0]["title"] == example_search["results"][0]["title"]



@pytest.mark.asyncio
async def test_get_movie_robustness(mock_get, example_search, client):
    mock_get.side_effect = [
        Exception("timeout"),
        Exception("timeout"),
        example_search,
    ]

    response = client.get("/api/v1/movies/search/?query=Fight")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_get_movie_cache(mock_get, example_search, client):
    mock_get.return_value = example_search
    response = client.get("/api/v1/movies/search/?query=Fight")
    response = client.get("/api/v1/movies/search/?query=Fight")
    response = client.get("/api/v1/movies/search/?query=Fight")

    assert response.status_code == 200
    assert mock_get.call_count == 1

