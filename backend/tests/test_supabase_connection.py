import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from app.config import settings

@pytest.mark.asyncio
async def test_supabase_connection():
    engine = create_async_engine(settings.DATABASE_URL)

    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT version();"))
            version = result.scalar()

            assert version is not None
            assert "PostgreSQL" in version

            print(f"\nConnected successfully: {version}")
    finally:
        await engine.dispose()