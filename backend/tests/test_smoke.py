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
