import os 
from dotenv import load_dotenv

load_dotenv()

PROVIDER = os.getenv("PROVIDER", "groq")
MODEL_NAME = os.getenv("MODEL_NAME")