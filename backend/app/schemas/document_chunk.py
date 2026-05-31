from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from pydantic import ConfigDict

class DocumentChunkResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    document_id: UUID
    chunk_index: int
    content: str
    token_count: int | None
    relevance_score: float | None
    created_at: datetime