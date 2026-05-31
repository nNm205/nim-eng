import pytest
from app.tools.search.web.serpapi_web_tool import SerpAPIWebTool

@pytest.mark.asyncio
async def test_serpapi_web_search():
    tool = SerpAPIWebTool()

    results = await tool.search(
        query="latest transformer models",
        max_results=5
    )

    assert len(results) > 0

    for idx, r in enumerate(results):
        print("\n")
        print("=" * 50)
        print(f"Result {idx}")
        print(f"Title: {r.title}")
        print(f"URL: {r.url}")
        print(f"Snippet: {r.snippet}")

