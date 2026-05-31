from abc import ABC, abstractmethod
from app.tools.document.schemas.chunk import DocumentChunk

class BaseChunker(ABC):
    @abstractmethod
    async def chunk(
        self,
        text: str
    ) -> list[DocumentChunk]:
        pass