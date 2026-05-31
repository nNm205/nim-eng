import pytest
from pathlib import Path 
from app.tools.document.parsers.pdf_parser import PDFParser 
from app.tools.document.chunkers.recursive_chunker import RecursiveChunker

@pytest.mark.asyncio
async def test_recursive_chunker():
    parser = PDFParser()
    parsed_doc = await parser.parse(
         Path("storage/documents/pdf/4f2d51b8-4e8b-4ebb-b0b3-8bc260625745_1706.03762.pdf")
    )

    chunker = RecursiveChunker(
        chunk_size=500,
        chunk_overlap=100
    )

    chunks = await chunker.chunk(parsed_doc.text)

    print(f"Total chunks: {len(chunks)}")

    for chunk in chunks:
        print("=" * 50)
        print(chunk.chunk_id)
        print(chunk.text[:200])

    assert len(chunks) > 1

    for chunk in chunks:
        assert len(chunk.text) > 0