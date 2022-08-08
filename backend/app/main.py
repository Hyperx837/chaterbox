from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import Config, Server

from app.routes import user
from app.sockets import manager
from app.utils import loop

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


@app.websocket("/ws/{chatroom_id}")
async def websocket_endpoint(websocket: WebSocket, id: int, chatroom_id: int):
    await manager.connect(websocket, chatroom_id, id)
    try:
        while True:
            msg = await websocket.receive_json()
            data = {"message": msg, "userid": id}
            await manager.broadcast("message", data, chatroom_id)

    except WebSocketDisconnect:
        manager.disconnect(id, chatroom_id)
        await manager.broadcast("user.leave", {"userid": id}, chatroom_id)


def main():
    config = Config(app=app, loop=loop, reload=True)
    server = Server(config)
    loop.run_until_complete(server.serve())
