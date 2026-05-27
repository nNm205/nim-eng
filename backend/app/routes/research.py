from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.research import (
    ResearchCreate,
    ResearchResponse,
    ResearchStatusResponse,
    ResearchResultsResponse
)
from app.services.project_service import verify_project_ownership
from app.services.research_service import (
    create_research_session,
    get_research_session_by_id
)
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/v1", tags=["Research"])


@router.post(
    "/projects/{project_id}/research",
    response_model=ResearchResponse,
    status_code=status.HTTP_201_CREATED
)
def start_research_session(
    project_id: UUID,
    research_data: ResearchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_project_ownership(
        db=db,
        project_id=project_id,
        user_id=current_user.id
    )

    research_session = create_research_session(
        db=db,
        project_id=project_id,
        research_data=research_data
    )

    return research_session


@router.get(
    "/projects/{project_id}/research/{task_id}",
    response_model=ResearchStatusResponse
)
def get_research_status(
    project_id: UUID,
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_project_ownership(
        db=db,
        project_id=project_id,
        user_id=current_user.id
    )

    research_session = get_research_session_by_id(
        db=db,
        research_session_id=task_id
    )

    return research_session

@router.get(
    "/research/{task_id}/results",
    response_model=ResearchResultsResponse
)
def get_research_results(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    research_session = get_research_session_by_id(
        db=db,
        research_session_id=task_id
    )

    verify_project_ownership(
        db=db,
        project_id=research_session.project_id,
        user_id=current_user.id
    )

    return {
        "session": research_session,
        "results": research_session.search_results
    }


@router.post(
    "/research/{task_id}/save-documents"
)
def save_research_documents():
    return {
        "message": "Save documents endpoint"
    }
