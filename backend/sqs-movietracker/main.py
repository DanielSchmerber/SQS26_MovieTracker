from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from controllers import movie_controller

Base.metadata.create_all(bind=engine)

app = FastAPI()


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
