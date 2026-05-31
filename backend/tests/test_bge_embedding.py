import pytest
from pathlib import Path 
from app.tools.document.parsers.pdf_parser import PDFParser 
from app.tools.document.chunkers.recursive_chunker import RecursiveChunker
from app.tools.document.embeddings.bge_embedding import BGEEmbeddingGenerator

@pytest.mark.asyncio
async def test_embedding():
    parser = PDFParser()
    parsed_doc = await parser.parse(
         Path("storage/documents/pdf/4f2d51b8-4e8b-4ebb-b0b3-8bc260625745_1706.03762.pdf")
    )

    chunker = RecursiveChunker()
    chunks = await chunker.chunk(parsed_doc.text)

    embedder = BGEEmbeddingGenerator()
    embedded_chunks = await embedder.embed_chunks(chunks)

    print(len(embedded_chunks[0].embedding))

    assert len(embedded_chunks) > 0

    for idx, e in enumerate(embedded_chunks[:10]):
        print(f"Embedded Chunk {idx + 1}: \nType: {type(e)}\nVector: {e}\n")