from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.chunk_embedding import ChunkEmbedding
from app.tools.document.vectorstores.base import BaseVectorStore

class PGVectorStore(BaseVectorStore):
    def __init__(self, db: AsyncSession):
        self.db = db

    async def upsert(
        self,
        chunk_id: UUID,
        vector: list[float],
        model_name: str,
    ) -> ChunkEmbedding:

        embedding = ChunkEmbedding(
            chunk_id=chunk_id,
            embedding=vector,
            embedding_model=model_name,
            embedding_dimension=len(vector),
        )

        self.db.add(embedding)
        await self.db.flush()
        return embedding

    async def upsert_many(
        self,
        chunk_ids: list[UUID],
        vectors: list[list[float]],
        model_name: str,
    ) -> list[ChunkEmbedding]:

        embeddings = []

        for chunk_id, vector in zip(chunk_ids, vectors):
            embeddings.append(
                ChunkEmbedding(
                    chunk_id=chunk_id,
                    embedding=vector,
                    embedding_model=model_name,
                    embedding_dimension=len(vector),
                )
            )

        self.db.add_all(embeddings)
        await self.db.flush()
        return embeddings

    async def similarity_search(
        self,
        query_vector: list[float],
        top_k: int = 5,
    ) -> list[ChunkEmbedding]:

        stmt = (
            select(ChunkEmbedding)
            .order_by(ChunkEmbedding.embedding.cosine_distance(query_vector))
            .limit(top_k)
        )

        result = await self.db.execute(stmt)
        return list(result.scalars().all())