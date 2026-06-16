from datetime import datetime, timedelta, timezone

import jwt

from environment import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRY_MINUTES


class TokenService:

    def create_access_token(self, user_id: int) -> str:
        """Creates a JWT access token for the given user_id."""
        payload = {
            "sub": str(user_id),
            "iat": datetime.now(timezone.utc),
            "exp": datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRY_MINUTES),
        }
        return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    def decode_access_token(self, token: str) -> int:
        """Decodes token and returns user_id. Raises ValueError on any failure."""
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return int(payload["sub"])
        except jwt.ExpiredSignatureError:
            raise ValueError("Token has expired")
        except (KeyError, TypeError, ValueError, jwt.InvalidTokenError):
            raise ValueError("Invalid token")
