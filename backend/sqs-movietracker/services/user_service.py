from sqlalchemy.orm import Session
from werkzeug.security import generate_password_hash, check_password_hash

from models.user import User
from models.schemas.user_schemas import UserRegisterRequest
from services.token_service import TokenService


class UserService:
    
    def __init__(self, token_service: TokenService):
        self.token_service = token_service

    def register(self, db: Session, data: UserRegisterRequest) -> User:
        if db.query(User).filter(User.username == data.username).first():
            raise ValueError(f"Username '{data.username}' is already taken")

        if db.query(User).filter(User.email == data.email).first():
            raise ValueError(f"Email '{data.email}' is already registered")

        user = User(
            username=data.username,
            email=data.email,
            password=generate_password_hash(data.password),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def login(self, db: Session, username: str, password: str) -> User:
        user = db.query(User).filter(User.username == username).first()

        if not user or not check_password_hash(user.password, password):
            raise ValueError("Invalid username or password")

        return user
    
    def get_current_user(self, db: Session, token: str) -> User:
        if not token:
            raise ValueError("Not authenticated")
        try:
            user_id = self.token_service.decode_access_token(token)
        except ValueError as e:
            raise ValueError(str(e))

        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise ValueError("User not found")

        return user