import time
from collections import defaultdict

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from starlette import websockets

app = FastAPI()


class User(BaseModel):
    message: str
    username: str
    time: int
    id: int


class Post(BaseModel):
    id: int
    message: str
    username: str


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.chatrooms: defaultdict[int, list[WebSocket]] = defaultdict(list)

    async def connect(self, websocket: WebSocket, id: int):
        await websocket.accept()
        self.chatrooms[id].append(websocket)
        print(self.chatrooms[id])
        # self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket, id):
        self.chatrooms[id].remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: dict | str | bytes, id: int):
        for connection in self.chatrooms[id]:
            match message.__class__.__name__:
                case "str":
                    await connection.send_text(message)
                case "bytes":
                    await connection.send_bytes(message)
                case "dict":
                    await connection.send_json(message)


manager = ConnectionManager()


@app.websocket("/ws/{chatroom_id}")
async def websocket_endpoint(
    websocket: WebSocket, username: str, id: int, chatroom_id: int
):
    await manager.connect(websocket, chatroom_id)
    try:
        while True:
            msg = await websocket.receive_json()
            data = {"message": msg, "username": username}
            await manager.broadcast(data, chatroom_id)
            print(manager.chatrooms[chatroom_id])
    except (WebSocketDisconnect):
        manager.disconnect(websocket, chatroom_id)
        await manager.broadcast(f"{username} left the chat", chatroom_id)
