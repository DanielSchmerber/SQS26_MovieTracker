import httpx

from environment import TMDB_API


class TMDBClient:

    def __init__(self):
        self.client = httpx.AsyncClient(
            base_url="https://api.themoviedb.org/3/",
            headers={
                "Authorization": f"Bearer {TMDB_API}",
                "Accept": "application/json",
            },
            timeout=10,
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