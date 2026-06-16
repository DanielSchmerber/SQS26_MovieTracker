import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from werkzeug.security import check_password_hash

from database import Base
from models.user import User
from models.schemas.user_schemas import UserRegisterRequest
from services.user_service import UserService


class StubTokenService:
    def __init__(self, user_id=None, error=None):
        self.user_id = user_id
        self.error = error
        self.seen_token = None

    def decode_access_token(self, token):
        self.seen_token = token
        if self.error:
            raise self.error
        return self.user_id


@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    with Session() as session:
        yield session

    Base.metadata.drop_all(bind=engine)


def register_request(username="alice", email="alice@example.com", password="securepassword123"):
    return UserRegisterRequest(
        username=username,
        email=email,
        password=password,
        confirm_password=password,
    )


def add_user(db_session, username="alice", email="alice@example.com", password_hash="hashed"):
    user = User(username=username, email=email, password=password_hash)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def test_register_persists_user_with_hashed_password(db_session):
    user = UserService(StubTokenService()).register(db_session, register_request())

    assert user.id is not None
    assert user.username == "alice"
    assert user.password != "securepassword123"
    assert check_password_hash(user.password, "securepassword123")


def test_register_rejects_duplicate_username(db_session):
    add_user(db_session, username="alice", email="existing@example.com")

    with pytest.raises(ValueError, match="already taken"):
        UserService(StubTokenService()).register(db_session, register_request())


def test_register_rejects_duplicate_email(db_session):
    add_user(db_session, username="existing", email="alice@example.com")

    with pytest.raises(ValueError, match="already registered"):
        UserService(StubTokenService()).register(db_session, register_request())


def test_login_returns_user_for_valid_credentials(db_session):
    created = UserService(StubTokenService()).register(db_session, register_request())

    logged_in = UserService(StubTokenService()).login(db_session, "alice", "securepassword123")

    assert logged_in.id == created.id


@pytest.mark.parametrize(
    ("username", "password"),
    [
        ("alice", "wrongpassword"),
        ("unknown", "securepassword123"),
    ],
)
def test_login_rejects_invalid_credentials(db_session, username, password):
    UserService(StubTokenService()).register(db_session, register_request())

    with pytest.raises(ValueError, match="Invalid username or password"):
        UserService(StubTokenService()).login(db_session, username, password)


def test_get_current_user_uses_token_subject(db_session):
    user = add_user(db_session, username="alice", email="alice@example.com")
    token_service = StubTokenService(user_id=user.id)

    current_user = UserService(token_service).get_current_user(db_session, "valid-token")

    assert current_user.id == user.id
    assert token_service.seen_token == "valid-token"


def test_get_current_user_rejects_missing_token(db_session):
    with pytest.raises(ValueError, match="Not authenticated"):
        UserService(StubTokenService()).get_current_user(db_session, "")


def test_get_current_user_rejects_unknown_user_id(db_session):
    with pytest.raises(ValueError, match="User not found"):
        UserService(StubTokenService(user_id=999)).get_current_user(db_session, "valid-token")
