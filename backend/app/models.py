from datetime import datetime
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

from app.avatar import random_avatar


class User(BaseModel):
    username: str
    id: int
    avatar_url: str = Field(default_factory=random_avatar)


class Post(BaseModel):
    id: int
    message: str
    username: str


class Message(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    content: str
    timestamp: datetime
    author: User
