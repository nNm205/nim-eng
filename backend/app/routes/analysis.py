from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.analysis import (
    DocumentAnalysisResponse, 
    AnalysisResultsResponse, 
    AnalysisStatusResponse
)
from app.services.project_service import verify_project_ownership
from app.services.analysis_service import (
    create_document_analysis,
    get_document_analysis_by_id,
    get_document_analysis_by_document,
    get_project_analyses
)
from app.services.document_service import get_document_by_id

router = APIRouter(prefix="/api/v1", tags=["Analysis"])


@router.post(
    "/projects/{project_id}/analyze",
    response_model=DocumentAnalysisResponse,
    status_code=status.HTTP_201_CREATED
)
def start_analysis(
    project_id: UUID,
    document_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_project_ownership(
        db=db,
        project_id=project_id,
        user_id=current_user.id
    )

    document = get_document_by_id(
        db=db,
        document_id=document_id
    )

    if document.project_id != project_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document does not belong to project"
        )

    analysis = create_document_analysis(
        db=db,
        document_id=document_id
    )

    return analysis


@router.get(
    "/projects/{project_id}/analysis/{task_id}",
    response_model=AnalysisStatusResponse
)
def get_analysis_status(
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

    analysis = get_document_analysis_by_id(
        db=db,
        analysis_id=task_id
    )

    if analysis.document.project_id != project_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Analysis does not belong to project"
        )

    return analysis


@router.get(
    "/analysis/{task_id}/results",
    response_model=AnalysisResultsResponse
)
def get_analysis_results(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    analysis = get_document_analysis_by_id(
        db=db,
        analysis_id=task_id
    )

    verify_project_ownership(
        db=db,
        project_id=analysis.document.project_id,
        user_id=current_user.id
    )

    return analysis


@router.get(
    "/documents/{doc_id}/summary"
)
def get_document_summary(
    doc_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    analysis = get_document_analysis_by_document(
        db=db,
        document_id=doc_id
    )

    verify_project_ownership(
        db=db,
        project_id=analysis.document.project_id,
        user_id=current_user.id
    )

    return {
        "summary": analysis.summary
    }


@router.get(
    "/documents/{doc_id}/entities"
)
def get_document_entities(
    doc_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    analysis = get_document_analysis_by_document(
        db=db,
        document_id=doc_id
    )

    verify_project_ownership(
        db=db,
        project_id=analysis.document.project_id,
        user_id=current_user.id
    )

    return {
        "entities": analysis.extracted_entities
    }


@router.get(
    "/projects/{project_id}/analyses",
    response_model=list[DocumentAnalysisResponse]
)
def get_project_analyses_endpoint(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_project_ownership(
        db=db,
        project_id=project_id,
        user_id=current_user.id
    )

    analyses = get_project_analyses(
        db=db,
        project_id=project_id
    )

    return analyses
