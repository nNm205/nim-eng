import httpx
from typing import Optional
from app.config import settings
from app.tools.search.base import BaseSearchTool
from app.tools.search.schemas.search_result import SearchDocument
from app.utils.constants import SearchSource, SearchType

class SerpAPIWebTool(BaseSearchTool):
    BASE_URL = "https://serpapi.com/search.json"

    async def search(
        self,
        query: str,
        max_results: int = 10,
        location: Optional[str] = None,
        language: str = "en",
        country: str = "us",
    ) -> list[SearchDocument]:

        params = {
            "engine": "google",
            "q": query,
            "api_key": settings.SERP_API_KEY,
            "num": min(max_results, 100),
            "hl": language,
            "gl": country,
        }

        if location: params["location"] = location

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                self.BASE_URL,
                params=params
            )

        response.raise_for_status()
        data = response.json()

        organic_results = data.get("organic_results", [])
        documents = []

        for result in organic_results:
            documents.append(
                SearchDocument(
                    title=result.get("title", ""),
                    url=result.get("link", ""),
                    snippet=result.get("snippet"),
                    content_preview=result.get("snippet"),
                    source=SearchSource.WEB,
                    search_type=SearchType.WEB,
                    source_id=str(result.get("position")),
                    retrieval_score=None,
                    raw_metadata={
                        "position": result.get("position"),
                        "displayed_link": result.get("displayed_link"),
                        "favicon": result.get("favicon"),
                        "date": result.get("date"),
                    }
                )
            )

        return documents
