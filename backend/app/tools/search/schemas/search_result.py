from dataclasses import dataclass, field 
from datetime import datetime
from typing import Optional, Any 
from uuid import UUID 
from app.utils.constants import SearchType, SearchSource

@dataclass
class SearchDocument:
    title: str 
    url: str
    source: SearchSource
    search_type: SearchType
    snippet: Optional[str] = None 
    content_preview: Optional[str] = None 
    authors: Optional[list[str]] = None 
    published_at: Optional[datetime] = None 
    doi: Optional[str] = None
    pdf_url: Optional[str] = None
    source_id: Optional[str] = None
    retrieval_score: Optional[float] = None
    relevance_score: Optional[float] = None
    raw_metadata: Optional[dict[str, Any]] = field(default_factory=dict)