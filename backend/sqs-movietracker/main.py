from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

class Movie(BaseModel):
    id: str
    title: str
    description: str
    year: int
    poster: str
    cover: str
    tmdbRating: float


# needed until reverse proxy turns frontend and backend into same origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/movie/{movie_id}", response_model=Movie)
async def get_movie(movie_id: str):
    return Movie(
        id=movie_id,
        title="Inception",
        description="A skilled thief is given a chance at redemption if he can successfully perform an inception—planting an idea into a target's subconscious.",
        year=2010,
        poster="https://m.media-amazon.com/images/M/MV5BMjQwNGE0MjctMDA3Yi00MGEyLTkyNTAtMjcxMTYxOWE0ZWRkXkEyXkFqcGc@._V1_.jpg",
        cover="https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
        tmdbRating=8.8,
    )
