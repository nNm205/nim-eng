import httpx
import uuid 
import tempfile 
from pathlib import Path 
from app.tools.document.fetchers.base import BaseFetcher
from app.tools.document.schemas.document import FetchedDocument

class HTMLFetcher(BaseFetcher):
    async def fetch(
        self,
        url: str
    ) -> FetchedDocument:
        async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
            headers = {
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/137.0.0.0 Safari/537.36"
                ),
                "Accept": (
                    "text/html,application/xhtml+xml,"
                    "application/xml;q=0.9,*/*;q=0.8"
                ),
                "Accept-Language": "en-US,en;q=0.9",
            }

            res = await client.get(url, headers=headers)
            res.raise_for_status()

            temp_dir = Path(tempfile.gettempdir())
            filename = url.split("/")[-1]

            if not filename.endswith(".html"):
                filename += ".html"

            html_path = temp_dir / filename
            html_path.write_text(res.text, encoding="utf-8")

            return FetchedDocument(
                source_url=url,
                local_path=html_path,
                content_type="text/html"
            )