from app.models import Message
from app.database import database as db
from app.sockets import manager
from fastapi import APIRouter, WebSocket

router = APIRouter()


@router.websocket("/direct/{id}")
async def some_action(websocket: WebSocket, id: int):
    msg = await websocket.receive_text()
    reciever = manager.users[id]
    await reciever.send_json(
        {"type": "message.direct", "payload": {"message": msg, "userid": id}}
    )


@router.get("/message/{id}")
async def add_message(message: Message):
    await db.messages.insert_one(message.dict())
