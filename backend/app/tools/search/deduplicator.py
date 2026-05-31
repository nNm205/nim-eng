import re
from typing import List
from app.tools.search.schemas.search_result import SearchDocument

class SearchDeduplicator:
    @staticmethod
    def normalize_title(title: str) -> str:
        title = title.lower()
        title = re.sub(r"[^a-z0-9\s]", "", title)
        title = re.sub(r"\s+", " ", title)
        return title.strip()

    @classmethod
    def deduplicate(
        cls,
        documents: List[SearchDocument]
    ) -> List[SearchDocument]:
        seen_titles = set()
        unique_documents = []

        for doc in documents:
            normalized_title = cls.normalize_title(doc.title)
            if normalized_title in seen_titles:
                continue

            seen_titles.add(normalized_title)
            unique_documents.append(doc)

        return unique_documents