from uuid import UUID 
from datetime import datetime 
from pydantic import BaseModel, Field, ConfigDict
from app.utils.constants import ReportStatus, ReportType

class ReportCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=500)
    report_type: ReportType = ReportType.RESEARCH_SUMMARY
    included_documents: list[UUID] | None = None 

class ReportUpdate(BaseModel):
    title: str = Field(default=None, min_length=3, max_length=500)
    content: str | None = None
    html_content: str | None = None 
    status: ReportStatus | None = None 
    included_documents: list[UUID] | None = None 

class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID 
    project_id: UUID 
    title: str 
    report_type: ReportType
    content: str | None 
    html_content: str | None 
    included_documents: list | None 
    status: ReportStatus
    created_at: datetime 
    updated_at: datetime

class ReportListResponse(BaseModel):
    reports: list[ReportResponse] 