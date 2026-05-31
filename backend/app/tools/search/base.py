from abc import ABC, abstractmethod 
from app.tools.search.schemas.search_result import SearchDocument 

class BaseSearchTool(ABC):
    @abstractmethod
    async def search(
        self, 
        query: str,
        max_results: int = 10
    ) -> list[SearchDocument]:
        pass 