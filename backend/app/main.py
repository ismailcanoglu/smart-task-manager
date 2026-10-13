
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from pathlib import Path
from sqlalchemy import text
from app.db.session import engine

from app.routers.tasks import router as tasks_router


app = FastAPI(
    title="TaskFlow API",
    version="0.3.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type"]
)

app.include_router(tasks_router)

class TaskCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        title = value.strip()

        if len(title) < 3:
            raise ValueError("Görev başlığı en az 3 karakter olmalıdır.")

        return title

class Task(TaskCreate):
    id: int
    completed: bool = False


tasks: list[Task] = []
next_id = 1



@app.get("/")
def home():
    return {
        "message": "TaskFlow API is running",
        "version": "0.3.0"
    }


@app.get("/api/tasks", response_model=list[Task])
def get_tasks():
    return tasks


@app.post("/api/tasks", response_model=Task, status_code=201)
def create_task(payload: TaskCreate):
    global next_id

    task = Task(id=next_id, title=payload.title)
    tasks.append(task)
    next_id += 1

    return task


@app.patch("/api/tasks/{task_id}", response_model=Task)
def toggle_task(task_id: int):
    for task in tasks:
        if task.id == task_id:
            task.completed = not task.completed
            return task

    raise HTTPException(status_code=404, detail="Task not found")


@app.delete("/api/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    for index, task in enumerate(tasks):
        if task.id == task_id:
            tasks.pop(index)
            return

    raise HTTPException(status_code=404, detail="Task not found")


@app.get("/debug/database")
def debug_database():
    with engine.connect() as conn:
        database = conn.execute(
            text("SELECT current_database()")
        ).scalar()

        count = conn.execute(
            text("SELECT COUNT(*) FROM public.tasks")
        ).scalar()

    return {
        "app_file": str(Path(__file__).resolve()),
        "database": database,
        "task_count": count
    }
