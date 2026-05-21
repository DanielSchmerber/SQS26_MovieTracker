import httpx
from pyrate_limiter import Duration, Rate, limiter_factory
from pyrate_limiter.extras.httpx_limiter import AsyncRateLimiterTransport

from environment import TMDB_API


class TMDBClient:

    def __init__(self):
        limiter = limiter_factory.create_inmemory_limiter(rate_per_duration=40, duration=Duration.SECOND)
        self.client = httpx.AsyncClient(
            base_url="https://api.themoviedb.org/3/",
            headers={
                "Authorization": f"Bearer {TMDB_API}",
                "Accept": "application/json",
            },
            timeout=10,
            transport=AsyncRateLimiterTransport(limiter=limiter),
        )

    async def close(self):
        await self.client.aclose()

    async def get(self, path: str, **params):
        response = await self.client.get(
            path,
            params=params,
        )

        response.raise_for_status()

        return response.json()