from enum import Enum 

class ResearchStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class AnalysisStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class ReportStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

class ReportType(str, Enum):
    LITERATURE_REVIEW = "literature_review"
    DATA_ANALYSIS = "data_analysis"
    RESEARCH_SUMMARY = "research_summary"
    CUSTOM = "custom"

class DocumentSourceType(str, Enum):
    WEB = "web"
    ACADEMIC = "academic"
    UPLOADED = "uploaded"
    PDF = "pdf"

class TaskType(str, Enum):
    RESEARCH = "research"
    ANALYSIS = "analysis"
    REPORT = "report"

class TaskStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"