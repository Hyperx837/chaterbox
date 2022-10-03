from app.chat import manager
from app.database import database as db
from fastapi import APIRouter

router = APIRouter(prefix="/user")


@router.post("/someroute")
async def some_action():
    pass
