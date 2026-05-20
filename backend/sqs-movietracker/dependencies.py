from fastapi import Request
from services.movie_service import MovieService
from services.user_service import UserService

# Movie service is stateful due to caching, so we store it in the app state
def get_movie_service(request: Request) -> MovieService:
    return request.app.state.movie_service

# User service is stateless, so we can create a new instance for each request
def get_user_service() -> UserService:
    return UserService()
