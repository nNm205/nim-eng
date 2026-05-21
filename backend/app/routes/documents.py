from uuid import UUID
from fastapi import (
    HTTPException, 
    APIRouter,
    Depends,
    status
)
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.dependencies import get_current_user
from app.schemas.document import (
    DocumentCreate,
    DocumentUpdate,
    DocumentResponse
)
import app.services.project_service as project_service
import app.services.document_service as document_service

router = APIRouter(prefix="/api/v1/projects", tags=["Documents"])

@router.get(
    "/{project_id}/documents",
    response_model=list[DocumentResponse]
)
def get_project_documents(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    project_service.verify_project_ownership(
        db=db,
        project_id=project_id,
        user_id=current_user.id
    )

    return document_service.get_project_documents(
        db=db,
        project_id=project_id
    )
    
@router.post(
    "/{project_id}/documents",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED
)
def create_project_document(
    project_id: UUID,
    document_data: DocumentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    project_service.verify_project_ownership(
        db=db,
        project_id=project_id,
        user_id=current_user.id
    )

    return document_service.create_document(
        db=db,
        project_id=project_id,
        document_data=document_data
    )


@router.get(
    "/{project_id}/documents/{document_id}",
    response_model=DocumentResponse
)
def get_project_document(
    project_id: UUID,
    document_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    project_service.verify_project_ownership(
        db=db,
        project_id=project_id,
        user_id=current_user.id
    )

    document = document_service.verify_document_ownership(
        db=db,
        document_id=document_id,
        user_id=current_user.id
    )

    if document.project_id != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    return document


@router.patch(
    "/{project_id}/documents/{document_id}",
    response_model=DocumentResponse
)
def update_project_document(
    project_id: UUID,
    document_id: UUID,
    update_data: DocumentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    project_service.verify_project_ownership(
        db=db,
        project_id=project_id,
        user_id=current_user.id
    )

    document = document_service.verify_document_ownership(
        db=db,
        document_id=document_id,
        user_id=current_user.id
    )

    if document.project_id != project_id:
        raise document_service.HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    return document_service.update_document(
        db=db,
        document=document,
        update_data=update_data
    )


@router.delete(
    "/{project_id}/documents/{document_id}",
    status_code=status.HTTP_200_OK
)
def delete_project_document(
    project_id: UUID,
    document_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    project_service.verify_project_ownership(
        db=db,
        project_id=project_id,
        user_id=current_user.id
    )

    document = document_service.verify_document_ownership(
        db=db,
        document_id=document_id,
        user_id=current_user.id
    )

    if document.project_id != project_id:
        raise document_service.HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    document_service.delete_document(
        db=db,
        document=document
    )

    return {
        "message": "Document deleted successfully"
    }