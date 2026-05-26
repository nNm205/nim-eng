from fastapi import FastAPI
from app.utils.logger import logger 
from app.routes import auth, projects, documents, research

app = FastAPI()

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(documents.router)
app.include_router(research.router)

@app.get("/")
def root():
    logger.info("Root endpoint accessed")
    
    return {
        "message": "Backend Running"
    }