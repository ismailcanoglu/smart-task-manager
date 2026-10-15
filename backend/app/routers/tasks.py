
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskRead

import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/tasks",
    tags=["Tasks"]
)


# READ - Görevleri listele
@router.get("", response_model=list[TaskRead])
def get_tasks(db: Session = Depends(get_db)):
    statement = select(Task).order_by(Task.id)
    return db.scalars(statement).all()


# CREATE - Yeni görev oluştur
@router.post("", response_model=TaskRead, status_code=201)
def create_task(
    payload: TaskCreate,
    db: Session = Depends(get_db)
):
    task = Task(title=payload.title)

    db.add(task)
    db.commit()
    db.refresh(task)
    logger.info("Task created: id=%s", task.id)

    return task


# UPDATE - Görev durumunu değiştir
@router.patch("/{task_id}", response_model=TaskRead)
def toggle_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    task = db.get(Task, task_id)

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    task.completed = not task.completed

    db.commit()
    logger.info(
    "Task updated: id=%s completed=%s",
    task.id,
    task.completed,
    )
    db.refresh(task)

    return task


# DELETE - Görevi sil
@router.delete("/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    task = db.get(Task, task_id)

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(task)
    db.commit()
    logger.info("Task deleted: id=%s", task_id)

    return Response(status_code=204)
