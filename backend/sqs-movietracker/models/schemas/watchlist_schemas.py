from pydantic import BaseModel


class WatchlistAddRequest(BaseModel):
    movie_id: int


class WatchlistEntryResponse(BaseModel):
    id: int
    user_id: int
    movie_id: int

    model_config = {"from_attributes": True}