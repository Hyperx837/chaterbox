from collections import defaultdict

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from .db import database as db
from .models import User

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# events
# new user, msg, user left


class ConnectionManager:
    def __init__(self):
        self.chatrooms: defaultdict[int, list[WebSocket]] = defaultdict(list)

    async def connect(self, websocket: WebSocket, user_id: int, room_id: int):
        await websocket.accept()
        await self.broadcast({"newuser": user_id}, room_id)
        self.chatrooms[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: int):
        self.chatrooms[room_id].remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: dict | str | bytes, room_id: int):
        for connection in self.chatrooms[room_id]:
            match message.__class__.__name__:
                case "str":
                    await connection.send_text(message)  # type: ignore
                case "bytes":
                    await connection.send_bytes(message)  # type: ignore
                case "dict":
                    await connection.send_json(message)


manager = ConnectionManager()


@app.websocket("/ws/{chatroom_id}")
async def websocket_endpoint(
    websocket: WebSocket, username: str, id: int, chatroom_id: int
):
    await manager.connect(websocket, id, chatroom_id)
    try:
        while True:
            msg = await websocket.receive_json()
            data = {"message": msg, "username": username}
            await manager.broadcast(data, chatroom_id)
            print(manager.chatrooms[chatroom_id])
    except (WebSocketDisconnect):
        manager.disconnect(websocket, chatroom_id)
        await manager.broadcast(f"{username} left the chat", chatroom_id)


@app.post("/adduser")
async def add_user(user: User):
    await db.users.insert_one(user.dict())
    return {"status": "200 OK"}


@app.get("/user/{id}")
async def get_user(id: int):
    ob: dict = await db.users.find_one({"userid": id}, {"_id": 0})
    return ob
