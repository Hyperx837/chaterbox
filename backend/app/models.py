from app.avatar import random_avatar
from pydantic import BaseModel, Field


class User(BaseModel):
    username: str
    id: int
    avatar_url: str = Field(default_factory=random_avatar)


class Message(BaseModel):
    message: str
    username: str
    time: int
    id: int


class Post(BaseModel):
    id: int
    message: str
    username: str
