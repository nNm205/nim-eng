from dataclasses import dataclass
from pathlib import Path
from typing import Optional


@dataclass
class FetchedDocument:
    source_url: str
    local_path: Optional[Path] = None
    raw_content: Optional[str] = None
    content_type: Optional[str] = None