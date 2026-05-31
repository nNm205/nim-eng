from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.research import ResearchSession, SearchResult
from app.services.search_service import SearchService
from app.tools.search.schemas.search_result import SearchDocument
from app.utils.constants import ResearchStatus
from app.utils.logger import logger


class ResearchAgent:
    """
    Runs a research session end-to-end:
      1. Mark session as RUNNING
      2. Call SearchService (parallel multi-source search + rerank)
      3. Persist each SearchResult to the DB
      4. Mark session as COMPLETED (or FAILED on error)
    """

    def __init__(self, db: AsyncSession):
        self.db = db
        self.search_service = SearchService()

    # ------------------------------------------------------------------
    # Public entry point
    # ------------------------------------------------------------------

    async def run(self, research_session_id: UUID) -> ResearchSession:
        session = await self._get_session(research_session_id)

        try:
            await self._mark_running(session)

            documents = await self.search_service.search(
                query=session.query,
                max_results=session.max_results,
            )

            await self._save_results(session, documents)
            await self._mark_completed(session, results_count=len(documents))

            logger.success(
                f"ResearchAgent completed session {session.id} "
                f"with {len(documents)} results"
            )

        except Exception as e:
            logger.error(f"ResearchAgent failed for session {session.id}: {e}")
            await self._mark_failed(session, error_message=str(e))
            raise

        return session

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    async def _get_session(self, research_session_id: UUID) -> ResearchSession:
        result = await self.db.execute(
            select(ResearchSession).where(ResearchSession.id == research_session_id)
        )
        session = result.scalar_one_or_none()

        if not session:
            raise ValueError(f"ResearchSession not found: {research_session_id}")

        return session

    async def _mark_running(self, session: ResearchSession) -> None:
        session.status = ResearchStatus.RUNNING.value
        await self.db.commit()
        await self.db.refresh(session)
        logger.info(f"ResearchAgent: session {session.id} → RUNNING")

    async def _mark_completed(
        self, session: ResearchSession, results_count: int
    ) -> None:
        session.status = ResearchStatus.COMPLETED.value
        session.results_count = results_count
        session.completed_at = datetime.now(timezone.utc)
        await self.db.commit()
        await self.db.refresh(session)

    async def _mark_failed(
        self, session: ResearchSession, error_message: str
    ) -> None:
        session.status = ResearchStatus.FAILED.value
        session.error_message = error_message
        session.completed_at = datetime.now(timezone.utc)
        await self.db.commit()
        await self.db.refresh(session)

    async def _save_results(
        self,
        session: ResearchSession,
        documents: list[SearchDocument],
    ) -> None:
        """Bulk-insert all SearchResult rows in a single transaction."""
        rows = [
            SearchResult(
                research_session_id=session.id,
                title=doc.title,
                url=doc.url,
                snippet=doc.snippet,
                content_preview=doc.content_preview,
                source=doc.source,
                search_type=doc.search_type,
                authors=doc.authors,
                published_at=doc.published_at,
                doi=doc.doi,
                pdf_url=doc.pdf_url,
                source_id=doc.source_id,
                retrieval_score=doc.retrieval_score,
                relevance_score=doc.relevance_score,
                rank=rank,
                search_query=session.query,
                raw_metadata=doc.raw_metadata,
            )
            for rank, doc in enumerate(documents, start=1)
        ]

        self.db.add_all(rows)
        await self.db.commit()

        logger.info(
            f"ResearchAgent: saved {len(rows)} search results "
            f"for session {session.id}"
        )
