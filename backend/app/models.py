from pydantic import BaseModel


class User(BaseModel):
    username: str
    id: int
    # avatar_url: str


class Message(BaseModel):
    message: str
    username: str
    time: int
    id: int


class Post(BaseModel):
    id: int
    message: str
    username: str
