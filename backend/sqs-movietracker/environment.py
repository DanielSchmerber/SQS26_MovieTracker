from dotenv import load_dotenv
import os

load_dotenv()

TMDB_API = os.getenv("TMDB_APIKEY")

print(TMDB_API)