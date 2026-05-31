from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings

# ── Sync engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Async engine
async_database_url = settings.DATABASE_URL.replace(
    "postgresql://", "postgresql+asyncpg://", 1
).replace(
    "postgresql+psycopg2://", "postgresql+asyncpg://", 1
)

async_engine = create_async_engine(
    async_database_url,
    echo=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

async def get_async_db():
    async with AsyncSessionLocal() as session:
        yield session
