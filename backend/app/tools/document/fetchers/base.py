from abc import ABC, abstractmethod
from app.tools.document.schemas.document import FetchedDocument

class BaseFetcher(ABC):
    @abstractmethod
    async def fetch(
        self,
        url: str
    ) -> FetchedDocument:
        pass