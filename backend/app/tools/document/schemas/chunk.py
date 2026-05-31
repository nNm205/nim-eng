from dataclasses import dataclass
from typing import Optional

@dataclass
class DocumentChunk:
    chunk_id: int
    text: str
    start_char: int
    end_char: int
    metadata: Optional[dict] = None