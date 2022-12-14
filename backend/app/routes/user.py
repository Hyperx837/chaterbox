from app.sockets import manager
from app.database import database as db
from app.logger import logger
from app.models import User
from fastapi import APIRouter

router = APIRouter(prefix="/user")


@router.post("/new")
async def add_user(user: User):
    await db.users.insert_one(user.dict())
    await manager.broadcast("user.new", {"userid": user.id})
    return user


@router.get("/online")
async def get_online_users():
    return [*manager.users.keys()]


@router.get("/{id}")
async def get_user(id: int) -> dict:
    return await db.users.find_one({"id": id}, {"_id": 0})
