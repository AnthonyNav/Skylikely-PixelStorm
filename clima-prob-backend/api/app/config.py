import os
from dotenv import load_dotenv

load_dotenv()

MODE = os.getenv("MODE", "synthetic")
CACHE_DIR = os.getenv("CACHE_DIR", "./cache")
CACHE_TTL = int(os.getenv("CACHE_TTL", "86400"))
EARTHDATA_USER = os.getenv("EARTHDATA_USER")
EARTHDATA_PASS = os.getenv("EARTHDATA_PASS")
