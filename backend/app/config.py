from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str 
    DEBUG: bool 

    # LLM 
    GROQ_API_KEY: str
    PROVIDER: str
    MODEL_NAME: str

    # Database
    DATABASE_URL: str

    # JWT
    JWT_SECRET_KEY: str                  
    JWT_ALGORITHM: str           
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # Redis
    REDIS_URL: str 

    class Config: 
        env_file = ".env"

settings = Settings()