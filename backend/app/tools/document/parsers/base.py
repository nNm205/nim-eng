from abc import ABC, abstractmethod
from pathlib import Path
from app.tools.document.schemas.parsed_document import ParsedDocument

class BaseParser(ABC):
    @abstractmethod
    async def parse(
        self,
        file_path: Path
    ) -> ParsedDocument:
        pass