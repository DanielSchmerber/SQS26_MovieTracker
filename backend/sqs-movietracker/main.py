from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend
from fastapi_limiter.depends import RateLimiter
from fastapi import Query as QueryField
from fastapi_pagination import add_pagination, Page
from fastapi_pagination.customization import CustomizedPage, UseParamsFields
from pyrate_limiter import Duration, Limiter, Rate

from database import Base, engine
from routers import movie_controller, user_controller, watchlist_controller
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
Page = CustomizedPage[Page, UseParamsFields(size=QueryField(20, ge=1, le=20))]
add_pagination(app)


app.include_router(movie_controller.router)
app.include_router(user_controller.router)
app.include_router(watchlist_controller.router)