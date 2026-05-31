from dataclasses import dataclass
from typing import Optional

@dataclass
class ParsedDocument:
    text: str
    page_count: int
    title: Optional[str] = None
    author: Optional[str] = None
    metadata: Optional[dict] = None