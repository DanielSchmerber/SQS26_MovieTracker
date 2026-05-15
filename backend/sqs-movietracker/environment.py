from dotenv import load_dotenv
import os

load_dotenv()

TMDB_API = os.getenv("TMDB_APIKEY")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

if not TMDB_API:
    raise ValueError("TMDB_APIKEY environment variable is required")
