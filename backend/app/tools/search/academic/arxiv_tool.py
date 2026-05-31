import asyncio
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime
from app.tools.search.base import BaseSearchTool
from app.tools.search.schemas.search_result import SearchDocument
from app.utils.constants import SearchSource, SearchType

ARXIV_API_URL = "http://export.arxiv.org/api/query"

# Namespace dùng để parse XML
NS = {
    "atom": "http://www.w3.org/2005/Atom",
    "arxiv": "http://arxiv.org/schemas/atom",
}


class ArxivTool(BaseSearchTool):
    async def search(
        self,
        query: str,
        max_results: int = 10,
        start: int = 0,
    ) -> list[SearchDocument]:
        params = urllib.parse.urlencode({
            "search_query": f"all:{query}",
            "start": start,
            "max_results": max_results,
            "sortBy": "relevance",
            "sortOrder": "descending",
        })
        url = f"{ARXIV_API_URL}?{params}"

        xml_data = await self._fetch(url)
        return self._parse_xml(xml_data)

    async def _fetch(
        self,
        url: str,
        max_attempts: int = 5,
    ) -> str:
        last_error: Exception | None = None

        for attempt in range(max_attempts):
            try:
                xml_data = await asyncio.to_thread(self._fetch_sync, url)
                return xml_data

            except urllib.error.HTTPError as e:
                last_error = e
                if e.code == 429:
                    wait = 10 * (2 ** attempt)   # 10s → 20s → 40s → 80s → 160s
                    print(f"[ArxivTool] 429 rate-limited. Retry {attempt + 1}/{max_attempts} sau {wait}s...")
                    await asyncio.sleep(wait)
                else:
                    raise  

            except urllib.error.URLError as e:
                last_error = e
                wait = 5 * (2 ** attempt)
                print(f"[ArxivTool] Network error: {e.reason}. Retry {attempt + 1}/{max_attempts} sau {wait}s...")
                await asyncio.sleep(wait)

        raise last_error

    @staticmethod
    def _fetch_sync(url: str) -> str:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "ResearchApp/1.0"}
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            return response.read().decode("utf-8")

    def _parse_xml(self, xml_data: str) -> list[SearchDocument]:
        root = ET.fromstring(xml_data)
        documents = []

        for entry in root.findall("atom:entry", NS):
            documents.append(self._parse_entry(entry))

        return documents

    def _parse_entry(self, entry: ET.Element) -> SearchDocument:
        # --- các trường cơ bản ---
        title   = (entry.findtext("atom:title",   "", NS) or "").strip()
        summary = (entry.findtext("atom:summary", "", NS) or "").strip()
        entry_id = (entry.findtext("atom:id",     "", NS) or "").strip()

        # --- authors ---
        authors = [
            (author.findtext("atom:name", "", NS) or "").strip()
            for author in entry.findall("atom:author", NS)
        ]

        # --- links: html page + pdf ---
        html_url = entry_id   # mặc định fallback về entry id
        pdf_url: str | None = None

        for link in entry.findall("atom:link", NS):
            rel  = link.get("rel", "")
            typ  = link.get("type", "")
            href = link.get("href", "")
            if rel == "alternate" and typ == "text/html":
                html_url = href
            elif typ == "application/pdf":
                pdf_url = href

        # --- published / updated ---
        published_at = self._parse_dt(entry.findtext("atom:published", "", NS))
        updated_at   = self._parse_dt(entry.findtext("atom:updated",   "", NS))

        # --- categories ---
        categories = [
            cat.get("term", "")
            for cat in entry.findall("atom:category", NS)
        ]

        # --- arxiv-specific metadata ---
        comment     = entry.findtext("arxiv:comment",     None, NS)
        journal_ref = entry.findtext("arxiv:journal_ref", None, NS)
        primary_cat_el = entry.find("arxiv:primary_category", NS)
        primary_cat = primary_cat_el.get("term") if primary_cat_el is not None else None

        # short id: "http://arxiv.org/abs/1810.04805v2" → "1810.04805v2"
        source_id = entry_id.split("/abs/")[-1] if "/abs/" in entry_id else entry_id

        return SearchDocument(
            title=title,
            url=html_url,
            snippet=summary[:500],
            content_preview=summary,
            authors=authors,
            published_at=published_at,
            pdf_url=pdf_url,
            source=SearchSource.ARXIV,
            search_type=SearchType.ACADEMIC,
            source_id=source_id,
            raw_metadata={
                "categories":    categories,
                "primary_category": primary_cat,
                "updated":       updated_at.isoformat() if updated_at else None,
                "comment":       comment,
                "journal_ref":   journal_ref,
            },
        )

    @staticmethod
    def _parse_dt(value: str | None) -> datetime | None:
        if not value:
            return None
        try:
            return datetime.fromisoformat(value.strip().replace("Z", "+00:00"))
        except ValueError:
            return None