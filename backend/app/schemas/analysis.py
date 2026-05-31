from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.utils.constants import AnalysisStatus


class AnalysisCreate(BaseModel):
    document_id: UUID


class DocumentAnalysisResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    document_id: UUID
    status: AnalysisStatus
    summary: str | None
    key_findings: list | None
    extracted_entities: dict | list | None
    extracted_tables: list | None
    keywords: list[str] | None
    sentiment: str | None
    started_at: datetime
    completed_at: datetime | None
    error_message: str | None
    processed_by: str | None


class AnalysisStatusResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    document_id: UUID
    status: AnalysisStatus
    started_at: datetime
    completed_at: datetime | None
    error_message: str | None


class AnalysisResultsResponse(DocumentAnalysisResponse):
    pass
