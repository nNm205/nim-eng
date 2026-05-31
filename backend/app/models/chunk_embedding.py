import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    DateTime,
    ForeignKey
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector
from app.database.base import Base

class ChunkEmbedding(Base):
    __tablename__ = "chunk_embeddings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    chunk_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "document_chunks.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        unique=True
    )

    embedding_model: Mapped[str] = mapped_column(
        nullable=False
    )

    embedding_dimension: Mapped[int] = mapped_column(
        nullable=False
    )

    embedding: Mapped[list[float]] = mapped_column(
        Vector()
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    chunk = relationship(
        "DocumentChunk",
        back_populates="embedding"
    )