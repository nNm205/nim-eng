import uuid 
from pydantic import BaseModel, EmailStr, Field 

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72) 
    full_name: str 

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

class UserResponse(BaseModel):
    id: uuid.UUID 
    email: EmailStr
    full_name: str | None
    avatar_url: str| None 
    subscription_plan: str
    is_active: bool

class TokenResponse(BaseModel):
    access_token: str 
    user: UserResponse