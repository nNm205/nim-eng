from fastapi import FastAPI 
from pydantic import BaseModel 
from core.orchestrator import orchestrator
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    user_id: int 
    message: str 

@app.post("/chat")
def chat(req: ChatRequest):
    response = orchestrator(req.message, req.user_id)
    return { "response": response }

@app.get("/")
def root():
    return { "status": "ok" }
