import httpx
from app.config import settings
from app.tools.search.base import BaseSearchTool
from app.tools.search.schemas.search_result import SearchDocument
from app.utils.constants import SearchSource, SearchType

class GoogleScholarTool(BaseSearchTool):
    BASE_URL = "https://serpapi.com/search.json"

    async def search(
        self,
        query: str,
        max_results: int = 10,
    ) -> list[SearchDocument]:

        params = {
            "engine": "google_scholar",
            "q": query,
            "api_key": settings.SERP_API_KEY,
            "num": min(max_results, 20),
        }

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
            publication_info = result.get("publication_info", {})
            authors = [
                author.get("name")
                for author in publication_info.get("authors", [])
                if author.get("name")
            ]

            documents.append(
                SearchDocument(
                    title=result.get("title", ""),
                    url=result.get("link", ""),
                    snippet=result.get("snippet"),
                    content_preview=result.get("snippet"),
                    authors=authors,
                    source=SearchSource.GOOGLE_SCHOLAR,
                    search_type=SearchType.ACADEMIC,
                    source_id=result.get("result_id"),
                    retrieval_score=float(
                        result.get("inline_links", {})
                        .get("cited_by", {})
                        .get("total", 0)
                    ),
                    raw_metadata={
                        "publication_info": publication_info,
                        "result_id": result.get("result_id"),
                        "cited_by": (
                            result.get("inline_links", {})
                            .get("cited_by", {})
                        ),
                    }
                )
            )

        return documents