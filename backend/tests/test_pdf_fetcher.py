import pytest 
import asyncio
from app.tools.document.fetchers.pdf_fetcher import PDFFetcher

@pytest.mark.asyncio
async def test_pdf_fetcher():
    fetcher = PDFFetcher()
    doc = await fetcher.fetch("https://arxiv.org/pdf/1706.03762.pdf")

    assert doc.local_path is not None 
    assert doc.local_path.exists()
    assert doc.content_type == "application/pdf"

    print(doc.local_path)