import pytest
from pathlib import Path
from app.tools.document.parsers.pdf_parser import PDFParser

@pytest.mark.asyncio
async def test_pdf_parser():
    parser = PDFParser()
    result = await parser.parse(
        Path("storage/documents/pdf/4f2d51b8-4e8b-4ebb-b0b3-8bc260625745_1706.03762.pdf")
    )

    print(result.page_count)
    print(result.text[:1000])
    assert len(result.text) > 0