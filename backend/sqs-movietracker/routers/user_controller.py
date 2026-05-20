from fastapi import APIRouter, HTTPException, Depends, Response, Request
from sqlalchemy.orm import Session

from database import get_db
from dependencies.services import get_token_service, get_user_service
from models.schemas.user_schemas import UserRegisterRequest, UserLoginRequest, UserResponse
from dependencies.auth import auth_user
from services.user_service import UserService
from services.token_service import TokenService

from environment import JWT_EXPIRY_MINUTES

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
    response: Response,
    data: UserLoginRequest,
    user_service: UserService = Depends(get_user_service),
    token_service: TokenService = Depends(get_token_service),
    db: Session = Depends(get_db),
):
    try:
        user = user_service.login(db, data.username, data.password)
        access_token = token_service.create_access_token(user.id)
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,
            samesite="strict",
            max_age=JWT_EXPIRY_MINUTES * 60,
        )

        return user
    
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    
@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: UserResponse = Depends(auth_user)):
    return current_user