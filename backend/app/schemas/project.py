from pydantic import BaseModel, Field, model_validator
from uuid import UUID
from datetime import datetime
from typing import Optional, Any


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    topic: Optional[str] = None
    research_scope: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    topic: Optional[str] = None
    research_scope: Optional[str] = None
    status: Optional[str] = None
    is_archived: Optional[bool] = None


class ProjectResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    description: Optional[str]
    topic: Optional[str]
    research_scope: Optional[str]
    status: str
    is_archived: bool
    created_at: datetime
    updated_at: datetime
    document_count: int = 0
    research_session_count: int = 0
    report_count: int = 0

    model_config = {"from_attributes": True}

    @model_validator(mode="before")
    @classmethod
    def populate_counts(cls, data: Any) -> Any:
        # Only applies when validating from an ORM object (not a dict)
        if isinstance(data, dict):
            return data

        result = {}

        # Copy all scalar fields
        for field in ["id", "user_id", "name", "description", "topic",
                      "research_scope", "status", "is_archived",
                      "created_at", "updated_at"]:
            result[field] = getattr(data, field, None)

        # Count related collections loaded by selectin
        try:
            result["document_count"] = len(data.documents) if data.documents is not None else 0
        except Exception:
            result["document_count"] = 0

        try:
            result["research_session_count"] = len(data.research_sessions) if data.research_sessions is not None else 0
        except Exception:
            result["research_session_count"] = 0

        try:
            result["report_count"] = len(data.reports) if data.reports is not None else 0
        except Exception:
            result["report_count"] = 0

        return result
