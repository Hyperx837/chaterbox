from app.chat import manager
from app.database import database as db
from app.models import User
from fastapi import APIRouter

router = APIRouter()


@router.post("/adduser")
async def add_user(user: User):
    await db.users.insert_one(user.dict())
    await manager.broadcast({"user.new": user.userid})
    return {"status": "200 OK"}


@router.get("/user/{id}")
async def get_user(id: int) -> dict:
    return await db.users.find_one({"userid": id}, {"_id": 0})
