import pytest
from app.services.search_service import SearchService

@pytest.mark.asyncio
async def test_search_service():
    service = SearchService()

    results = await service.search(
        query="transformer architecture in NLP",
        max_results=10
    )

    print("\n===== RESULTS =====\n")

    for i, doc in enumerate(results, start=1):
        print(f"\n[{i}] {doc.title}")
        print(f"Source: {doc.source}")
        print(f"URL: {doc.url}")
        print(f"Score: {doc.relevance_score}")

    assert len(results) > 0