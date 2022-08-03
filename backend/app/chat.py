from collections import defaultdict

from fastapi import APIRouter, WebSocket

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.users: list[WebSocket] = []
        self.chatrooms: defaultdict[int, list[WebSocket]] = defaultdict(list)

    async def connect(self, websocket: WebSocket, room_id: int):
        await websocket.accept()
        self.users.append(websocket)
        self.chatrooms[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: int):
        self.users.remove(websocket)
        self.chatrooms[room_id].remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: dict | str | bytes, room_id: int = None):
        connections = self.users if room_id is None else self.chatrooms[room_id]
        for connection in connections:
            match message.__class__.__name__:
                case "str":
                    await connection.send_text(message)  # type: ignore
                case "bytes":
                    await connection.send_bytes(message)  # type: ignore
                case "dict":
                    await connection.send_json(message)


manager = ConnectionManager()
