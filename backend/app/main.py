from fastapi import FastAPI
from app.utils.logger import logger 
from app.routes import auth, projects

app = FastAPI()

app.include_router(auth.router)
app.include_router(projects.router)

@app.get("/")
def root():
    logger.info("Root endpoint accessed")
    
    return {
        "message": "Backend Running"
    }