import asyncio
from app.tools.search.schemas.search_result import SearchDocument

class SearchAggregator:
    @staticmethod 
    def aggregate(
        results: list[list[SearchDocument]]
    ) -> list[SearchDocument]:
        documents = []

        for result in results:
            if isinstance(result, Exception):
                print(f"Search tool failed: {result}")
                continue
                
            documents.extend(result)
        
        return documents