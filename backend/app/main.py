from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import Config, Server

from app.chat import manager
from app.routes import user

from .utils import loop

app = FastAPI()

origins = ["http://localhost:3000"]

app.include_router(user.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# events
# new user, msg, user left


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


def main():
    config = Config(app=app, loop=loop, reload=True)
    server = Server(config)
    loop.run_until_complete(server.serve())
