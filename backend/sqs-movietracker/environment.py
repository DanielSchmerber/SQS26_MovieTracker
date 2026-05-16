from dotenv import load_dotenv
import os

load_dotenv()

TMDB_API = os.getenv("TMDB_APIKEY")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

if not TMDB_API:
    raise ValueError("TMDB_APIKEY environment variable is required")
