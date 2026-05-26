from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict 

class ResearchCreate(BaseModel):
    query: str = Field(..., min_length=3, max_length=1000)
    max_results: int = Field(default=10, ge=1, le=50)

class SearchResultResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    title: str
    url: str
    snippet: str | None 
    source: str
    rank: int | None 
    relevance_score: float | None
    created_at: datetime

class ResearchResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    project_id: UUID
    query: str
    status: str
    results_count: int
    started_at: datetime
    completed_at: datetime | None 
    error_message: str | None

class ResearchStatusResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    status: str
    results_count: int
    started_at: datetime
    completed_at: datetime | None 
    error_message: str | None

class ResearchResultsResponse(BaseModel):
    session: ResearchResponse
    results: list[SearchResultResponse]