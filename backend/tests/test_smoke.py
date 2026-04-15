def test_home_route(client):
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.get_json() == {"message": "Smart Attendance backend running"}


def test_health_route(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.get_json() == {"status": "ok"}


def test_attendance_stats_route(client, monkeypatch):
    def fake_stats():
        return {"total_today": 0, "currently_present": 0}

    monkeypatch.setattr(
        "backend.app.routes.attendance_routes.get_stats_today",
        fake_stats,
    )

    resp = client.get("/attendance/stats")
    assert resp.status_code == 200
    assert resp.get_json() == {"total_today": 0, "currently_present": 0}


def test_login_invalid_credentials_returns_401(client, monkeypatch):
    def fake_admin_lookup(_username):
        return {"password": "correct-password"}

    monkeypatch.setattr(
        "backend.app.routes.auth_routes.get_admin_by_username",
        fake_admin_lookup,
    )

    resp = client.post(
        "/api/login",
        json={"username": "admin", "password": "wrong-password"},
    )

    assert resp.status_code == 401
    assert resp.get_json() == {"error": "Invalid credentials"}


def test_camera_status_shape(client):
    resp = client.get("/camera/status")
    assert resp.status_code == 200

    data = resp.get_json()
    assert isinstance(data.get("available"), bool)
    assert isinstance(data.get("opened"), bool)
    assert isinstance(data.get("message"), str)


def test_users_route_returns_list(client, monkeypatch):
    def fake_users():
        return [
            {"id": 1, "name": "karthick", "created_at": "2026-04-15T10:00:00"}
        ]

    monkeypatch.setattr(
        "backend.app.routes.user_routes.get_all_users",
        fake_users,
    )

    resp = client.get("/users")
    assert resp.status_code == 200

    data = resp.get_json()
    assert isinstance(data, list)
    assert data[0]["name"] == "karthick"

def test_user_details_route_returns_user_and_summary(client, monkeypatch):
    def fake_get_user_by_id(_user_id):
        return {"id": 1, "name": "karthick", "created_at": "2026-04-15T10:00:00"}

    def fake_get_user_attendance_summary(_user_id):
        return {"total_records": 12, "today_records": 1, "currently_present": 0}

    monkeypatch.setattr(
        "backend.app.routes.user_routes.get_user_by_id",
        fake_get_user_by_id,
    )
    monkeypatch.setattr(
        "backend.app.routes.user_routes.get_user_attendance_summary",
        fake_get_user_attendance_summary,
    )

    resp = client.get("/users/1")
    assert resp.status_code == 200

    data = resp.get_json()
    assert data["user"]["id"] == 1
    assert data["user"]["name"] == "karthick"
    assert data["summary"]["total_records"] == 12
    assert data["summary"]["today_records"] == 1
    assert data["summary"]["currently_present"] == 0

def test_user_details_route_returns_404_when_missing(client, monkeypatch):
    monkeypatch.setattr(
        "backend.app.routes.user_routes.get_user_by_id",
        lambda _user_id: None,
    )

    resp = client.get("/users/99999")
    assert resp.status_code == 404
    assert resp.get_json() == {"error": "User not found"}

