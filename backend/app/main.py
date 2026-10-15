
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.core.logging_config import setup_logging
from app.routers.tasks import router as tasks_router

setup_logging()

logger = logging.getLogger(__name__)

app = FastAPI(
    title="TaskFlow API",
    version="0.3.0",
)


@app.exception_handler(SQLAlchemyError)
async def database_exception_handler(
    request: Request,
    exc: SQLAlchemyError,
):
    logger.error(
        "Database error: %s %s",
        request.method,
        request.url.path,
        exc_info=(type(exc), exc, exc.__traceback__),
    )

    return JSONResponse(
        status_code=500,
        content={
            "detail": "Veritabani islemi tamamlanamadi."
        },
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type"],
)


app.include_router(tasks_router)


@app.get("/")
def home():
    return {
        "message": "TaskFlow API is running",
        "version": "0.3.0",
    }
