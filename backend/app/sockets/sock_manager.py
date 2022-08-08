from collections import defaultdict

from fastapi import APIRouter, WebSocket

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.users: dict[int, WebSocket] = {}
        self.chatrooms: defaultdict[int, list[WebSocket]] = defaultdict(list)

    async def connect(self, websocket: WebSocket, room_id: int, userid: int):
        await websocket.accept()
        self.users[userid] = websocket
        self.chatrooms[room_id].append(websocket)

    def disconnect(self, userid: int, room_id: int):
        ws = self.users.pop(userid)
        self.chatrooms[room_id].remove(ws)

    async def send_personal_message(self, message: str, userid: int):
        await self.users[userid].send_text(message)

    async def broadcast(
        self, scope: str, message: dict | str | bytes, room_id: int = None
    ):
        connections = (
            self.users.values() if room_id is None else self.chatrooms[room_id]
        )
        data = {"type": scope, "payload": message}
        for connection in connections:
            match type(message).__name__:
                case "str":
                    await connection.send_text(data)  # type: ignore
                case "bytes":
                    await connection.send_bytes(data)  # type: ignore
                case "dict":
                    await connection.send_json(data)


manager = ConnectionManager()
