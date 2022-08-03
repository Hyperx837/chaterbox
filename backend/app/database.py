import pymongo
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from .logger import logger
from .utils import loop

db_name = "chaterbox"
mongo_url = "mongodb://localhost:27017"

try:
    client = AsyncIOMotorClient(mongo_url, io_loop=loop)

except pymongo.errors.ServerSelectionTimeoutError:
    logger.error("Database Error: Connection time out. start or restart mongod.service")
database: AsyncIOMotorDatabase = client[db_name]
