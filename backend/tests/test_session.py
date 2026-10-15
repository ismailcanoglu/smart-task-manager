
from unittest.mock import MagicMock, patch

import pytest

from app.db.session import get_db


def test_get_db_opens_and_closes_session():
    fake_session = MagicMock()

    # Context manager'ın aynı session nesnesini
    # döndürmesini sağlıyoruz.
    fake_session.__enter__.return_value = fake_session

    with patch(
        "app.db.session.SessionLocal",
        return_value=fake_session
    ) as mock_session_local:

        dependency = get_db()

        db = next(dependency)

        # Doğru session oluşturuldu mu?
        assert db is fake_session

        # SessionLocal bir kez çağrıldı mı?
        mock_session_local.assert_called_once()

        # Generator tamamlandığında with bloğundan çıkılır.
        with pytest.raises(StopIteration):
            next(dependency)

        # Context manager düzgün kapatıldı mı?
        fake_session.__exit__.assert_called_once()
