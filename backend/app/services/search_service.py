import asyncio 
from typing import Optional
from app.tools.search.factory import SearchToolFactory
from app.tools.search.aggregator import SearchAggregator
from app.tools.search.deduplicator import SearchDeduplicator
from app.tools.search.reranker import SearchReranker
from app.tools.search.schemas.search_result import SearchDocument
from app.utils.constants import SearchSource

class SearchService:
    def __init__(self):
        self.factory = SearchToolFactory()
        self.aggregator = SearchAggregator()
        self.deduplicator = SearchDeduplicator()
        self.reranker = SearchReranker()

    async def search(
        self, 
        query: str,
        max_results: int = 10,
        sources: Optional[list[SearchSource]] = None,
    ) -> list[SearchDocument]:
        # Get tools  
        if not sources:
            tools = self.factory.get_default_tools()
        else:
            tools = self.factory.get_tools(sources)

        # Parallel search 
        tasks = [
            tool.search(
                query=query, 
                max_results=max_results
            ) for tool in tools 
        ]

        results = await asyncio.gather(
            *tasks,
            return_exceptions=True
        )
        
        # Aggregate 
        documents = self.aggregator.aggregate(results)

        # Deduplicate
        documents = self.deduplicator.deduplicate(documents)
        
        # Rerank 
        documents = await self.reranker.rerank(query=query, documents=documents)
        
        return documents[:max_results]

