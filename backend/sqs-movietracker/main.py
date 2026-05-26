from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend
from fastapi_limiter.depends import RateLimiter
from fastapi_pagination import add_pagination
from pyrate_limiter import Duration, Limiter, Rate

from database import Base, engine
from routers import movie_controller, user_controller
from services.movie_service import MovieService

Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    FastAPICache.init(InMemoryBackend())
    app.state.movie_service = MovieService()
    yield
    await app.state.movie_service.tmdb_client.close()


_rate_limiter = RateLimiter(limiter=Limiter(Rate(100, Duration.SECOND  )))
app = FastAPI(lifespan=lifespan, dependencies=[Depends(_rate_limiter)])
add_pagination(app)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


app.include_router(movie_controller.router)
app.include_router(user_controller.router)