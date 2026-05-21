import uuid 
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, Text, DateTime  
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship 
from app.database.base import Base 

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True,
        index=True,  
        default=uuid.uuid4
    )

    email: Mapped[str] = mapped_column(
        String(255), 
        unique=True, 
        index=True,
        nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
        String(255), 
        nullable=False
    )

    full_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True 
    )

    avatar_url: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean, 
        default=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=lambda: datetime.now(timezone.utc),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    last_login: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    subscription_plan: Mapped[str] = mapped_column(
        String(50),
        default="free"
    )

    projects = relationship(
        "Project",
        back_populates="user",
        cascade="all, delete"
    )