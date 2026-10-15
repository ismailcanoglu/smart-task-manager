from sqlalchemy.exc import OperationalError


def test_create_task(client):
    response = client.post("/api/tasks", json={"title": "Otomatik test görevi"})

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "Otomatik test görevi"
    assert data["completed"] is False
    assert isinstance(data["id"], int)


def test_get_tasks(client):
    client.post("/api/tasks", json={"title": "Listeleme testi"})

    response = client.get("/api/tasks")

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_toggle_task(client):
    created = client.post("/api/tasks", json={"title": "Tamamlama testi"}).json()

    response = client.patch(f"/api/tasks/{created['id']}")

    assert response.status_code == 200
    assert response.json()["completed"] is True


def test_delete_task(client):
    created = client.post("/api/tasks", json={"title": "Silme testi"}).json()

    response = client.delete(f"/api/tasks/{created['id']}")

    assert response.status_code == 204

    tasks = client.get("/api/tasks").json()
    assert tasks == []


def test_invalid_task_title(client):
    response = client.post("/api/tasks", json={"title": "ab"})

    assert response.status_code == 422


def test_missing_task(client):
    response = client.patch("/api/tasks/99999")

    assert response.status_code == 404


def test_database_error_returns_500(client, monkeypatch):
    # Test sırasında veritabanı sorgusunu hata verecek
    # şekilde geçici olarak değiştiriyoruz.

    def fake_scalars(self, *args, **kwargs):
        raise OperationalError(
            "SELECT * FROM tasks", {}, Exception("Simulated database failure")
        )

    from sqlalchemy.orm import Session

    monkeypatch.setattr(Session, "scalars", fake_scalars)

    response = client.get("/api/tasks")

    assert response.status_code == 500

    assert response.json() == {"detail": "Veritabani islemi tamamlanamadi."}


def test_delete_nonexistent_task(client):
    response = client.delete("/api/tasks/99999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_toggle_task_twice(client):
    created = client.post(
        "/api/tasks", json={"title": "Iki kez tamamlama testi"}
    ).json()

    task_id = created["id"]

    first = client.patch(f"/api/tasks/{task_id}")
    assert first.status_code == 200
    assert first.json()["completed"] is True

    second = client.patch(f"/api/tasks/{task_id}")
    assert second.status_code == 200
    assert second.json()["completed"] is False


def test_whitespace_only_title(client):
    response = client.post("/api/tasks", json={"title": "     "})

    assert response.status_code == 422


def test_home(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "TaskFlow API is running",
        "version": "0.3.0",
    }
