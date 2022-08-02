from uvicorn import Config, Server

from .main import app
from .utils import loop

config = Config(app=app, loop=loop)
server = Server(config)
loop.run_until_complete(server.serve())
