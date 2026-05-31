from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.tools.document.chunkers.base import BaseChunker
from app.tools.document.schemas.chunk import DocumentChunk

class RecursiveChunker(BaseChunker):
    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
    ):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

    async def chunk(
        self,
        text: str
    ) -> list[DocumentChunk]:

        chunks = self.splitter.split_text(text)

        return [
            DocumentChunk(chunk_id=i, text=chunk, start_char=0, end_char=0)
            for i, chunk in enumerate(chunks)
        ]