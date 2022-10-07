import random
import string
from urllib.parse import quote


def random_avatar():
    spirits = ["micah", "miniavs"]
    seed = quote("".join(random.choice(string.printable) for _ in range(6)), safe="")
    url = f"https://avatars.dicebear.com/api/{random.choice(spirits)}/{seed}.svg"
    return url
