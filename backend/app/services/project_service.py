from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.utils.logger import logger


def create_project(
    db: Session,
    user_id: UUID,
    project_data: ProjectCreate
) -> Project:

    logger.info(
        f"Creating project '{project_data.name}' "
        f"for user: {user_id}"
    )

    result = db.execute(
        select(Project).where(
            Project.user_id == user_id,
            Project.name == project_data.name
        )
    )

    existing_project = result.scalar_one_or_none()

    if existing_project:

        logger.warning(
            f"Duplicate project name: "
            f"'{project_data.name}' for user {user_id}"
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project name already exists"
        )

    try:
        new_project = Project(
            user_id=user_id,
            **project_data.model_dump()
        )

        db.add(new_project)
        db.commit()
        db.refresh(new_project)

        logger.success(
            f"Project created successfully: "
            f"{new_project.id}"
        )

        return new_project

    except Exception as e:
        db.rollback()

        logger.error(
            f"Project creation failed: {str(e)}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


def get_user_projects(
    db: Session,
    user_id: UUID
) -> list[Project]:

    logger.info(
        f"Fetching projects for user: {user_id}"
    )

    try:
        result = db.execute(
            select(Project)
            .where(Project.user_id == user_id)
            .order_by(Project.created_at.desc())
        )

        projects = result.scalars().all()

        logger.info(
            f"Retrieved {len(projects)} projects "
            f"for user: {user_id}"
        )

        return projects

    except Exception as e:

        logger.error(
            f"Failed to fetch projects "
            f"for user {user_id}: {str(e)}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


def get_project_by_id(
    db: Session,
    project_id: UUID,
    user_id: UUID
) -> Project:

    logger.info(
        f"Fetching project {project_id} "
        f"for user {user_id}"
    )

    result = db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == user_id
        )
    )

    project = result.scalar_one_or_none()

    if not project:

        logger.warning(
            f"Project not found: {project_id}"
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return project


def verify_project_ownership(
    db: Session,
    project_id: UUID,
    user_id: UUID
) -> Project:

    logger.info(
        f"Verifying ownership for project "
        f"{project_id} and user {user_id}"
    )

    result = db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == user_id
        )
    )

    project = result.scalar_one_or_none()

    if not project:

        logger.warning(
            f"Unauthorized project access attempt. "
            f"Project: {project_id}, User: {user_id}"
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return project


def update_project(
    db: Session,
    project: Project,
    update_data: ProjectUpdate
) -> Project:

    logger.info(
        f"Updating project: {project.id}"
    )

    update_dict = update_data.model_dump(
        exclude_unset=True
    )

    try:

        if "name" in update_dict:

            result = db.execute(
                select(Project).where(
                    Project.user_id == project.user_id,
                    Project.name == update_dict["name"],
                    Project.id != project.id
                )
            )

            existing_project = result.scalar_one_or_none()

            if existing_project:

                logger.warning(
                    f"Duplicate project name: "
                    f"{update_dict['name']}"
                )

                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Project name already exists"
                )

        for key, value in update_dict.items():
            setattr(project, key, value)

        db.commit()
        db.refresh(project)

        logger.success(
            f"Project updated successfully: "
            f"{project.id}"
        )

        return project

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()

        logger.error(
            f"Project update failed "
            f"for {project.id}: {str(e)}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


def delete_project(
    db: Session,
    project: Project
) -> None:

    logger.info(
        f"Deleting project: {project.id}"
    )

    try:
        db.delete(project)
        db.commit()

        logger.success(
            f"Project deleted successfully: "
            f"{project.id}"
        )

    except Exception as e:
        db.rollback()

        logger.error(
            f"Project deletion failed "
            f"for {project.id}: {str(e)}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


async def verify_project_ownership_async(
    db,
    project_id: UUID,
    user_id: UUID
) -> Project:
    from sqlalchemy.ext.asyncio import AsyncSession as _AsyncSession

    logger.info(
        f"Verifying ownership for project "
        f"{project_id} and user {user_id}"
    )

    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == user_id
        )
    )

    project = result.scalar_one_or_none()

    if not project:
        logger.warning(
            f"Unauthorized project access attempt. "
            f"Project: {project_id}, User: {user_id}"
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return project
