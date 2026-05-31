import pytest
from app.tools.search.academic.arxiv_tool import ArxivTool

@pytest.mark.asyncio
async def test_arxiv_search_real():
    tool = ArxivTool()
    results = await tool.search(query="bert", max_results=3)

    assert len(results) > 0
    for r in results:
        print(f"[{r.source_id}] {r.title}")
        print(f"  Authors : {r.authors}")
        print(f"  PDF     : {r.pdf_url}")
        print(f"  Categories: {r.raw_metadata['categories']}\n")