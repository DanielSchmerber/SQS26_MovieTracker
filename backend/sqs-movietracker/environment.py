from dotenv import load_dotenv
import os

load_dotenv()

TMDB_API = os.getenv("TMDB_APIKEY")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRY_MINUTES = int(os.getenv("JWT_EXPIRY_MINUTES", "60"))

if not TMDB_API:
    raise ValueError("TMDB_APIKEY environment variable is required")
if not JWT_SECRET:
    raise ValueError("JWT_SECRET environment variable is required")
