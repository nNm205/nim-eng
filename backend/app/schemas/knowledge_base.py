from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class UserInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    full_name: str | None
    email: str

class KnowledgeBaseArticleCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str
    tags: list[str] | None = None

class KnowledgeBaseArticleUpdate(BaseModel):
    title: str | None = None
    excerpt: str | None = None
    content: str | None = None
    category: str | None = None
    tags: list[str] | None = None

class KnowledgeBaseArticleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    title: str
    excerpt: str
    content: str
    category: str
    tags: list[str] | None
    status: str
    views: int
    created_by: UUID | None
    creator: UserInfo | None
    created_at: datetime
    updated_at: datetime

class KnowledgeBaseArticleListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    articles: list[KnowledgeBaseArticleResponse]
    total: int
    categories: dict[str, int]

# Submission schemas
class KnowledgeBaseSubmissionCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str
    tags: list[str] | None = None

class KnowledgeBaseSubmissionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    title: str
    excerpt: str
    content: str
    category: str
    tags: list[str] | None
    status: str
    created_by: UUID
    creator: UserInfo
    rejection_reason: str | None
    reviewed_by: UUID | None
    reviewed_at: datetime | None
    created_at: datetime
    updated_at: datetime

class KnowledgeBaseSubmissionListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    submissions: list[KnowledgeBaseSubmissionResponse]
    total: int

class KnowledgeBaseSubmissionApprove(BaseModel):
    pass

class KnowledgeBaseSubmissionReject(BaseModel):
    rejection_reason: str
