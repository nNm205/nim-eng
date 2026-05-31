from pathlib import Path
import uuid 
import httpx
from app.tools.document.fetchers.base import BaseFetcher
from app.tools.document.schemas.document import FetchedDocument

class PDFFetcher(BaseFetcher):
    STORAGE_DIR = Path("storage/documents/pdf")

    async def fetch(
        self,
        url: str
    ) -> FetchedDocument:
        async with httpx.AsyncClient(timeout=60, follow_redirects=True) as client:
            res = await client.get(url)
            res.raise_for_status()

            self.STORAGE_DIR.mkdir(
                parents=True,
                exist_ok=True 
            )

            filename = url.split("/")[-1]

            if not filename.endswith(".pdf"):
                filename += ".pdf"

            unique_filename = f"{uuid.uuid4()}_{filename}"

            pdf_path = self.STORAGE_DIR / unique_filename
            pdf_path.write_bytes(res.content)

            return FetchedDocument(
                source_url=url,
                local_path=pdf_path,
                content_type="application/pdf"
            )