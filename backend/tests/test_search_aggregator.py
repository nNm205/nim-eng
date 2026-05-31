import pytest
from app.tools.search.aggregator import SearchAggregator

@pytest.mark.asyncio
async def test_search_aggregator():
    aggregator = SearchAggregator()

    results = await aggregator.search_all(
        query="medical transformer architecture",
        max_results_per_source=3
    )

    print(f"Total results: {len(results)}")
    for doc in results[:5]:
        print(doc.title)
        print(doc.source)
        print(doc.url)
        print("-" * 50)

    assert len(results) > 0