
from pydantic import ValidationError
from app.schemas.task import TaskCreate

test_titles = [
    "Vue öğren",
    "ab",
    "   ",
    "PostgreSQL öğren"
]

for title in test_titles:
    try:
        task = TaskCreate(title=title)
        print(f"GEÇERLİ: {task.title}")
    except ValidationError:
        print(f"GEÇERSİZ: {title!r}")
