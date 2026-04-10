from datetime import datetime
from backend.app.models.attendance_model import (
    get_today_record,
    create_login,
    update_logout,
    get_open_session,
)
from backend.app.models.user_model import get_user_by_name


def mark_attendance(name: str):
    """
    Mark login for a recognised face.
    - Looks up user by name.
    - Skips if already marked today.
    - Inserts a new attendance row otherwise.
    """
    user = get_user_by_name(name)

    if not user:
        print(f"[attendance_service] User not found in DB: {name}")
        return False

    user_id = user["id"]

    if get_today_record(user_id):
        print(f"[attendance_service] {name} already marked today")
        return False

    create_login(user_id, datetime.now())
    print(f"[attendance_service] Login marked for {name}")
    return True


def mark_logout(name: str):
    """
    Mark logout for a user who has left the camera frame.
    - Finds the open (no logout_time) session.
    - Sets logout_time to now.
    """
    user = get_user_by_name(name)

    if not user:
        return False

    session = get_open_session(user["id"])

    if not session:
        print(f"[attendance_service] No open session found for {name}")
        return False

    update_logout(session["id"], datetime.now())
    print(f"[attendance_service] Logout marked for {name}")
    return True


def calculate_duration(login_time, logout_time) -> str:
    """
    Return human-readable work duration string.
    e.g. '7h 45m'  or  'Still present'
    """
    if not logout_time:
        return "Still present"

    if isinstance(login_time, str):
        login_time = datetime.fromisoformat(login_time)
    if isinstance(logout_time, str):
        logout_time = datetime.fromisoformat(logout_time)

    delta = logout_time - login_time
    total_minutes = int(delta.total_seconds() // 60)
    hours, minutes = divmod(total_minutes, 60)

    if hours > 0:
        return f"{hours}h {minutes}m"
    return f"{minutes}m"