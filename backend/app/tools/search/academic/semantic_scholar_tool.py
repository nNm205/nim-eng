import httpx
import asyncio
from typing import Optional
from app.tools.search.base import BaseSearchTool
from app.tools.search.schemas.search_result import SearchDocument
from app.utils.constants import SearchSource, SearchType

class SemanticScholarTool(BaseSearchTool):
    BASE_URL = "https://api.semanticscholar.org/graph/v1/paper/search"
    FIELDS = ",".join([
        "title",
        "abstract",
        "authors",
        "year",
        "citationCount",
        "url",
        "externalIds",
        "fieldsOfStudy",
        "openAccessPdf"
    ])

    async def search(
        self,
        query: str,
        max_results: int = 10,
        fields: Optional[str] = None, 
        year: Optional[str] = None, 
        fields_of_study: Optional[str] = None, 
        min_citation_count: Optional[int] = None, 
        open_access_pdf: bool = False,
    ) -> list[SearchDocument]:
        params = {
            "query": query,
            "limit": min(max_results, 100),
            "fields": self.FIELDS
        }

        if year: params["year"] = year
        if fields_of_study: params["fieldsOfStudy"] = fields_of_study
        if min_citation_count: params["minCitationCount"] = min_citation_count
        if open_access_pdf: params["openAccessPdf"] = ""

        headers = {
            "User-Agent": "nim-research/1.0"
        }

        async with httpx.AsyncClient(timeout=30) as client:
            response = None 
            retries = 3

            for attempt in range(retries):
                response = await client.get(
                    self.BASE_URL, 
                    params=params,
                    headers=headers
                )

                if response.status_code == 429:
                    wait_time = 2 * attempt 
                    print(f"Rate limited by Semantic Scholar. Retrying in {wait_time}s...")

                    await asyncio.sleep(wait_time)
                    continue 
                
                break 

            response.raise_for_status()
            data = response.json()
            papers = data.get("data", [])
            documents = []

            for paper in papers:
                authors = [author.get("name") for author in paper.get("authors", []) if author.get("name")]
                external_ids = paper.get("externalIds", {})
                pdf_data = paper.get("openAccessPdf")
                pdf_url = pdf_data.get("url") if pdf_data else None 

                documents.append(
                    SearchDocument(
                        title=paper.get("title", ""),
                        url=paper.get("url", ""),
                        snippet=paper.get("abstract"),
                        content_preview=paper.get("abstract"),
                        authors=authors,
                        published_at=None,
                        doi=external_ids.get("DOI"),
                        pdf_url=pdf_url,
                        source=SearchSource.SEMANTIC_SCHOLAR,
                        search_type=SearchType.ACADEMIC,
                        source_id=paper.get("paperId"),
                        retrieval_score=float(
                            paper.get("citationCount", 0)
                        ),
                        raw_metadata={
                            "citation_count": paper.get("citationCount"),
                            "fields_of_study": paper.get("fieldsOfStudy"),
                            "year": paper.get("year")
                        }
                    )
                )

        return documents