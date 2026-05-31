import pytest
from app.tools.search.academic.google_scholar_tool import GoogleScholarTool

@pytest.mark.asyncio
async def test_arxiv_search_real():
    tool = GoogleScholarTool()
    results = await tool.search("transformer architecture")

    assert len(results) > 0

    for idx, r in enumerate(results):
        print(f"Paper {idx} | Title: {r.title} | Authors: {r.authors} | URL: {r.url}")

