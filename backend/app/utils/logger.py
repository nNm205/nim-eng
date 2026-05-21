from loguru import logger 
import sys 
from pathlib import Path 

# Create logs directory 
LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

# Remove default logger 
logger.remove()

# Console logger 
logger.add(
    sys.stdout,
    format=(
        "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
        "<level>{level}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
        "<level>{message}</level>"
    ),
    level="INFO",
    colorize=True,
    enqueue=True
)

# File logger 
logger.add(
    "logs/app.log",
    rotation="10 MB",
    retention="10 days",
    compression="zip",
    level="DEBUG",
    encoding="utf-8",
    enqueue=True
)

# Error logger 
logger.add(
    "logs/error.log",
    rotation="5 MB",
    retention="30 days",
    level="ERROR",
    encoding="utf-8",
    backtrace=True,
    diagnose=True,
    enqueue=True
)