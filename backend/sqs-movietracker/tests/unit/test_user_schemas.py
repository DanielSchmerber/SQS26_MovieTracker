import pytest
from pydantic import ValidationError

from models.schemas.user_schemas import UserLoginRequest, UserRegisterRequest


def test_register_request_rejects_mismatched_password_confirmation():
    with pytest.raises(ValidationError, match="Passwords do not match"):
        UserRegisterRequest(
            username="alice",
            email="alice@example.com",
            password="securepassword123",
            confirm_password="differentpassword123",
        )


@pytest.mark.parametrize("username", ["al", "name-with-dash", "name with space", "a" * 21])
def test_auth_requests_reject_invalid_usernames(username):
    with pytest.raises(ValidationError):
        UserLoginRequest(username=username, password="securepassword123")
