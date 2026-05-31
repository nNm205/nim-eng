from dataclasses import dataclass
from app.tools.document.schemas.chunk import DocumentChunk

@dataclass
class EmbeddedChunk:
    chunk: DocumentChunk
    embedding: list[float]