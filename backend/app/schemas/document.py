import uuid 
from pydantic import BaseModel
from datetime import datetime

class DocumentCreate(BaseModel):
    title: str
    source_url: str | None = None
    source_type: str | None = None
    content: str | None = None

class DocumentUpdate(BaseModel):
    title: str | None = None
    source_url: str | None = None
    source_type: str | None = None
    content: str | None = None
    processed: bool | None = None
    relevance_score: float | None = None

class DocumentResponse(BaseModel):
    id: uuid.UUID 
    project_id: uuid.UUID 
    title: str
    source_url: str | None 
    source_type: str | None 
    content: str | None
    file_path: str | None 
    processed: bool
    relevance_score: float | None 
    created_at: datetime
    class Config:
        from_attributes = True
