from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select 
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User 
from app.utils.security import decode_access_token
from app.utils.logger import logger  

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User: 
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )

    # Decode JWT token
    payload = decode_access_token(token)

    if payload is None:
        logger.warning(
            "Authentication failed - invalid token"
        )

        raise credentials_exception

    # Extract user_id from token
    user_id = payload.get("user_id")

    if user_id is None:
        logger.warning(
            "Authentication failed - missing user_id in token"
        )

        raise credentials_exception

    # Find user in database
    result = db.execute(
        select(User).where(User.id == user_id)
    )

    user = result.scalar_one_or_none()

    if user is None:
        logger.warning(
            f"Authentication failed - user not found: {user_id}"
        )

        raise credentials_exception

    # Check if user is active
    if not user.is_active:
        logger.warning(
            f"Authentication failed - inactive user: {user.email}"
        )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive account"
        )

    logger.info(
        f"Authenticated user: {user.email}"
    )

    return user