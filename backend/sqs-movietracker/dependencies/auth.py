from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from database import get_db
from dependencies.services import get_user_service
from services.user_service import UserService


def auth_user(
    request: Request,
    db: Session = Depends(get_db),
    user_service: UserService = Depends(get_user_service),
):
    token = request.cookies.get("access_token")

    try:
        return user_service.get_current_user(db, token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))