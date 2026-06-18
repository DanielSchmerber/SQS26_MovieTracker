from datetime import datetime, timedelta, timezone

import jwt
import pytest

from environment import JWT_ALGORITHM, JWT_SECRET
from services.token_service import TokenService


def test_create_access_token_can_be_decoded_to_user_id():
    token = TokenService().create_access_token(123)

    assert TokenService().decode_access_token(token) == 123


def test_decode_access_token_rejects_expired_token():
    token = jwt.encode(
        {
            "sub": "123",
            "iat": datetime.now(timezone.utc) - timedelta(hours=2),
            "exp": datetime.now(timezone.utc) - timedelta(minutes=1),
        },
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )

    with pytest.raises(ValueError, match="expired"):
        TokenService().decode_access_token(token)


def test_decode_access_token_rejects_malformed_token():
    with pytest.raises(ValueError, match="Invalid token"):
        TokenService().decode_access_token("not-a-jwt")


@pytest.mark.parametrize(
    "payload",
    [
        {"iat": datetime.now(timezone.utc), "exp": datetime.now(timezone.utc) + timedelta(minutes=5)},
        {"sub": "not-an-int", "iat": datetime.now(timezone.utc), "exp": datetime.now(timezone.utc) + timedelta(minutes=5)},
    ],
)
def test_decode_access_token_rejects_invalid_subject(payload):
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    with pytest.raises(ValueError, match="Invalid token"):
        TokenService().decode_access_token(token)


def test_decode_access_token_rejects_wrong_signature():
    token = jwt.encode(
        {
            "sub": "123",
            "iat": datetime.now(timezone.utc),
            "exp": datetime.now(timezone.utc) + timedelta(minutes=5),
        },
        "not-the-application-secret",
        algorithm=JWT_ALGORITHM,
    )

    with pytest.raises(ValueError, match="Invalid token"):
        TokenService().decode_access_token(token)
