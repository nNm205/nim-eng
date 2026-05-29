from datetime import datetime, timezone 
from fastapi import HTTPException, status
from sqlalchemy import select  
from sqlalchemy.orm import Session
from app.models.user import User 
from app.schemas.user import (UserLogin, UserRegister, UserResponse, TokenResponse)
from app.utils.security import (hash_password, verify_password, create_access_token)
from app.utils.logger import logger

def register_user(
    user_data: UserRegister,
    db: Session
) -> TokenResponse:
    logger.info(f"Register attempt for email: {user_data.email}")

    # Check existing email 
    result = db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()

    if existing_user: 
        logger.warning(f"Registration failed - email already exists: {user_data.email}")

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    try: 
        password_hash = hash_password(user_data.password)

        new_user = User(
            email=user_data.email,
            password_hash=password_hash,
            full_name=user_data.full_name
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        logger.success(f"User registered successfully: {new_user.email}")

        access_token = create_access_token({
            "sub": new_user.email,
            "user_id": str(new_user.id),
        })

        return TokenResponse(
            access_token=access_token,
            user=UserResponse(
                id=new_user.id,
                email=new_user.email,
                full_name=new_user.full_name,
                avatar_url=new_user.avatar_url, 
                subscription_plan=new_user.subscription_plan,
                is_active=new_user.is_active,
                is_admin=new_user.is_admin
            )
        )
    
    except Exception as e: 
        db.rollback()

        logger.error(f"Registration failed due to server error: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        ) 
    
def login_user(user_data: UserLogin, db: Session) -> TokenResponse:
    logger.info(f"Login attempt for email: {user_data.email}")

    # Find user by email 
    result = db.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none() 

    if not user: 
        logger.warning(f"Login failed - user not found: {user_data.email}")

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    is_valid_password = verify_password(user_data.password, user.password_hash)

    if not is_valid_password:
        logger.warning(f"Login failed - invalid password for: {user_data.email}")

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    user.last_login = datetime.now(timezone.utc)
    db.commit()

    logger.info(f"User logged in successfully: {user.email}")

    # Generate JWT token 
    access_token = create_access_token({
        "sub": user.email,
        "user_id": str(user.id)  
    })

    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            avatar_url=user.avatar_url, 
            subscription_plan=user.subscription_plan,
            is_active=user.is_active,
            is_admin=user.is_admin
        )
    )