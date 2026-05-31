from sqlalchemy.ext.asyncio import AsyncSession
from app.tools.document.vectorstores.pgvector_store import PGVectorStore

class VectorStoreFactory:
    @staticmethod
    def create(
        db: AsyncSession,
        provider: str = "pgvector"
    ):

        provider = provider.lower()

        if provider == "pgvector":
            return PGVectorStore(db)

        raise ValueError(f"Unsupported vector store: {provider}")