from uuid import UUID 
from abc import ABC, abstractmethod
from app.models.chunk_embedding import ChunkEmbedding 

class BaseVectorStore(ABC):
    @abstractmethod
    async def upsert(
        self,
        chunk_id: UUID, 
        vectors: list[float],
        model_name: str 
    ) -> ChunkEmbedding:
        pass
    
    @abstractmethod
    async def upsert_many(
        self,
        chunk_ids: list[UUID],
        vectors: list[list[float]],
        model_name: str 
    ) -> list[ChunkEmbedding]:
        pass 

    @abstractmethod
    async def similarity_search(
        self,
        query_vector: list[float],
        top_k: int = 5
    ) -> list[ChunkEmbedding]:
        pass