from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend

from database import Base, engine
from controllers import movie_controller
from services.movie_service import MovieService

Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    FastAPICache.init(InMemoryBackend())
    app.state.movie_service = MovieService()
    yield
    await app.state.movie_service.tmdb_client.close()


app = FastAPI(lifespan=lifespan)

# needed until reverse proxy turns frontend and backend into same origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(movie_controller.router)
