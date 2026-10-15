
from sqlalchemy import text
from app.db.session import engine

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("BAĞLANTI BAŞARILI:", result.scalar())

except Exception as error:
    print("BAĞLANTI HATASI")
    print("Hata türü:", type(error).__name__)

    original_error = getattr(error, "orig", error)
    print("Hata detayı:", original_error)
