import pytest
from fastapi.testclient import TestClient

from database import Base, engine, SessionLocal
from dependencies.auth import auth_user
from main import app
from models import User

USERNAME = "integrationuser"
EMAIL = "integration@test.com"
PASSWORD = "securepassword123"
SHORT_USERNAME = "ab"
SHORT_EMAIL = "short@test.com"

REGISTER_PAYLOAD = {
    "username": USERNAME,
    "email": EMAIL,
    "password": PASSWORD,
    "confirm_password": PASSWORD,
}


@pytest.fixture(autouse=True)
def clean_db():
    Base.metadata.create_all(bind=engine)
    yield
    with SessionLocal() as db:
        db.query(User).filter(User.username.in_([USERNAME, SHORT_USERNAME])).delete(
            synchronize_session=False
        )
        db.commit()


@pytest.fixture
def client():
    with TestClient(app, base_url="https://testserver") as c:
        yield c


@pytest.fixture
def registered_client(client):
    client.post("/api/v1/users/register", json=REGISTER_PAYLOAD)
    return client


# ── Register ─────────────────────────────────────────────────────────────────

def test_register(client):
    response = client.post("/api/v1/users/register", json=REGISTER_PAYLOAD)
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == USERNAME
    assert data["email"] == EMAIL
    assert "password" not in data


def test_two_character_username_can_register_and_login(client):
    payload = {
        **REGISTER_PAYLOAD,
        "username": SHORT_USERNAME,
        "email": SHORT_EMAIL,
    }
    register_response = client.post("/api/v1/users/register", json=payload)
    assert register_response.status_code == 201

    login_response = client.post(
        "/api/v1/users/login",
        json={"username": SHORT_USERNAME, "password": PASSWORD},
    )
    assert login_response.status_code == 200


def test_register_duplicate_username_returns_409(registered_client):
    response = registered_client.post("/api/v1/users/register", json=REGISTER_PAYLOAD)
    assert response.status_code == 409
    assert "already taken" in response.json()["detail"]


def test_register_duplicate_email_returns_409(registered_client):
    payload = {**REGISTER_PAYLOAD, "username": "otheruser"}
    response = registered_client.post("/api/v1/users/register", json=payload)
    assert response.status_code == 409
    assert "already registered" in response.json()["detail"]


# ── Login ─────────────────────────────────────────────────────────────────────

def test_login(registered_client):
    response = registered_client.post(
        "/api/v1/users/login",
        json={"username": USERNAME, "password": PASSWORD},
    )
    assert response.status_code == 200
    assert response.json()["username"] == USERNAME
    assert "access_token" in registered_client.cookies


def test_login_wrong_password_returns_401(registered_client):
    response = registered_client.post(
        "/api/v1/users/login",
        json={"username": USERNAME, "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_login_unknown_username_returns_401(client):
    response = client.post(
        "/api/v1/users/login",
        json={"username": "nobody", "password": PASSWORD},
    )
    assert response.status_code == 401


# ── Logout ────────────────────────────────────────────────────────────────────

def test_logout_clears_cookie(registered_client):
    registered_client.post(
        "/api/v1/users/login",
        json={"username": USERNAME, "password": PASSWORD},
    )
    assert "access_token" in registered_client.cookies

    registered_client.post("/api/v1/users/logout")
    assert "access_token" not in registered_client.cookies


# ── Me ────────────────────────────────────────────────────────────────────────

def test_get_me_returns_current_user(registered_client):
    registered_client.post(
        "/api/v1/users/login",
        json={"username": USERNAME, "password": PASSWORD},
    )
    response = registered_client.get("/api/v1/users/me")
    assert response.status_code == 200
    assert response.json()["username"] == USERNAME


def test_get_me_unauthenticated_returns_401(client):
    response = client.get("/api/v1/users/me")
    assert response.status_code == 401
