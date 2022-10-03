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
