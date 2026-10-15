from sqlalchemy import text

from app.db.session import engine

with engine.begin() as conn:
    result = conn.execute(
        text("""
            INSERT INTO public.tasks (title, completed)
            VALUES (:title, :completed)
            RETURNING id
        """),
        {"title": "Python doğrudan kayıt testi", "completed": False},
    )

    task_id = result.scalar_one()
    print("Oluşturulan ID:", task_id)

with engine.connect() as conn:
    result = conn.execute(
        text("""
            SELECT id, title, completed
            FROM public.tasks
            WHERE id = :id
        """),
        {"id": task_id},
    )

    print("Veritabanındaki kayıt:", result.fetchone())
