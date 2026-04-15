from backend.app.database.db_connection import get_db_connection


def get_user_by_name(name: str):
    """Return user row by lowercase trimmed name, or None."""
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM users WHERE LOWER(TRIM(name)) = %s", (name.strip().lower(),))
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result


def get_admin_by_username(username: str):
    """Return admin row by username, or None."""
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM admins WHERE username = %s", (username,))
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result


def create_user(name: str):
    """Insert a new user. Raises exception if name already exists."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO users (name) VALUES (%s)", (name.strip().lower(),))
    conn.commit()
    new_id = cur.lastrowid
    cur.close()
    conn.close()
    return new_id


def user_exists(name: str) -> bool:
    """Return True if a user with this name already exists."""
    return get_user_by_name(name) is not None


def get_all_users():
    """Return list of all registered users."""
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id, name, created_at FROM users ORDER BY name")
    results = cur.fetchall()
    cur.close()
    conn.close()
    return results

def get_user_by_id(user_id: int):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute(
        "SELECT id, name, created_at FROM users WHERE id = %s",
        (user_id,),
    )
    user = cur.fetchone()
    cur.close()
    conn.close()
    return user
