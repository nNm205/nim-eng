import uuid 
from datetime import datetime, timezone
from sqlalchemy import (
    String, 
    Text,
    ForeignKey,
    DateTime,
    Index
)
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base
from app.utils.constants import AnalysisStatus

class DocumentAnalysis(Base):
    __tablename__ = "document_analyses"

    __table_args__ = (
        Index("idx_document_analyses_document_id", "document_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        default=uuid.uuid4
    )

    document_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        unique=True 
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default=AnalysisStatus.PENDING.value 
    )

    summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    key_findings: Mapped[list | None] = mapped_column(
        JSONB,
        nullable=True 
    )

    extracted_entities: Mapped[dict | list | None] = mapped_column(
        JSONB,
        nullable=True
    )

    extracted_tables: Mapped[list | None] = mapped_column(
        JSONB,
        nullable=True 
    )

    keywords: Mapped[list[str] | None] = mapped_column(
        ARRAY(Text),
        nullable=True 
    )

    sentiment: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    analysis_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    processed_by: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    # relationships
    document = relationship(
        "Document",
        back_populates="analysis",
        lazy="selectin"
    )