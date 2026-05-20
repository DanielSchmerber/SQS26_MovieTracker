from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_user_service
from models.schemas.user_schemas import UserRegisterRequest, UserLoginRequest, UserResponse
from services.user_service import UserService

router = APIRouter(prefix="/api/v1/users", tags=["users"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201,
    responses={
        409: {"description": "Username or email already exists"},
    },
)
def register(
    data: UserRegisterRequest,
    service: UserService = Depends(get_user_service),
    db: Session = Depends(get_db),
):
    try:
        user = service.register(db, data)
        return user
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.post(
    "/login",
    response_model=UserResponse,
    responses={
        401: {"description": "Invalid credentials"},
    },
)
def login(
    data: UserLoginRequest,
    service: UserService = Depends(get_user_service),
    db: Session = Depends(get_db),
):
    try:
        user = service.login(db, data.username, data.password)
        return user
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))