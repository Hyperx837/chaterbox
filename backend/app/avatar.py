import random
import string
from urllib.parse import quote


def random_avatar():
    spirits = [
        "male",
        "female",
        "human",
        "jdenticon",
        "avataaars",
        "bottts",
        "gridy",
        "micah",
    ]
    seed = "".join(random.choice(string.printable) for _ in range(6))
    url = quote(
        f"https://avatars.dicebear.com/api/{random.choice(spirits)}/{seed}.svg", safe=""
    )
    return url
