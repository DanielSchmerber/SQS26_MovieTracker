from typing import Annotated

from fastapi import Request, Depends
from services.movie_service import MovieService
from services.user_service import UserService
from services.token_service import TokenService

# Movie service is stateful due to caching, so we store it in the app state
def get_movie_service(request: Request) -> MovieService:
    return request.app.state.movie_service

# Rest is stateless, so we can create a new instance for each request
def get_token_service() -> TokenService:
    return TokenService()

def get_user_service(token_service: TokenService = Depends(get_token_service)) -> UserService:
    return UserService(token_service)

MovieServiceDep = Annotated[MovieService, Depends(get_movie_service)]
