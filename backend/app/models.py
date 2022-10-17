from datetime import datetime
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, constr

from app.avatar import random_avatar


class User(BaseModel):
    name: str
    id: int
    avatar: str = Field(default_factory=random_avatar)


class Post(BaseModel):
    id: int
    message: str
    username: str


class Message(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    content: str
    timestamp: datetime
    author: int
