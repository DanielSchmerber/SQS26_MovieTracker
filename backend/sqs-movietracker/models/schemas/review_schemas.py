from pydantic import BaseModel, Field


class ReviewCreateRequest(BaseModel):
    movie_id: int
    rating: int = Field(ge=1, le=10)
    comment: str | None = Field(default=None, max_length=1000)


class ReviewUpdateRequest(BaseModel):
    rating: int | None = Field(default=None, ge=1, le=10)
    comment: str | None = Field(default=None, max_length=1000)


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    username: str
    movie_id: int
    rating: int
    comment: str | None

    model_config = {"from_attributes": True}