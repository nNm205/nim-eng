import pytest
from app.tools.search.academic.semantic_scholar_tool import SemanticScholarTool

@pytest.mark.asyncio
async def test_semantic_scholar_search():
    tool = SemanticScholarTool()

    results = await tool.search(
        query="bert",
        max_results=1
    )

    assert len(results) > 0

    for result in results:
        print("\n===================")
        print("TITLE:", result.title)
        print("AUTHORS:", result.authors)
        print("URL:", result.url)
        print("DOI:", result.metadata)