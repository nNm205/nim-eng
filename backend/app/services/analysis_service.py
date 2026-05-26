from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.document import Document
from app.models.analysis import DocumentAnalysis
from app.utils.constants import AnalysisStatus
from app.utils.logger import logger

def create_document_analysis(
    db: Session,
    document_id: UUID
) -> DocumentAnalysis:
    logger.info(f"Creating analysis for document: {document_id}")

    result = db.execute(
        select(Document).where(Document.id == document_id)
    )
    document = result.scalar_one_or_none()

    if not document:
        logger.warning(f"Document not found: {document_id}")

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    existing_analysis_result = db.execute(
        select(DocumentAnalysis).where(
            DocumentAnalysis.document_id == document_id
        )
    )
    existing_analysis = existing_analysis_result.scalar_one_or_none()

    if existing_analysis:
        logger.warning(f"Analysis already exists for document: {document_id}")

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document analysis already exists"
        )

    try:
        analysis = DocumentAnalysis(
            document_id=document_id,
            status=AnalysisStatus.PENDING.value
        )

        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        logger.success(f"Document analysis created: {analysis.id}")

        return analysis

    except Exception as e:
        db.rollback()

        logger.error(f"Document analysis creation failed: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


def get_document_analysis_by_id(
    db: Session,
    analysis_id: UUID
) -> DocumentAnalysis:
    logger.info(f"Fetching analysis: {analysis_id}")

    result = db.execute(
        select(DocumentAnalysis).where(
            DocumentAnalysis.id == analysis_id
        )
    )
    analysis = result.scalar_one_or_none()

    if not analysis:
        logger.warning(f"Analysis not found: {analysis_id}")

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )

    return analysis

def get_document_analysis_by_document(
    db: Session,
    document_id: UUID
) -> DocumentAnalysis:
    logger.info(f"Fetching analysis for document: {document_id}")

    result = db.execute(
        select(DocumentAnalysis).where(
            DocumentAnalysis.document_id == document_id
        )
    )
    analysis = result.scalar_one_or_none()

    if not analysis:
        logger.warning(f"Analysis not found for document: {document_id}")

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document analysis not found"
        )

    return analysis


def update_analysis_status(
    db: Session,
    analysis: DocumentAnalysis,
    status_value: AnalysisStatus,
    error_message: str | None = None
) -> DocumentAnalysis:
    logger.info(f"Updating analysis status: {analysis.id}")

    try:
        analysis.status = status_value.value

        if error_message:
            analysis.error_message = error_message

        db.commit()
        db.refresh(analysis)

        logger.success(f"Analysis status updated: {analysis.id}")

        return analysis

    except Exception as e:
        db.rollback()

        logger.error(f"Failed to update analysis status for {analysis.id}: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

def save_analysis_results(
    db: Session,
    analysis: DocumentAnalysis,
    summary: str | None = None,
    key_findings: list | None = None,
    extracted_entities: dict | list | None = None,
    extracted_tables: list | None = None,
    keywords: list[str] | None = None,
    sentiment: str | None = None,
    processed_by: str | None = None
) -> DocumentAnalysis:

    logger.info(f"Saving analysis results for: {analysis.id}")

    try:
        analysis.summary = summary
        analysis.key_findings = key_findings
        analysis.extracted_entities = extracted_entities
        analysis.extracted_tables = extracted_tables
        analysis.keywords = keywords
        analysis.sentiment = sentiment
        analysis.processed_by = processed_by
        analysis.status = AnalysisStatus.COMPLETED.value

        db.commit()
        db.refresh(analysis)

        logger.success(f"Analysis results saved: {analysis.id}")

        return analysis

    except Exception as e:
        db.rollback()

        logger.error(f"Failed to save analysis results for {analysis.id}: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

def delete_document_analysis(
    db: Session,
    analysis: DocumentAnalysis
) -> None:
    logger.info(f"Deleting analysis: {analysis.id}")

    try:
        db.delete(analysis)
        db.commit()

        logger.success(f"Analysis deleted successfully: {analysis.id}")

    except Exception as e:
        db.rollback()

        logger.error(f"Analysis deletion failed for {analysis.id}: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
