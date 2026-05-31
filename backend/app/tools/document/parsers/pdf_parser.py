from pathlib import Path
import fitz
from app.tools.document.parsers.base import BaseParser
from app.tools.document.schemas.parsed_document import ParsedDocument

class PDFParser(BaseParser):
    async def parse(
        self,
        file_path: Path
    ) -> ParsedDocument:
        doc = fitz.open(file_path)
        pages_text = []

        for page in doc:
            pages_text.append(page.get_text())

        text = "\n".join(pages_text)
        metadata = doc.metadata or {}

        return ParsedDocument(
            text=text,
            page_count=len(doc),
            title=metadata.get("title"),
            author=metadata.get("author"),
            metadata=metadata
        )