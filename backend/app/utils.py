import asyncio

from motor.motor_asyncio import AsyncIOMotorCollection


async def get_doc(coll: AsyncIOMotorCollection, filt: dict):
    # pipeline = [{"$match": filt}, {"$sample": {"size": 1}}]
    try:
        return await coll.find_one(filt)

    except IndexError:
        return None


async def get_random_doc(coll: AsyncIOMotorCollection):
    return await get_doc(coll, {})


loop = asyncio.get_event_loop()
