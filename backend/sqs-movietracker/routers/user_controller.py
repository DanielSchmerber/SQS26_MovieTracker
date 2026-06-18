from fastapi import APIRouter, HTTPException, Depends, Response
from sqlalchemy.orm import Session

from typing import Annotated

from database import get_db
from dependencies.services import get_token_service, get_user_service
from models.schemas.user_schemas import UserRegisterRequest, UserLoginRequest, UserResponse
from dependencies.auth import auth_user
from services.user_service import UserService
from services.token_service import TokenService

from environment import JWT_EXPIRY_MINUTES

router = APIRouter(prefix="/api/v1/users", tags=["users"])


def set_access_token_cookie(
    response: Response,
    token_service: TokenService,
    user_id: int,
) -> None:
    access_token = token_service.create_access_token(user_id)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=JWT_EXPIRY_MINUTES * 60,
    )


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201,
    responses={
        409: {"description": "Username or email already exists"},
    },
)
def register(
    response: Response,
    data: UserRegisterRequest,
    service: Annotated[UserService, Depends(get_user_service)],
    token_service: Annotated[TokenService, Depends(get_token_service)],
    db: Annotated[Session, Depends(get_db)],
):
    try:
        user = service.register(db, data)
        set_access_token_cookie(response, token_service, user.id)
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
    response: Response,
    data: UserLoginRequest,
    user_service: Annotated[UserService, Depends(get_user_service)],
    token_service: Annotated[TokenService, Depends(get_token_service)],
    db: Annotated[Session, Depends(get_db)],
):
    try:
        user = user_service.login(db, data.username, data.password)
        set_access_token_cookie(response, token_service, user.id)
        return user
    
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    
@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: Annotated[UserResponse, Depends(auth_user)]):
    return current_user
