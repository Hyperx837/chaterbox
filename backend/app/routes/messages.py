from app.models import User
from app.sockets import manager
from fastapi import APIRouter

router = APIRouter(prefix="/messages")


@router.post("/direct/{id}")
async def some_action(id: int, user: User):
    reciever = manager.users[user.id]
    msg = await reciever.receive_text()
    reciever = manager.users[id]
    await reciever.send_json({"type": "message.direct", "payload": {"message": msg}})
