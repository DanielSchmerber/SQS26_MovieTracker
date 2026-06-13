from pydantic import BaseModel, EmailStr, Field

USERNAME_REGEX = r"^[a-zA-Z0-9_]+$"


class UserRegisterRequest(BaseModel):
    username: str = Field(
        min_length=2,
        max_length=20,
        pattern=USERNAME_REGEX,
    )
    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=128,
    )
    confirm_password: str = Field(
        min_length=8,
        max_length=128,
    )


class UserLoginRequest(BaseModel):
    username: str = Field(
        min_length=2,
        max_length=20,
        pattern=USERNAME_REGEX,
    )
    password: str = Field(
        min_length=8,
        max_length=128,
    )


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    model_config = {
        "from_attributes": True,
        "frozen": True,
    }
