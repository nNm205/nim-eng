from uuid import UUID 
from fastapi import HTTPException, status 
from sqlalchemy import select
from sqlalchemy.orm import Session 
from app.models.project import Project
from app.models.research import ResearchSession, SearchResult 
from app.schemas.research import ResearchCreate 
from app.utils.constants import ResearchStatus 
from app.utils.logger import logger

def create_research_session(
    db: Session,
    project_id: UUID,
    research_data: ResearchCreate
) -> ResearchSession:
    logger.info(f"Creating research session for project: {project_id}")

    result = db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()

    if not project:
        logger.warning(f"Project not found: {project_id}")

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    try:
        research_session = ResearchSession(
            project_id=project_id,
            query=research_data.query,
            status=ResearchStatus.PENDING.value 
        )

        db.add(research_session)
        db.commit()
        db.refresh(research_session)

        logger.success(f"Research session created: {research_session.id}")

        return research_session
    except Exception as e:
        db.rollback()

        logger.error(f"Research session creation failed: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        ) 

def get_research_session_by_id(
    db: Session, 
    research_session_id: UUID 
) -> ResearchSession: 
    logger.info(f"Fetching research session: {research_session_id}") 
    result = db.execute( 
        select(ResearchSession).where(ResearchSession.id == research_session_id) 
    ) 
    research_session = result.scalar_one_or_none() 
    
    if not research_session: 
        logger.warning(f"Research session not found: {research_session_id}" ) 
        
        raise HTTPException( 
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Research session not found" 
        ) 
    
    return research_session

def get_project_research_sessions(
    db: Session,
    project_id: UUID 
) -> list[ResearchSession]:
    logger.info(f"Fetching research sessions for project: {project_id}")

    try:
        result = db.execute(
            select(ResearchSession).where(ResearchSession.project_id == project_id)
        ).order_by(ResearchSession.started_at.desc())

        research_sessions = result.scalars().all()

        logger.info(f"Retrieved {len(research_sessions)} research sessions")

        return research_sessions
    except Exception as e: 
        logger.error(f"Failed to fetch research sessions for project {project_id}: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

def create_search_result( 
    db: Session, 
    research_session_id: UUID, 
    title: str, 
    url: str, 
    source: str, 
    snippet: str | None = None, 
    rank: int | None = None, 
    relevance_score: float | None = None, 
    document_id: UUID | None = None 
) -> SearchResult: 
    logger.info(f"Creating search result for research session: {research_session_id}") 
    
    try: 
        search_result = SearchResult( 
            research_session_id=research_session_id, 
            document_id=document_id, 
            title=title, 
            url=url, 
            source=source, 
            snippet=snippet, 
            rank=rank, 
            relevance_score=relevance_score 
        ) 
        
        db.add(search_result) 
        db.commit() 
        db.refresh(search_result) 
        
        logger.success(f"Search result created: {search_result.id}") 
        
        return search_result 
    except Exception as e: 
        db.rollback() 
        
        logger.error(f"Search result creation failed: {str(e)}") 
        
        raise HTTPException( 
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Internal server error" 
        )
    
def update_research_status(
    db: Session, 
    research_session: ResearchSession, 
    status_value: ResearchStatus, 
    error_message: str | None = None 
) -> ResearchSession: 
    logger.info(f"Updating research session status: {research_session.id}") 
    
    try: 
        research_session.status = status_value.value 
        
        if error_message: 
            research_session.error_message = error_message 
        
        db.commit() 
        db.refresh(research_session) 
        
        logger.success(f"Research session status updated: {research_session.id}") 
        
        return research_session 
    except Exception as e: 
        db.rollback() 
        
        logger.error(f"Failed to update research session status for {research_session.id}: {str(e)}") 
        
        raise HTTPException( 
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Internal server error"
        )