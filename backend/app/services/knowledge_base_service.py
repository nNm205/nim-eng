from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from app.models.knowledge_base import KnowledgeBaseArticle, KnowledgeBaseSubmission
from app.schemas.knowledge_base import KnowledgeBaseArticleCreate, KnowledgeBaseArticleUpdate, KnowledgeBaseSubmissionCreate, KnowledgeBaseSubmissionReject
from app.utils.logger import logger
from app.utils.constants import KnowledgeBaseArticleStatus, KnowledgeBaseSubmissionStatus
from datetime import datetime, timezone

def create_article(
    db: Session,
    article_data: KnowledgeBaseArticleCreate,
    created_by: UUID | None = None
) -> KnowledgeBaseArticle:
    logger.info(f"Creating knowledge base article: {article_data.title}")

    try:
        article = KnowledgeBaseArticle(
            title=article_data.title,
            excerpt=article_data.excerpt,
            content=article_data.content,
            category=article_data.category,
            tags=article_data.tags,
            created_by=created_by,
            status=KnowledgeBaseArticleStatus.PUBLISHED.value
        )

        db.add(article)
        db.commit()
        db.refresh(article)

        logger.success(f"Knowledge base article created: {article.id}")

        return article

    except Exception as e:
        db.rollback()

        logger.error(f"Article creation failed: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

def get_article_by_id(
    db: Session,
    article_id: UUID
) -> KnowledgeBaseArticle:
    logger.info(f"Fetching article: {article_id}")

    result = db.execute(
        select(KnowledgeBaseArticle).where(
            KnowledgeBaseArticle.id == article_id
        )
    )
    article = result.scalar_one_or_none()

    if not article:
        logger.warning(f"Article not found: {article_id}")

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )

    return article

def get_all_articles(
    db: Session,
    category: str | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 50
) -> tuple[list[KnowledgeBaseArticle], int]:
    logger.info(f"Fetching articles - category: {category}, search: {search}")

    try:
        # Build conditions list to reuse for both count and data queries
        base_conditions = [
            KnowledgeBaseArticle.status == KnowledgeBaseArticleStatus.PUBLISHED.value
        ]

        if category and category != "all":
            base_conditions.append(KnowledgeBaseArticle.category == category)

        if search:
            search_term = f"%{search}%"
            base_conditions.append(
                (KnowledgeBaseArticle.title.ilike(search_term)) |
                (KnowledgeBaseArticle.excerpt.ilike(search_term)) |
                (KnowledgeBaseArticle.content.ilike(search_term))
            )

        # Get total count using the same conditions
        count_query = select(func.count()).select_from(KnowledgeBaseArticle)
        for condition in base_conditions:
            count_query = count_query.where(condition)
        total = db.execute(count_query).scalar() or 0

        # Get paginated results
        query = select(KnowledgeBaseArticle)
        for condition in base_conditions:
            query = query.where(condition)
        query = query.order_by(KnowledgeBaseArticle.created_at.desc())
        query = query.offset(skip).limit(limit)

        result = db.execute(query)
        articles = result.scalars().all()

        logger.success(f"Retrieved {len(articles)} articles")

        return articles, total

    except Exception as e:
        logger.error(f"Failed to fetch articles: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

def get_categories_with_counts(
    db: Session
) -> dict[str, int]:
    logger.info("Fetching article categories with counts")

    try:
        result = db.execute(
            select(
                KnowledgeBaseArticle.category,
                func.count(KnowledgeBaseArticle.id).label("count")
            ).where(KnowledgeBaseArticle.status == KnowledgeBaseArticleStatus.PUBLISHED.value)
            .group_by(KnowledgeBaseArticle.category)
        )

        categories = {}
        for category, count in result.all():
            categories[category] = count

        logger.success(f"Retrieved {len(categories)} categories")

        return categories

    except Exception as e:
        logger.error(f"Failed to fetch categories: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

def update_article(
    db: Session,
    article: KnowledgeBaseArticle,
    update_data: KnowledgeBaseArticleUpdate
) -> KnowledgeBaseArticle:
    logger.info(f"Updating article: {article.id}")

    update_dict = update_data.model_dump(exclude_unset=True)

    try:
        for key, value in update_dict.items():
            setattr(article, key, value)

        db.commit()
        db.refresh(article)

        logger.success(f"Article updated: {article.id}")

        return article

    except Exception as e:
        db.rollback()

        logger.error(f"Article update failed for {article.id}: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

def delete_article(
    db: Session,
    article: KnowledgeBaseArticle
) -> None:
    logger.info(f"Deleting article: {article.id}")

    try:
        db.delete(article)
        db.commit()

        logger.success(f"Article deleted: {article.id}")

    except Exception as e:
        db.rollback()

        logger.error(f"Article deletion failed for {article.id}: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

def increment_article_views(
    db: Session,
    article: KnowledgeBaseArticle
) -> KnowledgeBaseArticle:
    logger.info(f"Incrementing views for article: {article.id}")

    try:
        article.views += 1
        db.commit()
        db.refresh(article)

        return article

    except Exception as e:
        db.rollback()

        logger.error(f"Failed to increment views for {article.id}: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

# Submission functions
def create_submission(
    db: Session,
    submission_data: KnowledgeBaseSubmissionCreate,
    created_by: UUID
) -> KnowledgeBaseSubmission:
    logger.info(f"Creating submission: {submission_data.title}")

    try:
        submission = KnowledgeBaseSubmission(
            title=submission_data.title,
            excerpt=submission_data.excerpt,
            content=submission_data.content,
            category=submission_data.category,
            tags=submission_data.tags,
            created_by=created_by,
            status=KnowledgeBaseSubmissionStatus.PENDING.value
        )

        db.add(submission)
        db.commit()
        db.refresh(submission)

        logger.success(f"Submission created: {submission.id}")

        return submission

    except Exception as e:
        db.rollback()

        logger.error(f"Submission creation failed: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

def get_submission_by_id(
    db: Session,
    submission_id: UUID
) -> KnowledgeBaseSubmission:
    logger.info(f"Fetching submission: {submission_id}")

    result = db.execute(
        select(KnowledgeBaseSubmission).where(
            KnowledgeBaseSubmission.id == submission_id
        )
    )
    submission = result.scalar_one_or_none()

    if not submission:
        logger.warning(f"Submission not found: {submission_id}")

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )

    return submission

def get_pending_submissions(
    db: Session,
    skip: int = 0,
    limit: int = 50
) -> tuple[list[KnowledgeBaseSubmission], int]:
    logger.info("Fetching pending submissions")

    try:
        query = select(KnowledgeBaseSubmission).where(
            KnowledgeBaseSubmission.status == KnowledgeBaseSubmissionStatus.PENDING.value
        )

        # Get total count
        count_result = db.execute(
            select(func.count()).select_from(KnowledgeBaseSubmission).where(
                KnowledgeBaseSubmission.status == KnowledgeBaseSubmissionStatus.PENDING.value
            )
        )
        total = count_result.scalar() or 0

        # Get paginated results
        query = query.order_by(KnowledgeBaseSubmission.created_at.desc())
        query = query.offset(skip).limit(limit)

        result = db.execute(query)
        submissions = result.scalars().all()

        logger.success(f"Retrieved {len(submissions)} pending submissions")

        return submissions, total

    except Exception as e:
        logger.error(f"Failed to fetch submissions: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

def get_user_submissions(
    db: Session,
    user_id: UUID,
    skip: int = 0,
    limit: int = 50
) -> tuple[list[KnowledgeBaseSubmission], int]:
    logger.info(f"Fetching submissions for user: {user_id}")

    try:
        query = select(KnowledgeBaseSubmission).where(
            KnowledgeBaseSubmission.created_by == user_id
        )

        # Get total count
        count_result = db.execute(
            select(func.count()).select_from(KnowledgeBaseSubmission).where(
                KnowledgeBaseSubmission.created_by == user_id
            )
        )
        total = count_result.scalar() or 0

        # Get paginated results
        query = query.order_by(KnowledgeBaseSubmission.created_at.desc())
        query = query.offset(skip).limit(limit)

        result = db.execute(query)
        submissions = result.scalars().all()

        logger.success(f"Retrieved {len(submissions)} submissions for user")

        return submissions, total

    except Exception as e:
        logger.error(f"Failed to fetch user submissions: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

def approve_submission(
    db: Session,
    submission: KnowledgeBaseSubmission,
    reviewed_by: UUID
) -> KnowledgeBaseArticle:
    logger.info(f"Approving submission: {submission.id}")

    try:
        # Create published article from submission
        article = KnowledgeBaseArticle(
            title=submission.title,
            excerpt=submission.excerpt,
            content=submission.content,
            category=submission.category,
            tags=submission.tags,
            created_by=submission.created_by,
            status=KnowledgeBaseArticleStatus.PUBLISHED.value
        )

        db.add(article)

        # Update submission status
        submission.status = KnowledgeBaseSubmissionStatus.APPROVED.value
        submission.reviewed_by = reviewed_by
        submission.reviewed_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(article)
        db.refresh(submission)

        logger.success(f"Submission approved: {submission.id}")

        return article

    except Exception as e:
        db.rollback()

        logger.error(f"Submission approval failed for {submission.id}: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

def reject_submission(
    db: Session,
    submission: KnowledgeBaseSubmission,
    rejection_data: KnowledgeBaseSubmissionReject,
    reviewed_by: UUID
) -> KnowledgeBaseSubmission:
    logger.info(f"Rejecting submission: {submission.id}")

    try:
        submission.status = KnowledgeBaseSubmissionStatus.REJECTED.value
        submission.rejection_reason = rejection_data.rejection_reason
        submission.reviewed_by = reviewed_by
        submission.reviewed_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(submission)

        logger.success(f"Submission rejected: {submission.id}")

        return submission

    except Exception as e:
        db.rollback()

        logger.error(f"Submission rejection failed for {submission.id}: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
