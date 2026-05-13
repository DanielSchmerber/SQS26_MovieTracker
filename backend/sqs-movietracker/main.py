from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from controllers import movie_controller

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(movie_controller.router)
