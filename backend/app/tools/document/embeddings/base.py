from abc import ABC, abstractmethod
from app.tools.document.schemas.chunk import DocumentChunk
from app.tools.document.schemas.embedded_chunk import EmbeddedChunk

class BaseEmbeddingGenerator(ABC):
    @abstractmethod
    async def embed_chunks(
        self,
        chunks: list[DocumentChunk]
    ) -> list[EmbeddedChunk]:
        pass