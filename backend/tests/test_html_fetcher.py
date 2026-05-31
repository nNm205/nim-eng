import pytest 
from app.tools.document.fetchers.html_fetcher import HTMLFetcher

@pytest.mark.asyncio
async def test_html_fetcher():
    fetcher = HTMLFetcher()
    doc = await fetcher.fetch(
        "https://openai.com/research"
    )
    
    assert doc.local_path is not None 
    assert doc.local_path.exists()
    assert doc.content_type == "text/html"

    print(doc.local_path)